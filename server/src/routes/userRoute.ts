import express from "express";
import bcrypt from "bcryptjs";
import User, { UserProps } from "../models/User";
import jwt from "jsonwebtoken";
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
console.log("============================================");

console.log(process.env.SECRET);

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
      const refreshtoken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.SECRET,
        {
          expiresIn: "100000000",
        }
      );
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 12 * 60 * 60,
        path: "/",
      });

      const safeUser = {
        id: user.id,
        isAdmin: user.isAdmin,
      };

      res.json({ accesstoken, user: safeUser });
    } else {
      res.status(530).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error on logginin" });
  }
});

// TODO: verify token
// Do i need it

// router.post("/verify-user", async (req, res) => {
//   console.log(req.cookies);
//   try {
//     const { refreshtoken } = req.cookies;
//     console.log(refreshtoken);

//     jwt.verify(
//       refreshtoken,
//       "Secret",
//       async (err: Error | null, decode: Object | null) => {
//         if (err)
//           return res.status(400).json({ message: "Invalid refreshtoken" });

//         const user = decode as UserProps;

//         const newAccessToken = jwt.sign(
//           { id: user.id, isAdmin: user.isAdmin },
//           process.env.ACCESS_TOKEN_SECRET,
//           { expiresIn: "1h" }
//         );
//         res.json({ accesstoken: newAccessToken, user });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

router.post("/logout", (req, res) => {
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  res.status(200).send("Sucessfully logged out");
});

export default router;
