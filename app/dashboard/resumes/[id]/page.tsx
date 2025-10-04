import ResumeDetails, { ResumeData } from "@/components/resumes/resume-details";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const resume = await prisma.resume.findUnique({
    where: { id, userId: session?.user.id },
  });

  if (!resume) {
    redirect("/dashboard/resumes");
  }

  return <ResumeDetails resume={resume as unknown as ResumeData} />;
}
