import { Router } from "express";
import {
  getAllChat,
  getChatFromId,
  deleteChat,
} from "../controllers/chat.controller";

const router = Router();

router.get("/all", getAllChat);
router.get("/:id", getChatFromId);
router.delete("/delete/:id", deleteChat);

export default router;
