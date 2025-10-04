import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to auth pages without authentication
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/verify-email") ||
          pathname.startsWith("/verify") ||
          pathname === "/" ||
          pathname.startsWith("/api/auth")
        ) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
    "/dashboard/:path*",
  ],
};
