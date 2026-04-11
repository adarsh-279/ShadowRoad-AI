import express from "express";
import { getLaws, seedLaws } from "../controllers/law.controller.js";

const router = express.Router();

router.get("/", getLaws);
router.post("/seed", seedLaws);

export default router;
