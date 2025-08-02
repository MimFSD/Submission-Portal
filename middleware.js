import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Secret from env for JWT verification
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // If user is not logged in
  if (!token) {
    // Allow access to public routes
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/api/auth") ||
      pathname === "/"
    ) {
      return NextResponse.next();
    }
    // Redirect to login if trying to access protected route
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in, check roles and route permissions:

  // Protect Instructor routes (e.g., /instructor/*)
  if (pathname.startsWith("/instructor")) {
    if (token.role !== "INSTRUCTOR") {
      // Redirect unauthorized users
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect Student routes (e.g., /student/*)
  if (pathname.startsWith("/student")) {
    if (token.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

// Specify which paths middleware runs on
export const config = {
  matcher: [
    "/instructor/:path*",
    "/student/:path*",
    "/login",
    "/register",
  ],
};
