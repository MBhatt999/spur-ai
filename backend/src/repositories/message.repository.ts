import { prisma } from "../prisma/prisma";

export const messageRepository = {
  async create(
    conversationId: string,
    sender: "USER" | "AI",
    text: string
  ) {
    return prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });
  },

  async findByConversationId(
    conversationId: string
  ) {
    return prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async getConversationMessages(
    conversationId: string
  ) {
    return prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
};