import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Diagonal Fade Grid Background - Top Right */}
      <div
        className="absolute inset-0 z-0 [background-size:32px_32px] [background-image:linear-gradient(to_right,rgb(209_213_219)_1px,transparent_1px),linear-gradient(to_bottom,rgb(209_213_219)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgb(55_65_81)_1px,transparent_1px),linear-gradient(to_bottom,rgb(55_65_81)_1px,transparent_1px)]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
        }}
      />

      <div className="relative z-20">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build Your Perfect
              <span className="text-primary"> Resume</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create professional resumes with AI assistance. Get noticed by
              employers with our modern templates and smart optimization tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Secure Authentication
              </h3>
              <p className="text-muted-foreground text-sm">
                Advanced security with email verification and OAuth integration
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 mx-auto">
                <ArrowRight className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Setup</h3>
              <p className="text-muted-foreground text-sm">
                Quick registration with email verification and instant access
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Powered</h3>
              <p className="text-muted-foreground text-sm">
                Smart resume builder with AI assistance and optimization
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
