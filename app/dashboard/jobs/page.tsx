import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import JobDescriptionDialog from "@/components/job-description-dialog";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const jobs = await prisma.job.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      requirements: {
        select: { id: true, importance: true },
      },
      _count: {
        select: { requirements: true },
      },
    },
  });

  return (
    <div className="min-h-screen ">
      <div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Job Descriptions</h1>
            {jobs.length !== 0 && <JobDescriptionDialog />}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {jobs.length === 0 ? (
          <div>
            <div className="pt-6 text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No job descriptions yet
              </h2>
              <p className="text-gray-600 mb-6">
                Add a job description to analyze requirements and match with
                your resume
              </p>
              <JobDescriptionDialog />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const mustHave = job.requirements.filter(
                (r) => r.importance === "must_have"
              ).length;
              const niceToHave = job.requirements.filter(
                (r) => r.importance === "nice_to_have"
              ).length;

              return (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Briefcase className="w-10 h-10 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg mt-4">
                        {job.title}
                      </CardTitle>
                      <CardDescription>
                        {job.company} • Added{" "}
                        {format(job.createdAt, "MMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Total Requirements:
                          </span>
                          <span className="font-medium">
                            {job._count.requirements}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {mustHave} Must Have
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {niceToHave} Nice to Have
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
