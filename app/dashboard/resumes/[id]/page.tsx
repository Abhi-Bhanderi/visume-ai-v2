import ResumeDetails from "@/components/resumes/resume-details";
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
    where: { id, ownerUserId: session.user.id },
    include: {
      experiences: true,
      additionalItems: true,
      certifications: true,
      education: true,
      meta: true,
      projects: true,
      publications: true,
      languages: true,
    },
  });

  if (!resume) {
    redirect("/dashboard/resumes");
  }

  return <ResumeDetails resume={resume} />;
}
