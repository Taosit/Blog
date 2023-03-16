/*
  Warnings:

  - You are about to drop the column `color` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "color";

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "h" INTEGER NOT NULL,
    "s" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_userId_key" ON "Color"("userId");

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
