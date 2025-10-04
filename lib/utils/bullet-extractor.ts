// lib/utils/bullet-extractor.ts

export function extractBullets(text: string): string[] {
  const bullets: string[] = [];

  // Match bullet points (•, -, *, or numbered lists)
  const bulletPattern =
    /(?:^|\n)\s*(?:[•\-*]|\d+\.)\s+(.+?)(?=\n\s*(?:[•\-*]|\d+\.)|$)/gs;

  let match;

  while ((match = bulletPattern.exec(text)) !== null) {
    if (match[1]) {
      const bullet = match[1].trim();
      // Filter out very short bullets (likely false positives)
      if (bullet.length > 10) {
        bullets.push(bullet);
      }
    }
  }

  return bullets;
}
