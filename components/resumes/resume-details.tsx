"use client";

import { useResumeParse } from "@/hooks/use-resume-parse";
import { useEffect, useMemo, useRef, useState } from "react";
import { ParsedResume } from "@/lib/openai";
import { Badge } from "../ui/badge";

export interface ResumeData {
  id: string;
  userId: string;
  fileName: string;
  s3Key: string;
  s3Url: string;
  fileSize: number;
  parsedData: ParsedResume;
  rawText: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function ResumeDetails({ resume }: { resume: ResumeData }) {
  const [resumeData, setResumeData] = useState<ResumeData>(resume);

  const didTrigger = useRef(false);

  const needsParse = useMemo(
    () => !resume.parsedData || Object.keys(resume.parsedData).length === 0,
    [resume.parsedData]
  );

  const { mutate: parseResume, isPending } = useResumeParse();

  useEffect(() => {
    if (!didTrigger.current && needsParse) {
      didTrigger.current = true;
      parseResume(
        { resumeId: resume.id },
        {
          onSuccess: (data) => {
            setResumeData(data.resume);
            window.location.reload();
          },
        }
      );
    }
  }, [needsParse, resume.id, parseResume]);

  if (isPending) {
    return <div>Analyzing your resume...</div>;
  }

  if (
    !resumeData.parsedData ||
    Object.keys(resumeData.parsedData).length === 0
  ) {
    return <div>No data found, please wait for the resume to be parsed</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-24 mx-10 ">
      {resumeData.parsedData &&
      Object.keys(resumeData.parsedData).length > 0 ? (
        <div>
          {" "}
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-bold text-primary">
              Personal Information
            </h4>

            <div className="space-y-2">
              <h3 className="text-lg font-bold">
                {resumeData.parsedData.personalInfo.name}
              </h3>
              <p className="text-sm text-gray-500">
                {resumeData.parsedData.personalInfo.email}
              </p>
              <p className="text-sm text-gray-500">
                {resumeData.parsedData.personalInfo.phone}
              </p>
              <p className="text-sm text-gray-500">
                {resumeData.parsedData.personalInfo.location}
              </p>
              <p className="text-sm text-gray-500">
                {resumeData.parsedData.personalInfo.linkedin}
              </p>
              <p className="text-sm text-gray-500">
                {resumeData.parsedData.personalInfo.website}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-bold text-primary">Experience</h4>

            <div className="space-y-4">
              {resumeData.parsedData.experience.map((experience) => (
                <div key={experience.company} className="space-y-2">
                  <h3 className="text-lg font-bold">{experience.company}</h3>
                  <p className=" text-gray-500">{experience.position}</p>
                  <p className=" text-gray-500">{experience.location}</p>
                  <p className=" text-gray-500">{experience.startDate}</p>
                  <p className=" text-gray-500">{experience.endDate}</p>
                  <ul className=" text-gray-500 list-disc pl-5">
                    {experience.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-primary">Education</h4>

            <div className="space-y-4">
              {resumeData.parsedData.education.map((education) => (
                <div key={education.institution} className="space-y-2">
                  <h3 className="text-lg font-bold">{education.institution}</h3>
                  <p className=" text-gray-500">{education.degree}</p>
                  <p className=" text-gray-500">{education.field}</p>
                  <p className=" text-gray-500">{education.graduationDate}</p>
                  <p className=" text-gray-500">{education.gpa}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-primary">Skills</h4>

            <div>
              <h3>Technical</h3>
              {resumeData.parsedData.skills.technical.map((skill) => (
                <Badge variant="secondary" className="mr-1 mt-1" key={skill}>
                  {skill}
                </Badge>
              ))}
            </div>
            <div>
              <h3>Soft</h3>
              {resumeData.parsedData.skills.soft.map((skill) => (
                <Badge variant="secondary" className="mr-1 mt-1" key={skill}>
                  {skill}
                </Badge>
              ))}
            </div>
            {resumeData.parsedData.skills.languages && (
              <div>
                <h3>Languages</h3>
                {resumeData.parsedData.skills.languages?.map((language) => (
                  <Badge
                    variant="secondary"
                    className="mr-1 mt-1"
                    key={language}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-primary">Projects</h4>

            <div className="space-y-4">
              {resumeData.parsedData.projects?.map((project) => (
                <div key={project.name} className="space-y-2">
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  <p className=" text-gray-500">{project.description}</p>
                  <p className=" text-gray-500">
                    {project.technologies?.map((technology) => (
                      <Badge
                        variant="secondary"
                        className="mr-1 mt-1"
                        key={technology}
                      >
                        {technology}
                      </Badge>
                    ))}
                  </p>
                  <p className=" text-gray-500">{project.url}</p>
                </div>
              ))}
            </div>
          </div>
          {resumeData.parsedData.certifications &&
          resumeData.parsedData.certifications.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-bold text-primary">Certifications</h4>
              <div className="space-y-4">
                {resumeData.parsedData.certifications?.map((certification) => (
                  <div key={certification.name} className="space-y-2">
                    <h3 className="text-lg font-bold">{certification.name}</h3>
                    <p className=" text-gray-500">{certification.issuer}</p>
                    <p className=" text-gray-500">{certification.date}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div>No data found, need to parse the resume</div>
      )}

      <div className="sticky top-0 right-0">
        <iframe
          src={resumeData.s3Url}
          className="w-full h-[calc(100vh-200px)]"
        />
      </div>
    </div>
  );
}
