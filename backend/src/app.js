import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Default Route");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port: https://localhost:8000");
});

export default app;
