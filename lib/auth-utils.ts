import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getRequiredSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function getOptionalSession() {
  return await getServerSession(authOptions);
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isOtpExpired(expires: Date): boolean {
  return new Date() > expires;
}

export function getOtpExpiryTime(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}