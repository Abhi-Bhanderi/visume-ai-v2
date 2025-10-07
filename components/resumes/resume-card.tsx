import { Resume } from "@prisma/client";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { File } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ResumeCard({ resume }: { resume: Resume }) {
  return (
    <Link
      href={`/dashboard/resumes/${resume.id}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Card className="hover:shadow-xl cursor-pointer hover:-translate-y-1 transition-all border-2 hover:border-primary/30">
        <CardHeader className="space-y-3">
          <File size={30} className="text-primary" />
          <div className="space-y-1.5 ">
            <CardTitle className="text-xl">{resume.sourceFileName}</CardTitle>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
