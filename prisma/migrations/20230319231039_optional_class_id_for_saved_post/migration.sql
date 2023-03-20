-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_classId_fkey";

-- AlterTable
ALTER TABLE "SavedPost" ALTER COLUMN "classId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
