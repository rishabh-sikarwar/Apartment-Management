import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const user = await checkUser();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        society: {
          select: {
            name: true,
            id: true,
          }
        }
      }
    })
    return NextResponse.json(fullUser);
  } catch (error) {
    console.error("GET /users/me Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
