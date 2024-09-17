import { Response, Router } from "express";
import { UserObjectTypes } from "common";
import { PrismaClient } from "database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth";
import {
  body,
  check,
  FieldValidationError,
  ValidationError,
  validationResult,
} from "express-validator";

const router = Router();
const prisma = new PrismaClient();

//  @method  POST
//  @route   /user/register
//  @access  Public

router.post("/register", async (req: any, res: any) => {
  try {
    const { name, email, password }: UserObjectTypes = req.body.data;

    // Check if email already taken
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) return res.status(403).json({ msg: "User already exists!" });

    //Hashing the password
    const salt = await bcrypt.genSalt();
    const encPass = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: encPass,
        name: name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const token = jwt.sign({ user: newUser.id }, process.env.jwtSecret, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true }).json({
      message: "User created successfully",
      user: newUser,
      type: "success",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ type: "error", msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }
});

//  @method  POST
//  @route   /user/login
//  @access  Public

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Given Email is not valid"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Minimum length must be 8"),
  ],
  async (req: any, res: Response) => {
    try {
      const validationResponse = validationResult(req);
      if (!validationResponse.isEmpty()) {
        return res
          .status(401)
          .json({
            type: "error",
            msg: validationResponse
              .array()
              .map((result: any) => `${result.path} : ${result.msg}`),
          });
      }
      const { email, password }: UserObjectTypes = req.body;

      //Check if email is correct
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user)
        return res
          .status(403)
          .json({ type: "error", msg: "Invalid Email or Password!" });

      if (!(await bcrypt.compare(password, user.password))) {
        return res
          .status(403)
          .json({ type: "error", msg: "Invalid Email or Password!" });
      }

      const token = jwt.sign({ user: user.id }, process.env.jwtSecret, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { httpOnly: true }).json({
        type: "success",
        msg: "Login Successful",
        user: {
          ...user,
          password: null,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ type: "error", msg: "Server Error encountered" });
    } finally {
      await prisma.$disconnect();
    }
  },
);

//  @method  Get
//  @route   /user/me
//  @access  Private

router.get("/me", auth, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.user,
      },
      select: {
        email: true,
        name: true,
        gravatar: true,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ type: "error", msg: "Server Error encountered" });
  } finally {
    await prisma.$disconnect();
  }
});

//  @method  POST
//  @route   /user/logout
//  @access  Private
//  @desc    Logout the user

router.post("/logout", auth, async (req: any, res: Response) => {
  res.clearCookie("token");
  res.send("User logged out");
});

export default router;
