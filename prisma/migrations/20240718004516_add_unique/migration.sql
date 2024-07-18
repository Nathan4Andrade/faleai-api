/*
  Warnings:

  - A unique constraint covering the columns `[openAiThreadId]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Thread_openAiThreadId_key" ON "Thread"("openAiThreadId");
