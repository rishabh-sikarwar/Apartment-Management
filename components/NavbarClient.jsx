"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Info,
  Phone,
  HelpCircle,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
  { name: "About", path: "/about", icon: <Info className="w-5 h-5" /> },
  {
    name: "Contact Us",
    path: "/contact-us",
    icon: <Phone className="w-5 h-5" />,
  },
  { name: "FAQ's", path: "/faq", icon: <HelpCircle className="w-5 h-5" /> },
];

export default function NavbarClient({ user: initialUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize state
  const [user, setUser] = useState(initialUser);
  const profileRef = useRef(null);

  // 1. Sync with Server Prop (Standard)
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // 2. ✅ "Self-Healing" Check (The Fix)
  // If the component thinks we are logged out, but we might have just logged in, check the API.
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          // If API returns a user, but state is null -> Update State & Refresh Router
          if (data && !user) {
            setUser(data);
            router.refresh();
          }
        }
      } catch (err) {
        // Ignore errors (user likely truly logged out)
      }
    };

    // Only verify if we currently have no user in state
    if (!user) {
      verifySession();
    }
  }, [pathname]); // Run on every page navigation

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* --- DESKTOP NAV --- */}
      <div className="hidden sm:flex gap-4 items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
              pathname === item.path
                ? "bg-blue-700 text-white shadow-lg"
                : "text-blue-900 hover:bg-blue-200",
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* --- AUTH BUTTONS (Desktop) --- */}
      <div className="hidden sm:flex items-center gap-4 ml-4">
        {user ? (
          /* LOGGED IN STATE */
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2",
                user.role === "SUPER_ADMIN"
                  ? "bg-purple-700 hover:bg-purple-800 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white",
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              {user.role === "SUPER_ADMIN" ? "Admin Panel" : "Dashboard"}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-10 w-10 rounded-full border-2 border-white shadow-md overflow-hidden hover:scale-105 transition-transform focus:outline-none ring-2 ring-transparent hover:ring-blue-300"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {user.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 origin-top-right"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.name || user.firstName}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {user.email || user.phoneNumber}
                      </p>
                      <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {user.role === "SUPER_ADMIN" && (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        {user.role}
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 mr-3" /> My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3" /> Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* LOGGED OUT STATE */
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-5 py-2 rounded-full text-sm font-semibold text-blue-700 border border-blue-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* --- MOBILE TOGGLE --- */}
      <div className="sm:hidden flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-900 hover:text-blue-700 transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md px-6 pb-6 shadow-xl border-t border-gray-100 z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="space-y-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.icon} {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.email || user.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
