// app/api/users/me/route.js
import { NextResponse } from "next/server";
import { checkUserFromRequest } from "@/lib/checkUser"; // ✅ Reuse your working helper

export async function GET(req) {
  try {
    // This helper checks Auth AND auto-creates the user in MySQL if missing
    // It does exactly what we want!
    const user = await checkUserFromRequest(req);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Success! Return the user
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /me Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
