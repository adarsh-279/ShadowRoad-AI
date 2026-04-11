import express from "express";
import { chatbotReply } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/", chatbotReply);

export default router;
