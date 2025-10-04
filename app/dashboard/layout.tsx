import DashboardProvider from "@/components/providers/dashboard-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
