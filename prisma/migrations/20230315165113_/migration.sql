/*
  Warnings:

  - A unique constraint covering the columns `[colorId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_userId_fkey";

-- AlterTable
ALTER TABLE "Color" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "colorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_colorId_key" ON "User"("colorId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
