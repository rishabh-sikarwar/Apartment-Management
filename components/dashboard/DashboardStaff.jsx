"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, UserCog, ClipboardList, ShieldCheck } from "lucide-react";
import Section from "../section";

export default function DashboardStaff() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("Role fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full py-20 text-blue-800">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-600" />
        <span className="text-lg font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. GENERAL STAFF PORTAL */}
      {["STAFF", "WATCHMAN", "TECHNICIAN"].includes(userRole) && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-md shadow-blue-200"></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                Staff Portal
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Manage your profile, shifts, and tasks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/staff" className="h-full">
              <Section
                title="My Profile & Shifts"
                description="View salary slips, apply for leave, and check shifts."
                icon={<UserCog />}
                variant="blue"
              />
            </Link>
            <Link href="/complaints" className="h-full">
              <Section
                title="Assigned Complaints"
                description="View and resolve resident maintenance requests."
                icon={<ClipboardList />}
                variant="orange"
              />
            </Link>
          </div>
        </section>
      )}

      {/* 2. WATCHMAN SPECIFIC */}
      {userRole === "WATCHMAN" && (
        <section className="mt-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1.5 bg-rose-600 rounded-full shadow-md shadow-rose-200"></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                Security Access
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Gate control and monitoring.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/watchman" className="h-full">
              <Section
                title="Watchman Dashboard"
                description="Go to the main security gate console."
                icon={<ShieldCheck />}
                variant="rose"
              />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
