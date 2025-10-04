import { z } from "zod";

/* ──────────────────────────────
   Enums
   ────────────────────────────── */
export const EmploymentTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "UNKNOWN",
]);

export const ProficiencyLevelEnum = z.enum([
  "NATIVE",
  "FLUENT",
  "PROFESSIONAL",
  "INTERMEDIATE",
  "BASIC",
]);

export const CertificationStatusEnum = z.enum([
  "ACTIVE",
  "EXPIRED",
  "IN_PROGRESS",
]);

export const SeniorityLevelEnum = z.enum([
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "PRINCIPAL",
  "UNKNOWN",
]);

/* ──────────────────────────────
   Resume Parser Output (SMART)
   ────────────────────────────── */

export const ContactInformationSchema = z.object({
  full_name: z.string().min(1),
  phone: z.string(),
  email: z.string().email(),
  linkedin: z.string(),
  github: z.string(),
  portfolio: z.string(),
  location: z.string(),
});

export const WorkExperienceSchema = z.object({
  job_title: z.string(),
  normalized_title: z.string().optional(),
  company: z.string(),
  industry: z.string().optional(),
  location: z.string().optional(),
  // Dates as YYYY-MM (or "Present" for end)
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
  end_date: z
    .union([z.literal("Present"), z.string().regex(/^\d{4}-\d{2}$/)])
    .optional(),
  employment_type: EmploymentTypeEnum.optional(),
  duration_months: z.number().int().nonnegative().optional(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  extracted_skills: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string().optional(),
  // YYYY or YYYY-MM
  graduation_date: z
    .string()
    .regex(/^\d{4}(-\d{2})?$/)
    .optional(),
  honors: z.string().optional(),
  gpa: z.string().optional(),
  coursework: z.array(z.string()).default([]),
});

export const CertificationSchema = z.object({
  name: z.string(),
  authority: z.string().optional(),
  // YYYY or YYYY-MM
  date: z
    .string()
    .regex(/^\d{4}(-\d{2})?$/)
    .optional(),
  valid_until: z
    .string()
    .regex(/^\d{4}(-\d{2})?$/)
    .optional(),
  status: CertificationStatusEnum.optional(),
});

export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  role: z.string().optional(),
  outcomes: z.array(z.string()).default([]),
});

export const PublicationAwardSchema = z.object({
  title: z.string(),
  authority: z.string().optional(),
  date: z.string().optional(), // keep loose (e.g., "2022" or "2022-05")
  description: z.string().optional(),
});

export const LanguageSchema = z.object({
  language: z.string(),
  proficiency: ProficiencyLevelEnum,
});

export const AdditionalSectionsSchema = z.object({
  volunteer_experience: z.array(z.string()).optional(),
  affiliations: z.array(z.string()).optional(),
  patents: z.array(z.string()).optional(),
});

export const SkillsSchema = z.object({
  hard_skills: z.array(z.string()).default([]),
  soft_skills: z.array(z.string()).default([]),
  domain_knowledge: z.array(z.string()).default([]),
  proficiency_estimates: z.record(z.string(), z.string()).optional(),
});

export const MetaSchema = z.object({
  resume_length_pages: z.number().int().positive().optional(),
  bullet_point_count: z.number().int().nonnegative().optional(),
  keyword_density: z.record(z.string(), z.number()).optional(),
  ats_risks: z.array(z.string()).default([]),
  section_presence_flags: z.record(z.string(), z.boolean()).optional(),
  seniority_inference: SeniorityLevelEnum.optional(),
});

export const ResumeParserOutputSchema = z.object({
  contact_information: ContactInformationSchema,
  summary: z.string().nullable().optional(),
  summary_keywords: z.array(z.string()).default([]),

  work_experience: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  skills: SkillsSchema,
  projects: z.array(ProjectSchema).default([]),
  publications_awards: z.array(PublicationAwardSchema).default([]),
  languages: z.array(LanguageSchema).default([]),

  additional_sections: AdditionalSectionsSchema.optional(),
  meta: MetaSchema.optional(),
});

/* ──────────────────────────────
   Matcher Output (Resume ↔ JD)
   ────────────────────────────── */

export const CategoryScoresSchema = z.object({
  qualifications_match: z.number().int().min(0).max(100),
  responsibilities_match: z.number().int().min(0).max(100),
  keyword_match: z.number().int().min(0).max(100),
  job_title_match: z.number().int().min(0).max(100),
  technical_skills: z.number().int().min(0).max(100),
  experience: z.number().int().min(0).max(100),
  soft_skills: z.number().int().min(0).max(100),
  domain_knowledge: z.number().int().min(0).max(100),
});

export const SuggestionsSchema = z.object({
  high_priority: z.array(z.string()).default([]),
  moderate_priority: z.array(z.string()).default([]),
  minor_priority: z.array(z.string()).default([]),
});

export const GapAnalysisSchema = z.object({
  hard_gaps: z.array(z.string()).default([]),
  partial_gaps: z.array(z.string()).default([]),
});

export const MatchingOutputSchema = z.object({
  matching_score: z.number().int().min(0).max(100),
  ats_score: z.number().int().min(0).max(100),

  category_scores: CategoryScoresSchema,

  suggestions: SuggestionsSchema,

  matched_keywords: z.array(z.string()).default([]),
  missing_keywords: z.array(z.string()).default([]),

  synonym_suggestions: z.record(z.string(), z.array(z.string())).optional(),

  gap_analysis: GapAnalysisSchema.optional(),
  ats_flags: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
});

const SeniorityEnum = z.enum([
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "PRINCIPAL",
  "UNKNOWN",
]);

export const JobDescriptionParsedSchema = z.object({
  title: z.string().min(1),
  company: z.string().nullable(),
  location: z.string().nullable(),
  seniority_hint: SeniorityEnum,
  description: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  required_skills: z.array(z.string()).default([]),
  preferred_skills: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
});

/* ──────────────────────────────
   Type Inference
   ────────────────────────────── */
export type ResumeParserOutput = z.infer<typeof ResumeParserOutputSchema>;
export type ContactInformation = z.infer<typeof ContactInformationSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type PublicationAward = z.infer<typeof PublicationAwardSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Skills = z.infer<typeof SkillsSchema>;
export type ResumeMeta = z.infer<typeof MetaSchema>;
export type AdditionalSections = z.infer<typeof AdditionalSectionsSchema>;

export type MatchingOutput = z.infer<typeof MatchingOutputSchema>;
export type CategoryScores = z.infer<typeof CategoryScoresSchema>;
export type Suggestions = z.infer<typeof SuggestionsSchema>;
export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;

/* Enums as TS union types */
export type EmploymentType = z.infer<typeof EmploymentTypeEnum>;
export type ProficiencyLevel = z.infer<typeof ProficiencyLevelEnum>;
export type CertificationStatus = z.infer<typeof CertificationStatusEnum>;
export type SeniorityLevel = z.infer<typeof SeniorityLevelEnum>;
export type JobDescriptionParsed = z.infer<typeof JobDescriptionParsedSchema>;
