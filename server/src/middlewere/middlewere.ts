import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserProps } from "../models/User";
require("dotenv").config();

interface customRequest extends Request {
  user?: UserProps;
}

const authenticationToken = (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null)
    return res.status(401).json({ message: "No token Found" });

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: err });
    req.user = user as UserProps;
    console.log(req.user);
    next();
  });
};
const isAdmin = (req: customRequest, res: Response, next: NextFunction) => {
  console.log(req.user);
  if (req.user && !req.user.isAdmin) {
    return res.status(401).json({ message: "User is not admin" });
  }
  next();
};

export { isAdmin, authenticationToken };
