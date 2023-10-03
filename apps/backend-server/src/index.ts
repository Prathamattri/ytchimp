import express from "express";
import userRouter from "./routers/user";
import workspaceRouter from "./routers/workspace";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
const app = express();
const PORT = 3001 || process.env.PORT;

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.frontEndURL }));
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/workspace", workspaceRouter);

app.get("/", (req: any, res: any) => {
  res.status(200).json({ msg: "YT chimp api!" });
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
