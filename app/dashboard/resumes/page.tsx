import ResumeUploadDialog from "@/components/resumes/resume-upload-dialog";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ResumeCard from "@/components/resumes/resume-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const resumes = await prisma.resume.findMany({
    where: { ownerUserId: session.user.id as string },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="container mx-auto w-full max-w-7xl mt-10">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl">My Resumes</h2>
        {/* <ResumeUploadDialog /> */}

        <Link href="/initial">
          <Button>
            <Plus />
            Create new resume
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    </section>
  );
}
