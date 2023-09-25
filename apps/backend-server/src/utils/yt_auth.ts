import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();
var scopes = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
];

//Initializing the youtube api library
const youtube = google.youtube("v3");

async function uploadFile(filename: string) {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "./oauth.json"),
    scopes,
  });

  // await prisma.workspace.update({
  //   where:{
  //     id: "abc"
  //   },data:{
  //     workspaceToken: JSON.stringify(auth)
  //   }
  // })
  google.options({ auth });
}

export default uploadFile;
