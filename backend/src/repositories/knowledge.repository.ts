import { prisma } from "../prisma/prisma";

export const knowledgeRepository = {
  async getAll() {
    return prisma.knowledgeBase.findMany();
  },
};