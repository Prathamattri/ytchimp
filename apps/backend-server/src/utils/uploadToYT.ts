import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import { PrismaClient } from "database";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
var scopes = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
];

//Initializing the youtube api library
const youtube = google.youtube("v3");

async function uploadFile(
  title: string,
  description: string,
  filename: string,
  id: string
) {
  // const authToken = await prisma.workspace.findFirst({
  //   where: {
  //     id: id,
  //   },
  //   select: {
  //     workspaceToken: true,
  //   },
  // });
  const auth = await authenticate({
    keyfilePath: `${__dirname}/oauth.json`,
    scopes,
  });
  // await prisma.workspace.update({
  //   where: {
  //     id: id,
  //   },
  //   data: {
  //     workspaceToken: JSON.stringify(auth),
  //   },
  // });

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
      body: fs.createReadStream(filename),
    },
  });
  fs.unlink(filename, (err) => {
    if (err) console.error(err);
  });

  return response.data;
}

export default uploadFile;
