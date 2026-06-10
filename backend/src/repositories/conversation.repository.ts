import { prisma } from "../prisma/prisma";

export const conversationRepository = {
  async create() {
    return prisma.conversation.create({
      data: {},
    });
  },

  async findById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
    });
  },
};