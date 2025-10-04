import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const resumes = await prisma.resume.findMany({
    where: { ownerUserId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  console.log("🚀 ~ Page ~ resumes:", resumes);

  if (resumes.length === 0) {
    redirect("/initial");
  }

  return (
    <div className="grid grid-cols-1 container mx-auto md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resumes.map((resume) => (
        <div key={resume.id}>
          <h2>{resume.fullName}</h2>
          <iframe src={resume.sourceUrl ?? ""} />
        </div>
      ))}
    </div>
  );
}
