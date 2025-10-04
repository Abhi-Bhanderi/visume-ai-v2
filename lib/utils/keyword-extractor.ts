// lib/utils/keyword-extractor.ts

import { COMMON_TECH_KEYWORDS } from "../constants/keywords";

export function extractKeywords(text: string): string[] {
  const keywords = new Set<string>();

  for (const keyword of COMMON_TECH_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    const matches = text.match(regex);

    if (matches && matches.length > 0) {
      // Use the first match to preserve the original casing
      keywords.add(matches[0]);
    }
  }

  return Array.from(keywords);
}

// Alternative: Extract keywords using frequency analysis
export function extractKeywordsByFrequency(
  text: string,
  minLength: number = 3,
  maxResults: number = 20
): string[] {
  // Remove common stop words
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "have",
    "been",
    "was",
    "were",
    "will",
    "would",
    "could",
    "should",
    "may",
    "can",
  ]);

  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const wordFreq = new Map<string, number>();

  for (const word of words) {
    if (word.length >= minLength && !stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  }

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxResults)
    .map(([word]) => word);
}
