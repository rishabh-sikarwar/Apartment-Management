import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 1. Define Protected Routes
// Add any path that requires a user to be logged in
const protectedRoutes = ["/dashboard", "/account", "/transaction"];

// 2. Secret Key (Must match the one in lib/auth.js)
// 'jose' requires the key to be a Uint8Array, hence the TextEncoder
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-change-this",
);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 3. Check if the current path is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 4. Retrieve the token from cookies
  const token = req.cookies.get("session_token")?.value;

  // 5. SCENARIO A: Protected Route + No Token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 6. SCENARIO B: Token exists (Validate it)
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);

      // OPTIONAL: If user is already logged in, prevent them from visiting login/signup
      if (pathname === "/sign-in" || pathname === "/sign-up") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Valid token -> Let them pass
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      console.error("Middleware Auth Error:", error);

      // If they were trying to go to a protected route with a bad token, redirect them
      if (isProtected) {
        // Optional: Clear the invalid cookie so the client knows they are out
        const response = NextResponse.redirect(new URL("/sign-in", req.url));
        response.cookies.delete("session_token");
        return response;
      }
    }
  }

  // 7. Allow all other requests (Public routes, static files, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
