import { Router } from "express";
import { searchHandler } from "../controllers/search.controller";
import { geminiSearchHandler } from "../controllers/gemini.controller";
import { upload } from "../utils/upload";
import {
  getAllChat,
  getChatFromId,
  deleteChat,
} from "../controllers/chat.controller";

const router = Router();

router.get("/chat/all", getAllChat);
router.get("/chat/:id", getChatFromId);

router.post("/search", upload.single("image"), searchHandler);
router.post("/search/gemini", upload.single("image"), geminiSearchHandler);
router.delete("/delete/:id", deleteChat);

export default router;
