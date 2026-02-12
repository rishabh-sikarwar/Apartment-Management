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
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
  { name: "About", path: "/about", icon: <Info className="w-5 h-5" /> },
  { name: "Contact", path: "/contact-us", icon: <Phone className="w-5 h-5" /> },
  { name: "FAQ", path: "/faq", icon: <HelpCircle className="w-5 h-5" /> },
];

export default function NavbarClient({ user: initialUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize state
  const [user, setUser] = useState(initialUser);
  const profileRef = useRef(null);

  // 1. Sync with Server Prop
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // 2. "Self-Healing" Check
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          if (data && !user) {
            setUser(data);
            router.refresh();
          }
        }
      } catch (err) {
        // Ignore
      }
    };
    if (!user) {
      verifySession();
    }
  }, [pathname]);

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
      <div className="hidden md:flex gap-2 items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-full text-base font-semibold transition-all duration-300",
              pathname === item.path
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:text-blue-600 hover:bg-blue-50",
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* --- AUTH BUTTONS (Desktop) --- */}
      <div className="hidden md:flex items-center gap-4 ml-6 pl-6 border-l border-slate-200">
        {user ? (
          /* LOGGED IN STATE */
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={clsx(
                "px-6 py-2.5 rounded-full text-base font-bold transition shadow-sm hover:shadow-md flex items-center gap-2 text-white",
                user.role === "SUPER_ADMIN"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-slate-900 hover:bg-black",
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              {user.role === "SUPER_ADMIN" ? "Admin" : "Dashboard"}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="h-10 w-10 rounded-full border border-slate-200 shadow-sm overflow-hidden bg-white">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 origin-top-right"
                  >
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                      <p className="text-base font-bold text-slate-900 truncate">
                        {user.name || user.firstName}
                      </p>
                      <p className="text-sm text-slate-500 truncate mb-2">
                        {user.email || user.phoneNumber}
                      </p>
                      <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {user.role === "SUPER_ADMIN" && (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        {user.role.replace("_", " ")}
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-5 py-3 text-base font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <UserIcon className="w-5 h-5 mr-3" /> My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-5 py-3 text-base font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Settings className="w-5 h-5 mr-3" /> Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-2 pb-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-5 py-3 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-3" /> Sign Out
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
              className="px-6 py-2.5 rounded-full text-base font-bold text-slate-700 border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-2.5 rounded-full text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* --- MOBILE TOGGLE --- */}
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-800 hover:text-blue-600 transition p-1"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl px-6 pb-8 shadow-2xl border-t border-slate-100 z-40 h-screen"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="space-y-3 mt-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl text-lg font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {item.icon} {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-2xl">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {user.email || user.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl text-lg font-bold hover:bg-slate-200"
                  >
                    <UserIcon className="w-5 h-5" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-xl text-lg font-bold hover:bg-red-100"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-700 text-lg font-bold hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center px-6 py-4 rounded-xl bg-blue-600 text-white text-lg font-bold shadow-lg hover:bg-blue-700"
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
