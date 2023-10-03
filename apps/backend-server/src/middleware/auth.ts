import { NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = (req: any, res: any, next: NextFunction) => {
  let token = req.cookies.token;
  if (!token) return res.status(403).json({ msg: "Authentication error" });

  jwt.verify(token, process.env.jwtSecret, (err: any, user: any) => {
    if (err) {
      res.clearCookie("token");
      return res.status(403).json({ msg: "Authentication error" });
    }
    req.user = user.user;
    next();
  });
};

export default auth;
