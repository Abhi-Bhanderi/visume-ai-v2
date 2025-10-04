// lib/constants/date.constants.ts

export const MONTH_MAP: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

export const DATE_PATTERNS = [
  {
    // Month Year - Month Year (e.g., "Jan 2020 - Dec 2022")
    regex:
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})\b/gi,
    type: "MONTH_YEAR_TO_MONTH_YEAR",
  },
  {
    // Month Year - Present (e.g., "Jan 2020 - Present")
    regex:
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})\s*[-–—]\s*(Present|Current|Now)\b/gi,
    type: "MONTH_YEAR_TO_PRESENT",
  },
  {
    // Year - Year (e.g., "2020 - 2022")
    regex: /\b(\d{4})\s*[-–—]\s*(\d{4})\b/g,
    type: "YEAR_TO_YEAR",
  },
  {
    // Year - Present (e.g., "2020 - Present")
    regex: /\b(\d{4})\s*[-–—]\s*(Present|Current|Now)\b/gi,
    type: "YEAR_TO_PRESENT",
  },
];
