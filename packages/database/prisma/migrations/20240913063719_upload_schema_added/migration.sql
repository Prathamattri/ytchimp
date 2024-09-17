-- CreateTable
CREATE TABLE "Uploads" (
    "id" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoDescription" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "defaultLanguage" TEXT,
    "privacyStatus" TEXT NOT NULL,
    "uploadPending" BOOLEAN NOT NULL DEFAULT true,
    "workspaceId" TEXT NOT NULL,
    "initiatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Uploads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "Uploads_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
