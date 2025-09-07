import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { Search } from "../models/search.model";

export const getAllChat = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({
        status: "success",
        message: "All chats fetched successfully",
        data: chats,
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const getChatFromId = async (req: Request, res: Response) => {
  try {
    const searches = await Search.find({ chatId: req.params.id }).sort({
      createdAt: -1,
    });
    if (!searches) {
      return res.status(404).json({ error: "Search not found" });
    }
    res.status(200).json({
      status: "success",
      message: "All chats fetched successfully",
      data: searches,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch searches" });
  }
};
