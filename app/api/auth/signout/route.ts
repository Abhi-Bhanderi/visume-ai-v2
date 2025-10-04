import { signOut } from "next-auth/react";

export async function POST() {
  await signOut({ redirect: true });
}
