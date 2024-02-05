import express from "express";
import bcrypt from "bcryptjs";
import User, { UserProps } from "../models/User";
import jwt from "jsonwebtoken";
import { cookieToken, customRequest } from "../middlewere/middlewere";

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
      isAdmin,
    });

    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    res
      .status(501)
      .json({ success: false, message: "Error on creating the user " });
  }
});

router.post("/login/user", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const accesstoken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.SECRET,
        {
          expiresIn: "1h",
        },
      );
      res.cookie("token", accesstoken, {
        httpOnly: true,
        maxAge: 7000000,
      });

      const safeUser = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };

      if (!safeUser.isAdmin) {
        res.status(200).json({
          success: true,
          message: "Logged in succesfully",
          data: safeUser,
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials", data: null });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid credentials", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", data: null });
  }
});

router.post("/login/admin", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const accesstoken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.SECRET,
        {
          expiresIn: "1h",
        },
      );
      res.cookie("token", accesstoken, {
        httpOnly: true,
        maxAge: 7000000000000000,
      });

      const safeUser = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };

      if (safeUser.isAdmin) {
        res.status(200).json({
          success: true,
          message: "Logged in succesfully",
          data: safeUser,
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials", data: null });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid credentials", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", data: null });
  }
});

router.use(cookieToken);

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).send("Sucessfully logged out");
});

router.get("/get", async (req: customRequest, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "username", "isAdmin"],
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

export default router;
