import { Router } from "express";
import { PrismaClient } from "database";
import auth from "../middleware/auth";
import {
  uploadMultipartToS3,
  upload,
  uploadToYoutube,
} from "../utils/uploadUtility";
import { type } from "node:os";

const prisma = new PrismaClient();
const router = Router();

//  @method  GET
//  @route   /workspace
//  @access  Private
//  @desc    Get all user workspaces

router.get("/", auth, async (req: any, res: any) => {
  try {
    let ws = await prisma.user.findUnique({
      where: {
        id: req.user,
      },
      select: {
        createdWorkspaces: {
          select: {
            id: true,
            name: true,
            expiresIn: true,
            createdOn: true,
            participants: {
              select: {
                id: true,
              },
            },
          },
        },
        participantInWS: {
          select: {
            id: true,
            name: true,
            expiresIn: true,
            createdOn: true,
            participants: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    if (!ws) {
      throw new Error("Workspace not found");
    }

    res.status(200).json({ ws });
  } catch (error) {
    console.error(error);
    res.status(500).send({ type: "error", msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }
});

//  @method  POST
//  @route   /workspace/new
//  @access  Private
//  @desc    Create a new workspace

router.post("/new", auth, async (req: any, res: any) => {
  try {
    const ownerId = req.user;

    const ws_name = req.body.name;

    const ws = await prisma.workspace.create({
      data: {
        name: ws_name,
        creatorId: ownerId,
      },
    });

    res.status(200).json({
      msg: "Created new workspace",
      ws: {
        ...ws,
        workspaceToken: null,
      },
      type: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ type: "error", msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }
});

//  @method  GET
//  @route   /workspace/:workspaceId/
//  @access  Private
//  @desc    Get workspace data
router.get("/:workspaceId", auth, async (req: any, res: any) => {
  try {
    const ws = await prisma.workspace.findUnique({
      where: {
        id: req.params.workspaceId,
      },
      select: {
        id: true,
        name: true,
        participants: {
          select: {
            email: true,
          },
        },
        createdOn: true,
        expiresIn: true,
      },
    });
    if (!ws) return res.status(404).json({ msg: "Workspace not found" });
    res.status(200).json({ ...ws, workspaceToken: null });
  } catch (error) {
    console.error(error);
    res.status(500).send({ type: "error", msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }
});

//  @method  POST
//  @route   /workspace/:workspaceId/update
//  @access  Private
//  @desc    Add workspace participants

router.post("/:workspaceId/update", auth, async (req: any, res: any) => {
  try {
    const userID = req.user;
    const workspaceId = req.params.workspaceId;
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        participants: true,
      },
    });
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.creatorId !== userID)
      return res.status(403).json({
        msg: "User is not authorised for the action",
        type: "FAILURE",
      });
    const { name, participants } = req.body;
    let usersToAdd = await prisma.user.findMany({
      where: {
        email: {
          in: participants.split(" "),
        },
      },
      select: {
        id: true,
      },
    });

    const usersToRemove = workspace.participants.map((participant) => ({
      id: participant.id,
    }));
    if (usersToAdd !== usersToRemove) {
      await prisma.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          name: name,
          participants: {
            disconnect: usersToRemove,
            connect: usersToAdd,
          },
        },
      });
    }
    res.json({
      msg: "Updated the workspace successfully",
      type: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ type: "error", msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }
});

//  @method  DELETE
//  @route   /workspace/:workspaceId
//  @access  Private
//  @desc    Handle delete workspace request

router.delete("/:workspaceId", [auth], async (req: any, res: any) => {

  try {
    const ws = await prisma.workspace.findUnique({
      where: {
        id: req.params.workspaceId
      },
      select: {
        creatorId: true
      }
    })
    if (!ws) {
      return res.status(404).json({ type: "error", msg: "Workspace with given id not found!" })
    }
    if (req.user != ws?.creatorId) {
      return res.status(401).json({ type: "error", msg: "You are not authorised to prune this workspace." })
    }
    await prisma.uploads.deleteMany({
      where: {
        workspaceId: req.params.workspaceId
      }
    })

    await prisma.workspace.delete({
      where: {
        id: req.params.workspaceId
      }
    })
    res.status(200).json({ type: "success", msg: "Successfully deleted the workspace" })
  } catch (error) {
    console.error(error);
    res.status(500).send({ type: "error", msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }

})

//  @method  POST
//  @route   /workspace/:workspaceId/upload/server
//  @access  Private
//  @desc    Handle upload requests

router.post(
  "/:workspaceId/upload/metadata",
  [auth],
  async (req: any, res: any) => {
    try {
    } catch (error) {
      console.error(error);
      res.status(500).send({ type: "error", msg: "Server Error encountered" });
    }
  },
);

//  @method  POST
//  @route   /workspace/:workspaceId/upload/video
//  @access  Private
//  @desc    Handle upload requests

router.post(
  "/:workspaceId/upload/video",
  [auth, upload.array("vidFile", 10000)],
  async (req: any, res: any) => {
    try {
      const ws = await prisma.workspace.findUnique({
        where: {
          id: req.params.workspaceId,
        },
        select: {
          creatorId: true,
        },
      });
      if (ws?.creatorId !== req.user) {
        return res.json({ msg: "Sent request to the owner to upload" });
      }

      console.log({
        uploadFileKey: req.params.workspaceId,
        uploadId: req.body.uploadId || "",
        bucket: process.env.AWS_S3_BUCKET || "",
        partNumber: req.body.part_number,
      });
      const data = await uploadMultipartToS3(
        {
          uploadFileKey: req.params.workspaceId,
          uploadId: req.body.uploadId || "",
          bucket: process.env.AWS_S3_BUCKET || "",
          partNumber: parseInt(req.body.part_number),
        },
        parseInt(req.body.total_parts),
      );
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ type: "error", msg: "Server Error encountered" });
    } finally {
      await prisma.$disconnect();
    }
  },
);

//  @method  POST
//  @route   /workspace/:workspaceId/upload/youtube
//  @access  Private
//  @desc    Handle upload to youtube

router.post("/:workspaceId/upload/youtube", async (req, res) => {
  const workspaceId = req.params.workspaceId;
  try {
    const response = await uploadToYoutube(
      "TITLE",
      "DESCRIPTION",
      workspaceId,
      "someid",
      process.env.AWS_S3_BUCKET || "",
    );
    if (null != response.error) throw response.error;
    res
      .status(200)
      .json({ type: "success", msg: "Uploaded to youtube successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        type: "error",
        msg: "Server Error encountered while uploading the video",
      });
  } finally {
    await prisma.$disconnect();
  }
  res.status(200);
});
export default router;
