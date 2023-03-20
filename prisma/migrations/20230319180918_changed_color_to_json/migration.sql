/*
  Warnings:

  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "color" JSONB;

-- DropTable
DROP TABLE "Color";
