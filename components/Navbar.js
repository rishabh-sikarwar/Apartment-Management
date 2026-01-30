// components/Navbar.jsx
import Link from "next/link";
import NavbarClient from "./NavbarClient";
import { checkUser } from "@/lib/checkUser";

const Navbar = async () => {
  const user = await checkUser();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-x1 bg-blue-100 shadow-md transition duration-500">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-900 tracking-wide hover:scale-105 transition"
        
        >
          E-PARTMENT
        </Link>
        <NavbarClient user={user} />
      </nav>
    </header>
  );
};

export default Navbar;
