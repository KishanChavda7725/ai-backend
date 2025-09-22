import { Router } from "express";
import { geminiSearchHandler } from "../controllers/gemini.controller";
import { upload } from "../utils/upload";
const router = Router();

router.post("/gemini", upload.single("image"), geminiSearchHandler);

export default router;
