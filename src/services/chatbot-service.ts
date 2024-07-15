import { chatbotRepository, openaiRepository } from "@/repositories";
import { Chatbot } from "@prisma/client";

async function createChatbot(name: string, prompt: string): Promise<Chatbot> {
  return chatbotRepository.createChatbot({ name, prompt });
}

async function getChatbot(id: number): Promise<Chatbot | null> {
  return chatbotRepository.findChatbotById(id);
}

async function interactWithChatbot(
  id: number,
  message: string
): Promise<{ message: string }> {
  const chatbot = await getChatbot(id);
  if (!chatbot) throw new Error("Chatbot not found");
  const response = await openaiRepository.createCompletion(
    chatbot.prompt,
    message
  );
  return { message: response };
}

export type CreateChatbotParams = Pick<Chatbot, "name" | "prompt">;

export const chatbotService = {
  createChatbot,
  getChatbot,
  interactWithChatbot,
};
