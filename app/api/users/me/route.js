import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function GET(req) {
  try {
    const user = await checkUser();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /users/me Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
