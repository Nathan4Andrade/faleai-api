/*
  Warnings:

  - You are about to drop the column `userId` on the `Thread` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_userId_fkey";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "document" TEXT,
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_document_key" ON "User"("document");
