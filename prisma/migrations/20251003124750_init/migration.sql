-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('NATIVE', 'FLUENT', 'PROFESSIONAL', 'INTERMEDIATE', 'BASIC');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "SeniorityLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerUserId" TEXT,
    "sourceFileName" TEXT,
    "sourceFileType" TEXT,
    "sourceUrl" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "location" TEXT,
    "summary" TEXT,
    "summaryKeywords" TEXT[],
    "hardSkills" TEXT[],
    "softSkills" TEXT[],
    "domainKnowledge" TEXT[],
    "skillProficiency" JSONB,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeMeta" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "resumeLengthPages" INTEGER,
    "bulletPointCount" INTEGER,
    "keywordDensity" JSONB,
    "atsRisks" TEXT[],
    "sectionPresenceFlags" JSONB,
    "seniorityInference" "SeniorityLevel" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "ResumeMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "normalizedTitle" TEXT,
    "company" TEXT NOT NULL,
    "industry" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'UNKNOWN',
    "durationMonths" INTEGER,
    "responsibilities" TEXT[],
    "achievements" TEXT[],
    "extractedSkills" TEXT[],
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "location" TEXT,
    "graduationDate" TIMESTAMP(3),
    "honors" TEXT,
    "gpa" TEXT,
    "coursework" TEXT[],
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authority" TEXT,
    "issuedDate" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "status" "CertificationStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "technologies" TEXT[],
    "role" TEXT,
    "outcomes" TEXT[],
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationAward" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authority" TEXT,
    "date" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "PublicationAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "proficiency" "ProficiencyLevel" NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalItem" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "AdditionalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobDescription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerUserId" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "location" TEXT,
    "seniorityHint" "SeniorityLevel" NOT NULL DEFAULT 'UNKNOWN',
    "rawText" TEXT NOT NULL,
    "keywords" TEXT[],
    "requiredSkills" TEXT[],
    "preferredSkills" TEXT[],
    "responsibilities" TEXT[],

    CONSTRAINT "JobDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchEvaluation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobDescriptionId" TEXT NOT NULL,
    "matchingScore" INTEGER NOT NULL,
    "atsScore" INTEGER NOT NULL,
    "categoryScores" JSONB NOT NULL,
    "suggestions" JSONB NOT NULL,
    "matchedKeywords" TEXT[],
    "missingKeywords" TEXT[],
    "synonymSuggestions" JSONB,
    "gapAnalysis" JSONB,
    "atsFlags" TEXT[],
    "strengths" TEXT[],
    "dedupeHash" TEXT NOT NULL,

    CONSTRAINT "MatchEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resume_ownerUserId_idx" ON "Resume"("ownerUserId");

-- CreateIndex
CREATE INDEX "Resume_fullName_idx" ON "Resume"("fullName");

-- CreateIndex
CREATE INDEX "Resume_email_idx" ON "Resume"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeMeta_resumeId_key" ON "ResumeMeta"("resumeId");

-- CreateIndex
CREATE INDEX "Experience_resumeId_idx" ON "Experience"("resumeId");

-- CreateIndex
CREATE INDEX "Experience_company_idx" ON "Experience"("company");

-- CreateIndex
CREATE INDEX "Experience_jobTitle_idx" ON "Experience"("jobTitle");

-- CreateIndex
CREATE INDEX "Experience_normalizedTitle_idx" ON "Experience"("normalizedTitle");

-- CreateIndex
CREATE INDEX "Experience_startDate_endDate_idx" ON "Experience"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Education_resumeId_idx" ON "Education"("resumeId");

-- CreateIndex
CREATE INDEX "Education_institution_idx" ON "Education"("institution");

-- CreateIndex
CREATE INDEX "Certification_resumeId_idx" ON "Certification"("resumeId");

-- CreateIndex
CREATE INDEX "Certification_name_idx" ON "Certification"("name");

-- CreateIndex
CREATE INDEX "Project_resumeId_idx" ON "Project"("resumeId");

-- CreateIndex
CREATE INDEX "Project_title_idx" ON "Project"("title");

-- CreateIndex
CREATE INDEX "PublicationAward_resumeId_idx" ON "PublicationAward"("resumeId");

-- CreateIndex
CREATE INDEX "Language_resumeId_idx" ON "Language"("resumeId");

-- CreateIndex
CREATE INDEX "Language_language_idx" ON "Language"("language");

-- CreateIndex
CREATE INDEX "AdditionalItem_resumeId_idx" ON "AdditionalItem"("resumeId");

-- CreateIndex
CREATE INDEX "AdditionalItem_category_idx" ON "AdditionalItem"("category");

-- CreateIndex
CREATE INDEX "JobDescription_ownerUserId_idx" ON "JobDescription"("ownerUserId");

-- CreateIndex
CREATE INDEX "JobDescription_title_idx" ON "JobDescription"("title");

-- CreateIndex
CREATE INDEX "JobDescription_company_idx" ON "JobDescription"("company");

-- CreateIndex
CREATE UNIQUE INDEX "MatchEvaluation_dedupeHash_key" ON "MatchEvaluation"("dedupeHash");

-- CreateIndex
CREATE INDEX "MatchEvaluation_resumeId_jobDescriptionId_idx" ON "MatchEvaluation"("resumeId", "jobDescriptionId");

-- CreateIndex
CREATE INDEX "MatchEvaluation_matchingScore_idx" ON "MatchEvaluation"("matchingScore");

-- CreateIndex
CREATE INDEX "MatchEvaluation_atsScore_idx" ON "MatchEvaluation"("atsScore");

-- AddForeignKey
ALTER TABLE "ResumeMeta" ADD CONSTRAINT "ResumeMeta_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationAward" ADD CONSTRAINT "PublicationAward_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalItem" ADD CONSTRAINT "AdditionalItem_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvaluation" ADD CONSTRAINT "MatchEvaluation_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvaluation" ADD CONSTRAINT "MatchEvaluation_jobDescriptionId_fkey" FOREIGN KEY ("jobDescriptionId") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
