import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 1. Secret Key (Must match the one in lib/auth.js)
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-change-this",
);

// 2. Define Public Routes
// These are the ONLY pages a non-logged-in user can see.
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/about",
  "/contact-us",
  "/faq",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 3. Retrieve the token from cookies
  const token = req.cookies.get("session_token")?.value;

  // 4. Verify Token Helper
  let isValidToken = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      isValidToken = true;
    } catch (error) {
      console.error("Middleware: Invalid or Expired Token");
      // If token is invalid, treat as guest
    }
  }

  // ----------------------------------------------------------------
  // LOGIC A: User is LOGGED IN
  // ----------------------------------------------------------------
  if (isValidToken) {
    // If logged in user tries to visit Sign-In or Sign-Up, redirect to Dashboard
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Allow access to everything else (Dashboard, APIs, etc.)
    return NextResponse.next();
  }

  // ----------------------------------------------------------------
  // LOGIC B: User is NOT Logged In (Guest)
  // ----------------------------------------------------------------

  // 1. Allow Public Pages
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Allow Authentication APIs (Login/Register must be accessible)
  // Also allow public APIs (like fetching list of societies for dropdowns)
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  // 3. BLOCK Everything Else -> Redirect to Sign In
  // This catches /dashboard, /profile, /settings, and any protected API calls
  return NextResponse.redirect(new URL("/sign-in", req.url));
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
