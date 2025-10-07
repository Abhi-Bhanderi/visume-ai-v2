/*
  Warnings:

  - You are about to drop the column `jobDescriptionId` on the `MatchEvaluation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MatchEvaluation" DROP CONSTRAINT "MatchEvaluation_jobDescriptionId_fkey";

-- DropIndex
DROP INDEX "public"."MatchEvaluation_resumeId_jobDescriptionId_idx";

-- AlterTable
ALTER TABLE "MatchEvaluation" DROP COLUMN "jobDescriptionId";
