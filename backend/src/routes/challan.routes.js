import express from "express";
import { checkChallan } from "../controllers/challan.controller.js";

const router = express.Router();

router.post("/check", checkChallan);

export default router;
