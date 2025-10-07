/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Education, Experience } from "@prisma/client";
import PDFViewer from "../pdf-viewer";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function ResumeDetails({ resume }: { resume: any }) {
  console.log("🚀 ~ ResumeDetails ~ resume:", resume);
  return (
    <div className="grid grid-cols-[0.45fr_1fr_0.45fr]   ">
      <ScrollArea className="h-[calc(100vh_-_50px)] border px-5">
        <div className="flex flex-col gap-4 pt-5">
          <h4 className="text-xl font-bold text-primary">
            Personal Information
          </h4>

          <div className="space-y-2">
            <h3 className=" font-bold">{resume.fullName}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {resume.email}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {resume.phone}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {resume.location}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {resume.linkedin}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {resume.portfolio}
            </p>
          </div>
        </div>
        <div className=""></div>
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-bold text-primary">Experience</h4>

          <div className="space-y-4">
            {resume?.experiences?.map((experience: Experience) => (
              <div key={experience.company} className="space-y-2">
                <h3 className=" font-bold">{experience.company}</h3>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {experience.jobTitle}
                </p>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {experience.location}
                </p>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {experience.startDate &&
                    format(experience.startDate, "MMM do, yyyy")}
                </p>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {experience.endDate &&
                    format(experience.endDate, "MMM do, yyyy")}
                </p>
                <ul className=" text-neutral-500 dark:text-neutral-400 list-disc pl-5">
                  {experience.responsibilities.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-bold text-primary">Education</h4>

          <div className="space-y-4">
            {resume?.education?.map((education: Education) => (
              <div key={education.institution} className="space-y-2">
                <h3 className=" font-bold">{education.institution}</h3>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {education.degree}
                </p>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {education.coursework}
                </p>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {education.graduationDate &&
                    format(education.graduationDate, "MMM do, yyyy")}
                </p>
                <p className=" text-neutral-500 dark:text-neutral-400">
                  {education.gpa}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <ScrollArea className="h-[calc(100vh_-_50px)] w-full grid place-content-center bg-secondary">
        <div className="mt-8 mb-5">
          {resume.sourceUrl && <PDFViewer cloudFrontUrl={resume.sourceUrl} />}
        </div>
      </ScrollArea>

      <div className="h-[calc(100vh_-_50px)] px-5">
        <h3 className="text-xl font-bold text-primary mt-5">
          Qualifications Score
        </h3>
      </div>
    </div>
  );
}
