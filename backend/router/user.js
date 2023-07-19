import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isLogin } from "../middleware/authentication.js";
import {
  getUserByUsername,
  createUser,
  getUserByID,
  updateUser,
  getAllUser
} from "../model/user.js";

const userRouter = new express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    const oldUser = await getUserByUsername(username);
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const date = new Date();
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      userName: username,
      password: encryptedPassword,
      created_at: date,
    });
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json("user not found");
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.userId }, "secret", {
        expiresIn: "2h",
      });
      res.setHeader('Access-Control-Allow-Credentials', true); // If needed
      return res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json("Logged in successfully");
    } else {
      return res.status(401).json("password incorect");
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});
userRouter.get('/logout' , isLogin , async (req, res , next) => {
  // Set token to none and expire after 5 seconds
  res.cookie('access_token', 'none', {
      expires: new Date(Date.now()),
      httpOnly: true,
  })
  res
      .status(200)
      .json({ success: true, message: 'User logged out successfully' })
});

userRouter.get("/profile", isLogin, async (req, res, next) => {
  const user = await getUserByID(req.userId);
  return res.json(user).status(200);
});
userRouter.get("/all-user", isLogin, async (req, res, next) => {
  const user = await getAllUser()
  return res.json(user).status(200);
});


userRouter.post("/change-password", isLogin, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      return res.status(400).json("All input is required");
    }
    const user = await getUserByID(req.userId);
    if (await bcrypt.compare(oldPassword, user.password)) {
      const incryptNewPassword = await bcrypt.hash(newPassword, 10);
      const userAfterUpdate = await updateUser(req.userId, {
        password: incryptNewPassword,
        updated_at: new Date(),
      });
      return res.status(201).json(userAfterUpdate);
    }
    return res.status(401).json("password is incorect");
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});
export default userRouter;