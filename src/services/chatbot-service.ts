import {
  chatbotRepository,
  openaiRepository,
  userRepository,
} from "@/repositories";
import { threadRepository } from "@/repositories/thread-repositories";
import { Chatbot } from "@prisma/client";

async function createChatbot(
  userId: number,
  name: string,
  prompt: string
): Promise<Chatbot> {
  const existingUser = await userRepository.findUserById(userId);
  if (!existingUser) throw new Error("User not found");
  const chatbot = await chatbotRepository.createChatbot({
    name,
    prompt,
    User: { connect: { id: userId } },
  });

  const instructions =
    prompt +
    `
  Caso o cliente necessite ser transferido para o suporte, ou deseja ser atendido por um humano, envie a mensagem: "Vou te encaminhar para um de nossos atendentes!". `;

  const description = "Owner: " + existingUser.email + " | " + existingUser.id;

  const assistant = await openaiRepository.createAssistant(
    name,
    description,
    instructions
  );

  const updateChatbot = await chatbotRepository.updateChatbot(chatbot.id, {
    assisId: assistant,
  });

  return updateChatbot;
}

async function getChatbot(id: number): Promise<Chatbot | null> {
  return chatbotRepository.findChatbotById(id);
}

async function interactWithChatbot(
  id: number,
  message: string,
  threadId: string = ""
) {
  const chatbot = await getChatbot(id);
  if (!chatbot) {
    throw new Error("Chatbot not found");
  }

  let newThreadId = threadId;
  if (threadId === "") {
    newThreadId = await openaiRepository.createThread();
    await threadRepository.createThread(newThreadId, chatbot.id);
  } else {
    const thread = await threadRepository.findThreadById(threadId);
    if (!thread) {
      newThreadId = await openaiRepository.createThread();
      await threadRepository.createThread(newThreadId, chatbot.id);
    }
  }
  console.log("newThreadId", newThreadId);

  await openaiRepository.createMessage(newThreadId, message);
  await openaiRepository.createRun(newThreadId, chatbot.assisId);

  const messageList = await openaiRepository.listMessages(newThreadId);
  return messageList;
}

export type CreateChatbotParams = Pick<Chatbot, "name" | "prompt">;

export const chatbotService = {
  createChatbot,
  getChatbot,
  interactWithChatbot,
};
