import express from "express";
import bcrypt from "bcryptjs";
import User, { UserProps } from "../models/User";
import jwt from "jsonwebtoken";
import { cookieToken, customRequest } from "../middlewere/middlewere";
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, email, isAdmin } = req.body;
  try {
    const exisitingUser = await User.findOne({ where: { email: email } });
    if (exisitingUser) {
      return res.status(400).json({ message: "Email already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user: UserProps = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
      // isAdmin,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error on creating the user ", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const accesstoken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", accesstoken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7000000000000000,
      });

      const safeUser = {
        id: user.id,
        isAdmin: user.isAdmin,
      };

      res.json({ user: safeUser });
    } else {
      res.status(530).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error on logginin" });
  }
});

router.use(cookieToken);

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  res.status(200).send("Sucessfully logged out");
});

router.get("/get", async (req: customRequest, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "isAdmin"],
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

router.get("/verify-user", async (req, res) => {
  res.send("hello you are verified with cookie");
});

export default router;
