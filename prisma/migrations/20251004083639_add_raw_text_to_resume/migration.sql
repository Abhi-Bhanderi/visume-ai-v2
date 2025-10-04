/*
  Warnings:

  - You are about to drop the column `rawText` on the `JobDescription` table. All the data in the column will be lost.
  - Added the required column `description` to the `JobDescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobDescription" DROP COLUMN "rawText",
ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "seniorityHint" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "rawText" TEXT,
ALTER COLUMN "fullName" DROP NOT NULL;
