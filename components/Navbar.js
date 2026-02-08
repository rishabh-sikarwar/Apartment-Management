// components/Navbar.jsx
import Link from "next/link";
import NavbarClient from "./NavbarClient";
import { checkUser } from "@/lib/checkUser";

const Navbar = async () => {
  const user = await checkUser();

  return (
    // Updated: White background with blur for a modern glass effect
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Optional: Add your Logo Image here if you have one */}
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
            E-PARTMENT
          </span>
        </Link>

        <NavbarClient user={user} />
      </nav>
    </header>
  );
};

export default Navbar;
