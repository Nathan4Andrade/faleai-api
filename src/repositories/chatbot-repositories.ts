import { Chatbot, Prisma } from "@prisma/client";
import { prisma } from "@/config";

async function createChatbot(data: Prisma.ChatbotCreateInput) {
  return prisma.chatbot.create({
    data,
  });
}

async function findChatbotById(chatbotId: number) {
  return prisma.chatbot.findUnique({
    where: {
      id: chatbotId,
    },
  });
}

async function deleteChatbot(chatbotId: number) {
  return prisma.chatbot.delete({
    where: {
      id: chatbotId,
    },
  });
}

async function updateChatbot(
  chatbotId: number,
  data: Prisma.ChatbotUncheckedUpdateInput
) {
  return prisma.chatbot.update({
    where: {
      id: chatbotId,
    },
    data,
  });
}

async function findAllChatbots() {
  return prisma.chatbot.findMany();
}

async function findChatbotByName(name: string) {
  return prisma.chatbot.findFirst({
    where: {
      name,
    },
  });
}

export type CreateChatbotParams = Pick<Chatbot, "name" | "prompt">;

export const chatbotRepository = {
  createChatbot,
  findChatbotById,
  deleteChatbot,
  updateChatbot,
  findAllChatbots,
  findChatbotByName,
};