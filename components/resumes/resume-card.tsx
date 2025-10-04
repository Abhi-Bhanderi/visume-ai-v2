import { Resume } from "@prisma/client";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { File } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ResumeCard({ resume }: { resume: Resume }) {
  return (
    <Link href={`/dashboard/resumes/${resume.id}`}>
      <Card className="hover:shadow-xl cursor-pointer hover:-translate-y-1 transition-all border-2 hover:border-primary/30">
        <CardHeader className="space-y-3">
          <File size={30} className="text-primary" />
          <div className="space-y-1.5 ">
            <CardTitle className="text-xl">{resume.fileName}</CardTitle>
            <CardDescription className="text-sm flex justify-between">
              <p>Uploaded on {format(resume.createdAt, "MMM d, yyyy")}</p>
              <p className="text-sm text-gray-400">
                {Math.round(resume.fileSize / 1024 / 1024)} MB
              </p>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
