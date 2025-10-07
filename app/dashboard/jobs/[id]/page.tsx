import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResumeCard from "@/components/resumes/resume-card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Briefcase, ExternalLink, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const job = await prisma.job.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      requirements: {
        orderBy: { importance: "asc" },
        include: {
          matches: {
            include: {
              bullet: {
                include: {
                  resume: true,
                },
              },
            },
          },
        },
      },
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!job) {
    redirect("/dashboard");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      fileName: true,
      bullets: {
        select: {
          matches: {
            where: {
              requirement: { jobId: id },
            },
            select: { id: true },
          },
        },
      },
    },
  });

  const parsedData = job.parsedData as { responsibilities?: string[]; skills?: string[] } | null;
  const mustHaveReqs = job.requirements.filter((r) => r.importance === "must_have");
  const niceToHaveReqs = job.requirements.filter((r) => r.importance === "nice_to_have");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {job.title} at {job.company}
              </h1>
              <p className="text-sm text-gray-600">
                Added {formatDate(job.createdAt)} • {job.requirements.length} requirements
              </p>
            </div>
            <div className="flex items-center gap-2">
              {job.url && (
                <Link href={job.url} target="_blank">
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Original
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{job.requirements.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Must Have</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{mustHaveReqs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Nice to Have</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{niceToHaveReqs.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Match with Resume</CardTitle>
            <CardDescription>Analyze how your resume matches this job description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resumes.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No resumes uploaded yet</p>
                  <Link href="/dashboard/resumes/upload">
                    <Button>Upload Resume</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {resumes.map((resume) => {
                      const hasMatches = resume.bullets.some((bullet) => bullet.matches.length > 0);
                      return (
                        <div key={resume.id} className="space-y-2">
                          <ResumeCard
                            resume={{ id: resume.id, fileName: resume.fileName }}
                            job={job}
                            hasMatches={hasMatches}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements Breakdown</CardTitle>
            <CardDescription>Extracted job requirements and qualifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mustHaveReqs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    Must Have ({mustHaveReqs.length})
                  </h3>
                  <div className="space-y-2">
                    {mustHaveReqs.map((req) => (
                      <div key={req.id} className="border-l-2 border-l-red-500 pl-4 py-2">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm">{req.text}</p>
                          <Badge variant="outline">{req.category}</Badge>
                        </div>
                        {req.matches.length > 0 && (
                          <p className="text-xs text-gray-600 mt-2">
                            {req.matches.length} resume bullets match this requirement
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {niceToHaveReqs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Nice to Have ({niceToHaveReqs.length})
                  </h3>
                  <div className="space-y-2">
                    {niceToHaveReqs.map((req) => (
                      <div key={req.id} className="border-l-2 border-l-green-500 pl-4 py-2">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm">{req.text}</p>
                          <Badge variant="outline">{req.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {parsedData?.responsibilities && parsedData.responsibilities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {parsedData.responsibilities.map((resp: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span className="text-sm">{resp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {parsedData?.skills && parsedData.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
