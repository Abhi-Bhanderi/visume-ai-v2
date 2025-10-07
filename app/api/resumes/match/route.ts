import { SYSTEM_MATCH } from "@/lib/constants/propmts";
import { client } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { ResumeParserOutputSchema } from "@/lib/zod-schema-core";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(request: Request) {
  const { parsedResume, jobDescription } = await request.json();
  console.log("🚀 ~ POST ~ jobDescription:", jobDescription);
  console.log("🚀 ~ POST ~ parsedResume:", parsedResume);

  if (!parsedResume || !jobDescription) {
    return NextResponse.json(
      { ok: false, error: "parsedResume and jobDescription required" },
      { status: 400 }
    );
  }

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_MATCH },
      {
        role: "user",
        content: `
        Parsed Resume:
        ${JSON.stringify(parsedResume)}
        
        Job Description:
        ${jobDescription} 
        
        `,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned no response");
  }

  // Parse and validate output
  const parsed = JSON.parse(content);

  const data = parsed;

  const match = await prisma.matchEvaluation.create({
    data: {
      resumeId: parsedResume.id,
      matchingScore: data.matching_score,
      atsScore: data.ats_score,
      categoryScores: data.category_scores,
      suggestions: data.suggestions,
      matchedKeywords: data.matched_keywords,
      missingKeywords: data.missing_keywords,
      synonymSuggestions: data.synonym_suggestions,
      gapAnalysis: data.gap_analysis,
      atsFlags: data.ats_flags,
      strengths: data.strengths,
      dedupeHash: `${parsedResume.id}-${jobDescription.id}-${data.matching_score}-${data.ats_score}`,
    },
  });
  return NextResponse.json({ ok: true, data: match });
}
