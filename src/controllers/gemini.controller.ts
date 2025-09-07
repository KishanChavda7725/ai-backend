import { Request, Response } from "express";
import path from "path";
import { Search } from "../models/search.model";
import { Chat } from "../models/chat.model";

import fs from "fs";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

export const geminiSearchHandler = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const prompt = req.body.prompt as string;
    let chatId = req?.body?.chatId || ("" as string);
    const file = req.file;
    const image = file ? file.filename : undefined;

    if (!prompt && !image) {
      return res
        .status(400)
        .json({ error: "Please provide a prompt or at least one image" });
    }
    let resultText = "";
    const imageUrl = image
      ? `${process.env.BASE_URL}/uploads/${image}`
      : undefined;
    let resultImagePath: string | undefined;

    let result;
    try {
      if (chatId === "") {
        const newChat = await Chat.create({
          name: prompt ? prompt.substring(0, 20) + "..." : "New Chat",
        });
        if (newChat?._id) {
          chatId = newChat._id.toString();
        } else {
          return res
            .status(500)
            .json({ error: "Failed to create new chat session" });
        }
      } else {
        const existingChat = await Chat.findById(chatId);
        if (!existingChat) {
          return res
            .status(404)
            .json({ error: "Chat session not found with provided chatId" });
        }
      }
      if (image && prompt) {
        // Prompt + Image
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision---",
        });
        const imagePath = path.join(__dirname, "../../uploads", image);
        if (!fs.existsSync(imagePath)) {
          console.error("Image file not found:", imagePath);
          return res
            .status(400)
            .json({ error: "Uploaded image not found on server." });
        }
        const imageBuffer = fs.readFileSync(imagePath);
        result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType: "image/png",
                  },
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.7 },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        });
      } else if (image && !prompt) {
        // Image only
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision---",
        });
        const imagePath = path.join(__dirname, "../../uploads", image);
        if (!fs.existsSync(imagePath)) {
          console.error("Image file not found:", imagePath);
          return res
            .status(400)
            .json({ error: "Uploaded image not found on server." });
        }
        const imageBuffer = fs.readFileSync(imagePath);
        result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType: "image/png",
                  },
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.7 },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        });
      } else {
        // Prompt only
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        });
      }
      // Log the raw Gemini response for debugging
      //   console.log('Gemini raw response:', JSON.stringify(result, null, 2));
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      return res.status(422).json({
        error: "Gemini API error",
        details: apiError instanceof Error ? apiError.message : apiError,
      });
    }

    resultText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const searchRecord = await Search.create({
      chatId: chatId,
      prompt,
      result: resultText,
      images: image ? [`/uploads/${image}`] : [],
      resImages: [],
    });
    // const searchRecord = await Search.find({ chatId })
    //   .sort({ createdAt: -1 })
    //   .exec();
    res.status(201).json({
      status: "success",
      message: "Search saved successfully (Gemini)",
      data: searchRecord,
    });
  } catch (error) {
    console.error("Gemini Handler Error:", error);
    res.status(422).json({
      error: error instanceof Error ? error.message : error,
    });
  }
};
