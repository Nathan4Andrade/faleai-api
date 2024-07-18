import { prisma } from "@/config";

async function createThread(threadId: string, chatbotId: number) {
  const saveThread = await prisma.thread.create({
    data: {
      openAiThreadId: threadId,
      interactions: 1,
      Chatbot: {
        connect: {
          id: chatbotId,
        },
      },
    },
  });
  return saveThread;
}

async function findThreadById(threadId: string) {
  return prisma.thread.findFirst({
    where: {
      openAiThreadId: threadId,
    },
  });
}

async function updateThread(threadId: string, data: any) {
  return prisma.thread.updateMany({
    where: {
      openAiThreadId: threadId,
    },
    data,
  });
}

async function deleteThread(threadId: string) {
  return prisma.thread.deleteMany({
    where: {
      openAiThreadId: threadId,
    },
  });
}

async function findAllThreads() {
  return prisma.thread.findMany();
}

export const threadRepository = {
  createThread,
  findThreadById,
  updateThread,
  deleteThread,
  findAllThreads,
};
