import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.routes.js";
import challanRoutes from "./routes/challan.routes.js";
import lawRoutes from "./routes/law.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";

const app = express();

// ✅ CORS (VERY IMPORTANT)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/challan", challanRoutes);
app.use("/api/laws", lawRoutes);
app.use("/api/chatbot", chatbotRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 ShadowRoad AI Backend Running...");
});

// ❌ 404 handler (recommended)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong on server",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
