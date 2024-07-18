-- AlterTable
ALTER TABLE "Chatbot" ADD COLUMN     "assistentId" TEXT;

-- CreateTable
CREATE TABLE "Thread" (
    "id" SERIAL NOT NULL,
    "chatbotId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interactions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
