import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-transparent relative">
      {/* Diagonal Fade Center Grid Background */}
      <div
        className="absolute inset-0  pointer-events-none"
        style={{
          backgroundImage: `
        linear-gradient(to right, #e0e9f6 1px, transparent 1px),
        linear-gradient(to bottom, #e0e9f6 1px, transparent 1px)
      `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 90%)",
        }}
      />
      <div className="min-h-screen relative z-20 grid place-content-center">
        {children}
      </div>
    </div>
  );
}
