"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Always start with Dashboard
    items.push({
      label: "Dashboard",
      href: "/dashboard",
      isCurrentPage: pathname === "/dashboard",
    });

    // If we're just on dashboard, return
    if (pathname === "/dashboard") {
      return items;
    }

    // Build breadcrumbs based on segments
    let currentPath = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      // Skip the "dashboard" segment since we already added it
      if (segment === "dashboard") {
        continue;
      }

      const isLast = i === segments.length - 1;

      // Handle specific routes
      if (segment === "resumes") {
        items.push({
          label: "Resumes",
          href: "/dashboard/resumes",
          isCurrentPage: isLast,
        });
      } else if (segment === "upload") {
        items.push({
          label: "Upload",
          href: "/dashboard/resumes/upload",
          isCurrentPage: isLast,
        });
      } else if (segments[i - 1] === "resumes" && segment !== "upload") {
        // This is a resume ID
        items.push({
          label: "Resume Details",
          href: currentPath,
          isCurrentPage: isLast,
        });
      } else {
        // Generic segment (capitalize first letter)
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        items.push({
          label,
          href: currentPath,
          isCurrentPage: isLast,
        });
      }
    }

    return items;
  }, [pathname]);

  return breadcrumbs;
}
