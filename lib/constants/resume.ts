// lib/constants/resume.constants.ts
import { SectionType } from "@prisma/client";

export const PARSER_VERSION = "1.0.0";

export const SECTION_PATTERNS = [
  {
    pattern: /(?:^|\n\s*)(SUMMARY|PROFILE|OBJECTIVE|ABOUT ME)(?:\s*[:|\n])/im,
    type: SectionType.SUMMARY,
  },
  {
    pattern:
      /(?:^|\n\s*)(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)(?:\s*[:|\n])/im,
    type: SectionType.EXPERIENCE,
  },
  {
    pattern:
      /(?:^|\n\s*)(EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS)(?:\s*[:|\n])/im,
    type: SectionType.EDUCATION,
  },
  {
    pattern:
      /(?:^|\n\s*)(SKILLS|TECHNICAL SKILLS|COMPETENCIES|CORE COMPETENCIES)(?:\s*[:|\n])/im,
    type: SectionType.SKILLS,
  },
  {
    pattern:
      /(?:^|\n\s*)(PROJECTS|PERSONAL PROJECTS|KEY PROJECTS)(?:\s*[:|\n])/im,
    type: SectionType.PROJECTS,
  },
  {
    pattern:
      /(?:^|\n\s*)(CERTIFICATIONS|CERTIFICATES|LICENSES|PROFESSIONAL CERTIFICATIONS)(?:\s*[:|\n])/im,
    type: SectionType.CERTIFICATIONS,
  },
];
