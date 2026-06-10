import { Router } from "express";
import { chatController } from "../controllers/chat.controller";

const router = Router();

router.post(
  "/message",
  chatController.sendMessage
);

router.get(
  "/history/:conversationId",
  chatController.getHistory
);

export default router;