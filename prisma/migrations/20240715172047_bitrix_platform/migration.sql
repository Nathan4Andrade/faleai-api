-- CreateTable
CREATE TABLE "BitrixPlatform" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT,
    "url" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BitrixPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BitrixPlatform_url_key" ON "BitrixPlatform"("url");

-- AddForeignKey
ALTER TABLE "BitrixPlatform" ADD CONSTRAINT "BitrixPlatform_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
