"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "../ui/button";
import { Download, File, Loader2, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useResumeUpload } from "@/hooks/use-resume-upload";
import { useRouter } from "next/navigation";

export default function ResumeUploadDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { mutate: uploadResume, isPending } = useResumeUpload();
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        uploadResume(
          { file: acceptedFiles[0] },
          {
            onSuccess: (data) => {
              setFile(null);
              setOpen(false);
              router.push(`/dashboard/resumes/${data.resume.id}`);
            },
            onError: () => {
              setFile(null);
              setOpen(false);
            },
          }
        );
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload />
          Upload Resume
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Your Resume</DialogTitle>
          <DialogDescription>
            Upload a PDF resume to get started with AI-powered analysis and
            tailoring.
          </DialogDescription>
        </DialogHeader>

        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <>
                {!isDragActive ? (
                  <>
                    <Upload className="size-11 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">
                        Drop your resume here
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to browse
                      </p>
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
            {isPending ? (
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
      </DialogContent>
    </Dialog>
  );
}
