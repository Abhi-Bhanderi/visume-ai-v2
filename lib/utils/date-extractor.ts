// lib/utils/date-extractor.ts
import { DateCertainty } from "@prisma/client";
import { ParsedDateRange } from "../types/resume";
import { DATE_PATTERNS, MONTH_MAP } from "../constants/date";

export function extractDateRanges(text: string): ParsedDateRange[] {
  const dateRanges: ParsedDateRange[] = [];

  for (const pattern of DATE_PATTERNS) {
    const matches = text.matchAll(pattern.regex);

    for (const match of matches) {
      const dateRange = parseDateMatch(match, pattern.type);
      if (dateRange) {
        dateRanges.push(dateRange);
      }
    }
  }

  // Remove duplicate date ranges
  return deduplicateDateRanges(dateRanges);
}

function parseDateMatch(
  match: RegExpMatchArray,
  type: string
): ParsedDateRange | null {
  const raw = match[0];
  const ongoing = /present|current|now/i.test(raw);

  switch (type) {
    case "MONTH_YEAR_TO_MONTH_YEAR":
      return {
        raw,
        startMonth: getMonthNumber(match[1]),
        startYear: parseInt(match[2]),
        endMonth: getMonthNumber(match[3]),
        endYear: parseInt(match[4]),
        ongoing: false,
        certainty: DateCertainty.exact,
      };

    case "MONTH_YEAR_TO_PRESENT":
      return {
        raw,
        startMonth: getMonthNumber(match[1]),
        startYear: parseInt(match[2]),
        ongoing: true,
        certainty: DateCertainty.exact,
      };

    case "YEAR_TO_YEAR":
      return {
        raw,
        startYear: parseInt(match[1]),
        endYear: parseInt(match[2]),
        ongoing: false,
        certainty: DateCertainty.exact,
      };

    case "YEAR_TO_PRESENT":
      return {
        raw,
        startYear: parseInt(match[1]),
        ongoing: true,
        certainty: DateCertainty.exact,
      };

    default:
      return null;
  }
}

function getMonthNumber(monthStr: string): number | undefined {
  if (!monthStr) return undefined;
  const monthKey = monthStr.toLowerCase().slice(0, 3);
  return MONTH_MAP[monthKey as keyof typeof MONTH_MAP];
}

function deduplicateDateRanges(ranges: ParsedDateRange[]): ParsedDateRange[] {
  const seen = new Set<string>();
  const unique: ParsedDateRange[] = [];

  for (const range of ranges) {
    const key = JSON.stringify({
      startYear: range.startYear,
      startMonth: range.startMonth,
      endYear: range.endYear,
      endMonth: range.endMonth,
      ongoing: range.ongoing,
    });

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(range);
    }
  }

  return unique;
}
