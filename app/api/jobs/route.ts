/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { JobDescriptionParsedSchema } from "@/lib/zod-schema-core";
import { SYSTEM_JOB_DESCRIPTION_PARSE } from "@/lib/constants/propmts";
import { callOpenAIWithSchema } from "@/lib/openai";
import { z } from "zod";
const ResumeInputSchema = z.object({
  /** raw resume text (plain) */
  jobDescription: z.string().min(10),
});
export async function POST(req: Request) {
  console.log("dasdsajdsakjdhsakjh");
  try {
    const { title, company, description } = await req.json();

    if (typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "description (string) is required" },
        { status: 400 }
      );
    }

    const result = await callOpenAIWithSchema(
      "gpt-4.1-mini",
      { jobDescription: description },
      {
        inputSchema: ResumeInputSchema,
        outputSchema: JobDescriptionParsedSchema,
        systemPrompt: SYSTEM_JOB_DESCRIPTION_PARSE,
        userPromptSuffix: "Please parse the job description fields as JSON.",
        openaiParams: {
          temperature: 0,
          max_tokens: 500,
        },
      }
    );

    const jobDescription = await prisma.jobDescription.create({
      data: {
        title,
        company: company ?? null,
        location: result.location ?? null,
        seniorityHint: result.seniority_hint ?? null,
        description,
        keywords: result.keywords,
        requiredSkills: result.required_skills,
        preferredSkills: result.preferred_skills,
        responsibilities: result.responsibilities,
      },
    });

    return NextResponse.json({ ok: true, data: jobDescription, result });
  } catch (err: any) {
    console.error("[JD_PARSE_ROUTE] Error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.jobDescription.findMany({
      where: { ownerUserId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
