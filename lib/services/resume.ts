import { SectionType } from "@prisma/client";
import { PARSER_VERSION, SECTION_PATTERNS } from "../constants/resume";
import { prisma } from "../prisma";
import { ParsedSection } from "../types/resume";
import { extractDateRanges } from "../utils/date-extractor";
import { extractKeywords } from "../utils/keyword-extractor";
import { extractBullets } from "../utils/bullet-extractor";

interface CreateResumeParams {
  userId: string | null;
  filename: string;
  originalName: string;
  s3Key: string;
  s3Url: string;
}
interface CreateResumeParams {
  userId: string | null;
  filename: string;
  originalName: string;
  s3Key: string;
  s3Url: string;
}

export async function createResumeRecord(params: CreateResumeParams) {
  return await prisma.resume.create({
    data: {
      userId: params.userId,
      filename: params.filename,
      originalName: params.originalName,
      s3Key: params.s3Key,
      s3Url: params.s3Url,
      sectionsJson: {},
    },
  });
}

export async function saveResumeData(
  resumeId: string,
  rawText: string,
  parsedSections: ParsedSection[]
) {
  console.log(`📝 Saving resume data for: ${resumeId}`);
  console.log(`📊 Found ${parsedSections.length} sections to process`);

  try {
    // Step 1: Update resume with raw text
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        rawText,
        parserVersion: PARSER_VERSION,
        sectionsJson: parsedSections as Record<string, unknown>,
      },
    });
    console.log("✅ Resume updated with raw text");

    // Step 2: Create all sections and related data
    for (let i = 0; i < parsedSections.length; i++) {
      const section = parsedSections[i];
      console.log(
        `\n🔄 Processing section ${i + 1}/${parsedSections.length}: ${
          section.title
        }`
      );

      // Create the section with keywords as JSON
      const createdSection = await prisma.resumeSection.create({
        data: {
          resumeId,
          order: i,
          sectionType: section.type,
          sectionTitle: section.title,
          overallContent: section.content,
          keywords: section.keywords || [], // Store as JSON array
        },
      });
      console.log(`  ✅ Section created: ${createdSection.id}`);

      // Create bullets if any
      if (section.bullets && section.bullets.length > 0) {
        console.log(`  📌 Creating ${section.bullets.length} bullets...`);

        const bulletData = section.bullets.map((bullet, idx) => ({
          sectionId: createdSection.id,
          order: idx,
          content: bullet,
        }));

        const createdBullets = await prisma.sectionBullet.createMany({
          data: bulletData,
        });
        console.log(`  ✅ Created ${createdBullets.count} bullets`);
      } else {
        console.log(`  ℹ️  No bullets for this section`);
      }

      // Create date ranges if any
      if (section.dateRanges && section.dateRanges.length > 0) {
        console.log(
          `  📅 Creating ${section.dateRanges.length} date ranges...`
        );

        const dateRangeData = section.dateRanges.map((dateRange) => ({
          sectionId: createdSection.id,
          raw: dateRange.raw,
          startYear: dateRange.startYear || null,
          startMonth: dateRange.startMonth || null,
          endYear: dateRange.endYear || null,
          endMonth: dateRange.endMonth || null,
          ongoing: dateRange.ongoing,
          certainty: dateRange.certainty || 1,
        }));

        const createdDateRanges = await prisma.sectionDateRange.createMany({
          data: dateRangeData,
        });
        console.log(`  ✅ Created ${createdDateRanges.count} date ranges`);
      } else {
        console.log(`  ℹ️  No date ranges for this section`);
      }
    }

    console.log("\n✅ All sections saved successfully!");
  } catch (error) {
    console.error("❌ Error saving resume data:", error);
    throw error;
  }
}
export function parseResumeContent(text: string): ParsedSection[] {
  const sections: ParsedSection[] = [];

  // Find all section positions
  const sectionMatches: Array<{
    index: number;
    title: string;
    type: SectionType;
  }> = [];

  for (const { pattern, type } of SECTION_PATTERNS) {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      sectionMatches.push({
        index: match.index,
        title: match[1],
        type,
      });
    }
  }

  // Sort sections by position
  sectionMatches.sort((a, b) => a.index - b.index);

  // Extract content for each section
  for (let i = 0; i < sectionMatches.length; i++) {
    const currentSection = sectionMatches[i];
    const nextSection = sectionMatches[i + 1];

    const startIndex = currentSection.index;
    const endIndex = nextSection ? nextSection.index : text.length;
    const content = text.substring(startIndex, endIndex).trim();

    sections.push({
      title: currentSection.title,
      type: currentSection.type,
      content,
      bullets: extractBullets(content),
      keywords: extractKeywords(content),
      dateRanges: extractDateRanges(content),
    });
  }

  return sections;
}
