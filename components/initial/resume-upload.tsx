"use client";

import { DetailsType, ProgressType } from "@/app/initial/page";
import { useResumeUpload } from "@/hooks/use-resume-upload";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowRight, Upload } from "lucide-react";
import { Download } from "lucide-react";
import { Loader2 } from "lucide-react";
import { File } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { extractTextFromPDF } from "@/lib/services/file-parser";
import extractText from "@/actions/extractText";

export default function ResumeUpload({
  handleProgress,
  handleResumeAndJobDetails,
}: {
  handleProgress: (step: number, form: ProgressType["form"]) => void;
  handleResumeAndJobDetails: ({ resume, job }: DetailsType) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setIsLoading(true);
      if (acceptedFiles.length > 0) {
        const text = await extractText(acceptedFiles[0]);
        setFile(acceptedFiles[0]);
        handleResumeAndJobDetails({
          resume: { text, file: acceptedFiles[0] },
        });
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Upload your resume</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Upload a resume to get started with AI-powered analysis and tailoring.
      </p>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 mt-10 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-400 hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <>
              {!isDragActive ? (
                <>
                  <Upload className="size-11 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">Drop your resume here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">
                      PDF files only, max 10MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Download className="size-11 text-primary/30" />
                  <p className="text-lg font-medium text-primary">
                    Drop it like it&apos;s hot
                  </p>
                </>
              )}
            </>
          </div>
        </div>
      ) : (
        <div className="flex relative items-center space-y-4 border-2 rounded-2xl py-3 px-4 gap-4 justify-between group">
          {isLoading ? (
            <Loader2 className="size-6 text-primary animate-spin" />
          ) : (
            <>
              <File className="size-6 text-primary " />
              <div className="flex-1">
                <p className="text-lg font-medium">{file?.name}</p>
                <p className="text-sm text-gray-500 flex justify-between">
                  {(file?.size / 1024 / 1024).toFixed(2)} MB
                  <span className="text-gray-500 text-xs">{file.type}</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <Button onClick={() => handleProgress(3, "COMPLETED")} disabled={!file}>
          Continue <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
