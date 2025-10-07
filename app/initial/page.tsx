"use client";

import JobForm from "@/components/initial/job-form";
import { ParsingResume } from "@/components/initial/parsing-resume";
import ResumeUpload from "@/components/initial/resume-upload";
import { useState } from "react";

export type ProgressType = {
  step: number;
  form: "JOB_FORM" | "RESUEM_UPLOAD_FORM" | "COMPLETED";
  hasCompleted: ("JOB_FORM" | "RESUEM_UPLOAD_FORM" | "COMPLETED")[];
};

export type DetailsType = {
  resume?: {
    text: string;
    file: File;
  };
  job?: {
    description: string;
    title: string;
    company: string;
  };
};

export default function InitialSetupPage() {
  const [resumeAndJobDetails, setResumeAndJobDetails] = useState<DetailsType>(
    {} as DetailsType
  );

  console.log(
    "🚀 ~ InitialSetupPage ~ resumeAndJobDetails:",
    resumeAndJobDetails
  );

  const [progress, setProgress] = useState<ProgressType>({
    step: 1,
    form: "JOB_FORM",
    hasCompleted: [],
  });

  function handleProgress(step: number, form: ProgressType["form"]) {
    setProgress({
      step,
      form,
      hasCompleted: [...progress.hasCompleted, form],
    });
  }

  function handleResumeAndJobDetails({ resume, job }: DetailsType) {
    setResumeAndJobDetails({
      resume: resume ? resume : resumeAndJobDetails.resume,
      job: job ? job : resumeAndJobDetails.job,
    });
  }

  return (
    <div>
      <nav className="px-10 py-3">
        <h3 className="text-xl font-bold text-primary ">Visume AI</h3>
      </nav>
      <div className="max-w-xl grid place-content-center   min-h-[calc(100vh_-_200px)] space-y-10 container mx-auto">
        {/* <div className="flex  gap-3">
          <Button
            variant={progress.step === 1 ? "default" : "secondary"}
            onClick={() => handleProgress(1, "JOB_FORM")}
          >
            1
          </Button>
          <Button
            variant={progress.step === 2 ? "default" : "secondary"}
            onClick={() => handleProgress(2, "RESUEM_UPLOAD_FORM")}
          >
            2
          </Button>
          <Button
            variant={progress.step === 3 ? "default" : "secondary"}
            onClick={() => handleProgress(3, "COMPLETED")}
          >
            3
          </Button>
        </div> */}
        {progress.form === "JOB_FORM" && (
          <JobForm
            handleProgress={handleProgress}
            handleResumeAndJobDetails={handleResumeAndJobDetails}
          />
        )}
        {progress.form === "RESUEM_UPLOAD_FORM" && (
          <ResumeUpload
            handleProgress={handleProgress}
            handleResumeAndJobDetails={handleResumeAndJobDetails}
          />
        )}

        {progress.form === "COMPLETED" && (
          <ParsingResume
            handleProgress={handleProgress}
            resumeAndJobDetails={resumeAndJobDetails}
          />
        )}
      </div>
    </div>
  );
}
