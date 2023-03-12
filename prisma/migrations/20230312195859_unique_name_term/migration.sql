/*
  Warnings:

  - A unique constraint covering the columns `[name,term]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Class_name_term_key" ON "Class"("name", "term");
