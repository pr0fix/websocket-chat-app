import express, { Request, Response } from "express";
import mongoose from "mongoose";
import conversationService from "../services/conversationService";
import Conversation from "../models/conversation";
import { authenticateToken } from "../middleware/authenticateToken";

interface ConversationRequestBody {
  users: string[];
}

interface MessageRequestBody {
  sender: string;
  text: string;
}

const router = express.Router();

router.get(
  "/conversation",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { users }: ConversationRequestBody = req.body;

      if (!users || !Array.isArray(users) || users.length === 0) {
        res.status(400).json({ error: "Invalid users array" });
        return;
      }

      const userIds = users.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );
      const conversation = await conversationService.findConversation(userIds);

      if (!conversation) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to find conversation" });
    }
  }
);

router.post(
  "/conversation",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { users }: ConversationRequestBody = req.body;

      if (!users || !Array.isArray(users) || users.length < 2) {
        res.status(400).json({ error: "Invalid users array" });
        return;
      }
      const userIds = users.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );

      const conversation = await conversationService.createConversation(
        userIds
      );
      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create conversation" });
    }
  }
);

router.post(
  "/conversation/:id/messages",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { sender, text }: MessageRequestBody = req.body;

      if (!sender || !text) {
        res.status(400).json({ error: "Invalid message data" });
        return;
      }

      const conversationId = new mongoose.Types.ObjectId(req.params.id);
      const senderId = new mongoose.Types.ObjectId(sender);

      const message = await conversationService.saveMessage(
        conversationId,
        senderId,
        text,
        new Date()
      );

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);

export default router;
