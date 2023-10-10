import { Router } from "express";
import { PrismaClient } from "database";
import auth from "../middleware/auth";
import uploadFile from "../utils/uploadToYT";
import multer from "multer";

const upload = multer({ dest: "./assets" });

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
    res.status(500).send({ msg: "Server Error encountered" });
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
    res.status(500).send({ msg: "Server Error encountered" });
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
    res.status(500).send({ msg: "Server Error encountered" });
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
    res.status(500).send({ msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }
});

//  @method  POST
//  @route   /workspace/:workspaceId/upload
//  @access  Private
//  @desc    Handle upload requests

router.post(
  "/:workspaceId/upload",
  [auth, upload.any()],
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
      const data = await uploadFile(
        req.body.title,
        req.body.description,
        `./assets/${req.files[0].filename}`, //video file
        // `./assets/${req.files[1] ? req.files[1].filename : ""}`, // thumbnail
        req.params.workspaceId
      );
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Server Error encountered" });
    } finally {
      await prisma.$disconnect();
    }
  }
);

export default router;
