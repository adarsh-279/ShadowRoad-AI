import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


async function registerController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide all the required fields",
    });
  }

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.status(409).json({
      message: "Account already exists with this email",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });
    
    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    message: "User registered sucessfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide all the required fields",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invaid email or password",
    });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(400).json({
      message: "Invaid email or password",
    });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    message: "User logged in sucessfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function getMeController(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized. Login first!",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized. Login first!",
    });
  }

  return res.status(200).json({
    message: "User details fetched",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}

async function logoutController(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized. Login first!",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  res.clearCookie("token");

  return res.status(200).json({
    message: "Logged out sucessfully",
  });
}

export default {
  registerController,
  loginController,
  getMeController,
  logoutController,
};
