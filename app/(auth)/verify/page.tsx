"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const router = useRouter();

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    } else {
      setStatus("error");
    }
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      if (response.ok) {
        setStatus("success");
        router.push("/dashboard");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      toast.error("Verification failed", {
        description: "Please try again or request a new verification email.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-12 h-12 text-green-600" />
            )}
            {status === "error" && (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl text-center">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" &&
              "Please wait while we verify your email address."}
            {status === "success" &&
              "Your email has been successfully verified."}
            {status === "error" &&
              "We couldn't verify your email. The link may be invalid or expired."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
