import { Request, Response } from "express";
import { chatSchema } from "../validators/chat.validator";
import { chatService } from "../services/chat.service";
import { conversationRepository } from "../repositories/conversation.repository";

export const chatController = {
  async sendMessage(
    req: Request,
    res: Response
  ) {
    try {
      const data = chatSchema.parse(req.body);

      const result =
        await chatService.processMessage(
          data.message,
          data.conversationId
        );

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid request",
      });
    }
  },

  async getHistory(
    req: Request,
    res: Response
  ) {
    try {
      const conversationId = String(
        req.params.conversationId
      );

      if (!conversationId) {
        return res.status(400).json({
          error: "Conversation ID is required",
        });
      }

      const messages =
        await chatService.getHistory(
          conversationId
        );

      return res.json(messages);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch history",
      });
    }
  },

  async getConversations(
    req: Request,
    res: Response
  ) {
    try {
      const conversations =
        await conversationRepository.getAll();

      return res.json(conversations);
    } catch (error) {
      return res.status(500).json({
        error:
          "Failed to fetch conversations",
      });
    }
  },
};