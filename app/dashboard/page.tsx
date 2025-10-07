import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const resumes = await prisma.resume.findMany({
    where: { ownerUserId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (resumes.length === 0) {
    redirect("/initial");
  }

  return (
    <div className="grid h-screen place-content-center gap-5 text-center">
      <p className="text-gray-500">
        This Page is under maintenance, Try visiting resumes.{" "}
      </p>
      <Link href="/dashboard/resumes">
        <Button>View resumes</Button>
      </Link>
    </div>
  );
}
