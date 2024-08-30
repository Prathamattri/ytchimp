import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import { PrismaClient } from "database";
import { InitiateMultipartUploadType, S3UploadObjectType } from "../types";
import { CompletedPart, CompleteMultipartUploadCommand, CompleteMultipartUploadCommandInput, CreateMultipartUploadCommand, S3Client, UploadPartCommand, UploadPartCommandInput } from "@aws-sdk/client-s3"
import fs from "node:fs"
import multer from "multer";

const prisma = new PrismaClient();
var scopes = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
];

//AWS S3 client
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET || ""
  },
  region: process.env.AWS_S3_REGION || "ap-south-1",

});

// const s3Storage = multerS3({
//   s3: s3,
//   bucket: process.env.AWS_S3_BUCKET || "",
//   acl: "private",
//   key: (req, file, cb) => {
//     console.log("hi")
//     console.log(req)
//     // cb(null, `${requrl.split("/")[1]}_${file.originalname}`)
//     cb(null, file.originalname)
//   },
// })

export const upload = multer({
  storage:
    multer.diskStorage({
      destination: function(_, file, cb) {
        cb(null, __dirname + "/uploadFile")
      },
      filename: function(req, file, cb) {
        console.log("Part num : " + req.headers["part-to-process"])
        //FileName is workspaceID_partnumber
        cb(null, `${req.url.split("/")[1]}_${file.originalname}`);
      },
    }),
  limits: {
    fileSize: 11 * 1024 * 1024,
  }
});

const youtube = google.youtube("v3"); //Initializing the youtube api library

async function initiateUploadToS3<InputType extends Omit<InitiateMultipartUploadType, 'uploadId' | 'error' | 'responseType'>>({ bucket, uploadFileKey }: InputType): Promise<InitiateMultipartUploadType> {
  try {
    const initiatUploadCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: uploadFileKey
    })
    const response = await s3.send(initiatUploadCommand);

    return {
      error: null,
      responseType: "ok",
      bucket: bucket,
      uploadFileKey: uploadFileKey,
      uploadId: response.UploadId!
    }
  } catch (error) {
    console.error(error)
    return {
      error: error,
      responseType: "error",
      bucket: bucket,
      uploadFileKey: uploadFileKey,
      uploadId: ""
    }
  }
}

let completedPartsMap: Map<string, CompletedPart[]> = new Map();


export async function uploadMultipartToS3({ bucket, uploadFileKey, partNumber, uploadId = "" }: S3UploadObjectType, totalParts: number) {
  let uploadInitiationResponse: InitiateMultipartUploadType;
  if (uploadId == "") {
    completedPartsMap.set(uploadFileKey, [])

    uploadInitiationResponse = await initiateUploadToS3({ bucket, uploadFileKey })
    if (uploadInitiationResponse.responseType == "error") {
      throw new Error("Problem Initiating multipart upload to S3 bucket")
    }
    uploadId = uploadInitiationResponse.uploadId;
  }
  const input: UploadPartCommandInput = {
    "Body": fs.createReadStream(`${__dirname}/uploadFile/${uploadFileKey}_${partNumber}`),
    "Bucket": bucket,
    "Key": uploadFileKey,
    "PartNumber": partNumber,
    "UploadId": uploadId,
  };
  const uploadMultipartCommand = new UploadPartCommand(input);
  try {
    const response = await s3.send(uploadMultipartCommand);
    console.log("Uploaded part ", partNumber)
    console.log(response.ETag)

    const copyArray = completedPartsMap.get(uploadFileKey) as CompletedPart[]
    copyArray.push({
      "PartNumber": partNumber,
      "ETag": response.ETag
    })
    completedPartsMap.set(uploadFileKey, copyArray);
  } catch (error) {
    console.log(error);
  }
  if (partNumber == totalParts) {
    const input: CompleteMultipartUploadCommandInput = {
      "Bucket": bucket,
      "Key": uploadFileKey,
      "UploadId": uploadId,
      "MultipartUpload": {
        "Parts": completedPartsMap.get(uploadFileKey)
      },
    }
    console.log("completeMultipartUploadCommand initiated")

    try {
      const completeMultipartUploadCommand = new CompleteMultipartUploadCommand(input);
      const response = await s3.send(completeMultipartUploadCommand);
      console.log({ msg: "completed upload", exp: response.Expiration })

      // cleaning up server storage
      fs.readdir(__dirname + "/uploadFile", (error, files) => {
        if (error) throw error;
        const regex = new RegExp(`${uploadFileKey}`)
        files
          .filter(name => regex.test(name))
          .forEach(file => fs.unlinkSync(__dirname + "/uploadFile/" + file))
      })

    } catch (error) {
      console.log(error)
      throw error
    }
  }
  return {
    uploadId,
    error: null
  }
}



export async function uploadFile(
  title: string,
  description: string,
  filename: string,
  id: string
) {
  const authToken = await prisma.workspace.findFirst({
    where: {
      id: id,
    },
    select: {
      workspaceToken: true,
    },
  });
  const auth = await authenticate({
    keyfilePath: `${__dirname}/google_oauth.json`,
    scopes,
  });

  google.options({ auth });

  const response = await youtube.videos.insert({
    part: ["id", "snippet", "status"],
    notifySubscribers: false,
    requestBody: {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: "private",
      },
    },
    media: {
      // body: fs.createReadStream(filename),
    },
  });
  // fs.unlink(filename, (err) => {
  //   if (err) console.error(err);
  // });

  return response.data;
}

