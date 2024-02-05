import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserProps } from "../models/User";

export interface customRequest extends Request {
  user?: UserProps;
}

const cookieToken = (req: customRequest, res: Response, next: NextFunction) => {
  const token = req.cookies["token"];
  if (!token) {
    return res
      .status(401)
      .json({ message: "cookie token is missing or invalid" });
  }

  jwt.verify(token, process.env.SECRET, (err: any, user: UserProps) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user as UserProps;
    next();
  });
};

const isAdmin = (req: customRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ message: "unauthorized" });
  }

  next();
};

const isUser = (req: customRequest, res: Response, next: NextFunction) => {
  const isAdmin = req.user.isAdmin;
  if (isAdmin) {
    return res.status(403).json({ message: "unauthorized" });
  }

  next();
};

export { cookieToken, isAdmin , isUser};
