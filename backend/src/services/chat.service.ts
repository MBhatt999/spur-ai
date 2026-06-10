import { conversationRepository } from "../repositories/conversation.repository";
import { messageRepository } from "../repositories/message.repository";
import { knowledgeRepository } from "../repositories/knowledge.repository";
import { llmService } from "./llm.service";

export const chatService = {
  async processMessage(
    message: string,
    conversationId?: string
  ) {
    let conversation;

    if (conversationId) {
      conversation =
        await conversationRepository.findById(
          conversationId
        );
    }

    if (!conversation) {
      conversation =
        await conversationRepository.create();
    }

    await messageRepository.create(
      conversation.id,
      "USER",
      message
    );

    const history =
      await messageRepository.getConversationMessages(
        conversation.id
      );

    const knowledge =
      await knowledgeRepository.getAll();

    const knowledgeText = knowledge
      .map(
        (item) =>
          `${item.title}: ${item.content}`
      )
      .join("\n\n");

    const historyText = history
      .map(
        (msg) =>
          `${msg.sender}: ${msg.text}`
      )
      .join("\n");

    const prompt = `
You are a helpful customer support agent for an e-commerce store.

Use the knowledge base below when answering.

KNOWLEDGE BASE:
${knowledgeText}

CONVERSATION HISTORY:
${historyText}

LATEST USER MESSAGE:
${message}

Rules:
- Answer clearly and concisely.
- Prefer information from the knowledge base.
- If the answer is not in the knowledge base, say you are unsure.
`;

    console.log("\n===== PROMPT =====\n");
    console.log(prompt);
    console.log("\n==================\n");

    let reply = "";

    try {
      reply =
        await llmService.generateReply(
          prompt
        );
    } catch (error: any) {
      console.error(
        "========== GEMINI ERROR =========="
      );
      console.error(error);
      console.error(
        "=================================="
      );

      reply =
        "Sorry, I'm currently unable to respond. Please try again later.";
    }

    await messageRepository.create(
      conversation.id,
      "AI",
      reply
    );

    return {
      conversationId: conversation.id,
      reply,
    };
  },

  async getHistory(
    conversationId: string
  ) {
    return messageRepository.getConversationMessages(
      conversationId
    );
  },
};