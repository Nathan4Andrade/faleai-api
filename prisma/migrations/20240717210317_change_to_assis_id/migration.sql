/*
  Warnings:

  - You are about to drop the column `assistentId` on the `Chatbot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatbot" DROP COLUMN "assistentId",
ADD COLUMN     "assisId" TEXT;
