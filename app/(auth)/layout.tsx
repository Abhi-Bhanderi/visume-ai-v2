import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-transparent relative">
      {/* Diagonal Fade Center Grid Background */}
      <div className="absolute inset-0 pointer-events-none bg-[length:32px_32px] bg-[linear-gradient(to_right,#e0e9f6_1px,transparent_1px),linear-gradient(to_bottom,#e0e9f6_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_90%)]" />
      <div className="min-h-screen relative z-20 grid place-content-center">
        {children}
      </div>
    </div>
  );
}
