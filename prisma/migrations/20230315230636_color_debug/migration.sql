/*
  Warnings:

  - You are about to drop the column `colorId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_colorId_fkey";

-- DropIndex
DROP INDEX "User_colorId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "colorId";

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
