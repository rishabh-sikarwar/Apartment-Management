import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// 1. Create Session
export async function createSession(userId, role) {
  const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });

  // Wait for the cookies object
  const cookieStore = await cookies();

  // FIX: Use .set() directly on the object. Do NOT call it like cookieStore()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// 2. Get Session
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// 3. Destroy Session
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
}
