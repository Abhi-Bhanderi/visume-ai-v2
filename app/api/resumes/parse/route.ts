/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/resumes/parse/route.ts
import { SYSTEM_PARSE } from "@/lib/constants/propmts";
import { callOpenAIWithSchema, client, ValidationError } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { ResumeParserOutputSchema } from "@/lib/zod-schema-core";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export async function POST(req: NextRequest) {
  try {
    const { resumeId, resumeText } = await req.json();

    if (!resumeId || !resumeText) {
      return NextResponse.json(
        { ok: false, error: "resumeId and resumeText required" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini-2025-04-14",
      messages: [
        { role: "system", content: SYSTEM_PARSE },
        { role: "user", content: resumeText },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned no response");

    let parsedJson;
    try {
      parsedJson = JSON.parse(content.trim());
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsedJson = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }
    if (!parsedJson) throw new Error("Invalid JSON in model response");

    const parsed = parsedJson;

    // safeDate helper
    const safeDate = (str?: string): Date | null => {
      if (!str || str.toLowerCase() === "present") return null;
      try {
        const normalized = /^\d{4}-\d{2}$/.test(str)
          ? str + "-01"
          : /^\w+\s\d{4}$/.test(str)
            ? new Date(str).toISOString().slice(0, 10)
            : str;
        const date = new Date(normalized);
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    const resume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        fullName: parsed.contact_information.full_name,
        phone: parsed.contact_information.phone ?? null,
        email: parsed.contact_information.email ?? null,
        linkedin: parsed.contact_information.linkedin ?? null,
        github: parsed.contact_information.github ?? null,
        portfolio: parsed.contact_information.portfolio ?? null,
        location: parsed.contact_information.location ?? null,
        summary: parsed.summary ?? null,
        summaryKeywords: parsed.summary_keywords ?? [],
        hardSkills: parsed.skills.hard_skills ?? [],
        softSkills: parsed.skills.soft_skills ?? [],
        domainKnowledge: parsed.skills.domain_knowledge ?? [],
        skillProficiency: parsed.skills.proficiency_estimates ?? {},
        meta: {
          create: {
            resumeLengthPages: parsed.meta?.resume_length_pages ?? null,
            bulletPointCount: parsed.meta?.bullet_point_count ?? null,
            keywordDensity: parsed.meta?.keyword_density ?? {},
            atsRisks: parsed.meta?.ats_risks ?? [],
            sectionPresenceFlags: parsed.meta?.section_presence_flags ?? {},
            seniorityInference: parsed.meta?.seniority_inference ?? "UNKNOWN",
          },
        },
        experiences: {
          create: (parsed.work_experience ?? []).map((e: any, i: number) => ({
            jobTitle: e.job_title,
            normalizedTitle: e.normalized_title ?? null,
            company: e.company,
            industry: e.industry ?? null,
            location: e.location ?? null,
            startDate: safeDate(e.start_date),
            endDate: safeDate(e.end_date),

            employmentType: e.employment_type ?? "UNKNOWN",
            durationMonths: e.duration_months ?? null,
            responsibilities: e.responsibilities ?? [],
            achievements: e.achievements ?? [],
            extractedSkills: e.extracted_skills ?? [],
            orderIndex: i,
          })),
        },
        education: {
          create: (parsed.education ?? []).map((ed: any, i: number) => ({
            degree: ed.degree,
            institution: ed.institution,
            location: ed.location ?? null,
            graduationDate: safeDate(ed.graduation_date),
            honors: ed.honors ?? null,
            gpa: ed.gpa ?? null,
            coursework: ed.coursework ?? [],
            orderIndex: i,
          })),
        },
        certifications: {
          create: (parsed.certifications ?? []).map((c: any) => ({
            name: c.name,
            authority: c.authority ?? null,
            issuedDate: safeDate(c.date),
            validUntil: c.valid_until
              ? new Date(
                  c.valid_until.length === 7
                    ? c.valid_until + "-01"
                    : c.valid_until + "-01-01"
                )
              : null,
            status: c.status ?? "ACTIVE",
          })),
        },
        projects: {
          create: (parsed.projects ?? []).map((p: any, i: number) => ({
            title: p.title,
            description: p.description ?? null,
            technologies: p.technologies ?? [],
            role: p.role ?? null,
            outcomes: p.outcomes ?? [],
            orderIndex: i,
          })),
        },
        publications: {
          create: (parsed.publications_awards ?? []).map((a: any) => ({
            title: a.title,
            authority: a.authority ?? null,
            date: safeDate(a.date),
            description: a.description ?? null,
          })),
        },
        languages: {
          create: (parsed.languages ?? []).map((l: any) => ({
            language: l.language,
            proficiency: l.proficiency,
          })),
        },
        additionalItems: {
          create: [
            ...((parsed.additional_sections?.volunteer_experience ?? []).map(
              (v: string) => ({
                category: "Volunteer Experience",
                title: v,
              })
            ) as any[]),
            ...((parsed.additional_sections?.affiliations ?? []).map(
              (a: string) => ({
                category: "Affiliations",
                title: a,
              })
            ) as any[]),
            ...((parsed.additional_sections?.patents ?? []).map(
              (p: string) => ({
                category: "Patents",
                title: p,
              })
            ) as any[]),
          ],
        },
      },
    });

    console.log("🚀 ~ POST ~ data:", parsed);

    return NextResponse.json({ ok: true, resume });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Parse error" },
      { status: 500 }
    );
  }
}
