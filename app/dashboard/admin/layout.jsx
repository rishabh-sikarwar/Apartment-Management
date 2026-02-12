import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser"; // Use your custom helper

export default async function AdminLayout({ children }) {
  // 1. Get User from Custom Auth
  const user = await checkUser();

  // 2. If not logged in, go to sign-in
  if (!user) {
    return redirect("/sign-in");
  }

  // 3. Strict Role Check
  if (user.role !== "SUPER_ADMIN") {
    return redirect("/"); // Redirect if not admin
  }

  return <>{children}</>;
}
