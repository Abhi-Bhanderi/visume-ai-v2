import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, LogIn } from "lucide-react";

export default function Header() {
  return (
    <nav className="flex justify-between items-center p-4 container mx-auto">
      <h1 className="text-xl">Visume AI</h1>

      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="secondary">
            <LogIn />
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button>
            Get Started
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
