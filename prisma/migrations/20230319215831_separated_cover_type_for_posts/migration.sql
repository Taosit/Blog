/*
  Warnings:

  - You are about to drop the column `background` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `background` on the `SavedPost` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CoverType" AS ENUM ('IMAGE', 'COLOR');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "background",
ADD COLUMN     "color" JSONB,
ADD COLUMN     "coverType" "CoverType" NOT NULL DEFAULT 'COLOR',
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "SavedPost" DROP COLUMN "background",
ADD COLUMN     "color" JSONB,
ADD COLUMN     "coverType" "CoverType" NOT NULL DEFAULT 'COLOR',
ADD COLUMN     "image" TEXT;
