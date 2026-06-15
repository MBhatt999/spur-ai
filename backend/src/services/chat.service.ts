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

    const knowledge =
      await knowledgeRepository.getAll();

    const lowerMessage =
      message.toLowerCase();

    let reply = "";

// ===== LIST ALL KNOWLEDGE =====

if (
  lowerMessage.includes("list all") ||
  lowerMessage.includes("all support") ||
  lowerMessage.includes("all information")
) {
  reply = knowledge
    .map(
  (item: any) =>
    `${item.title}: ${item.content}`
)
    .join("\n\n");
} else {
  // ===== DIRECT KNOWLEDGE BASE SEARCH =====

 const matchedKnowledge =
  knowledge.find((item: any) => {
      const title =
        item.title.toLowerCase();

      return (
        lowerMessage.includes(title) ||
        (title.includes("payment") &&
          lowerMessage.includes("payment")) ||
        (title.includes("tracking") &&
          lowerMessage.includes("track")) ||
        (title.includes("cancellation") &&
          lowerMessage.includes("cancel")) ||
        (title.includes("shipping") &&
          lowerMessage.includes("ship")) ||
        (title.includes("return") &&
          lowerMessage.includes("return")) ||
        (title.includes("support") &&
          lowerMessage.includes("support"))
      );
    });

  if (matchedKnowledge) {
    reply = matchedKnowledge.content;
  } else {
      // ===== GEMINI FALLBACK =====

      const history =
        await messageRepository.getConversationMessages(
          conversation.id
        );

      const knowledgeText = knowledge
  .map(
    (item: any) =>
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

      try {
        reply =
          await llmService.generateReply(
            prompt
          );
      } catch (error) {
        console.error(
          "========== GEMINI ERROR =========="
        );
        console.error(error);
        console.error(
          "=================================="
        );

        reply =
          "Sorry, I'm currently unable to respond.";
      }
    }
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