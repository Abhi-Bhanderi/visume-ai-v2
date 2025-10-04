// lib/types/resume.types.ts
import { SectionType, DateCertainty } from "@prisma/client";

export interface ParsedDateRange {
  raw: string;
  startYear?: number | null;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
  ongoing: boolean;
  certainty: DateCertainty;
}

export interface ParsedSection {
  title: string;
  type: SectionType;
  content: string;
  bullets: string[];
  keywords: string[]; // Stored as JSON in ResumeSection
  dateRanges: ParsedDateRange[];
}

export interface ResumeUploadResult {
  id: string;
  filename: string;
  originalName: string;
  s3Url: string;
  uploadedAt: Date;
}

export interface ResumeParseResult {
  id: string;
  rawText: string;
  sections: ParsedSection[];
  parserVersion: string;
}
