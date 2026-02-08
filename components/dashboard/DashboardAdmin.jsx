"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import {
  Users,
  CreditCard,
  LayoutDashboard,
  FileText,
  ShieldAlert,
  Activity,
  ClipboardList,
  Megaphone,
  Vote,
  UserCog,
} from "lucide-react";

export default function DashboardAdmin() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    }
    fetchUserRole();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* --- QUICK ACTION: User Management --- */}
      {userRole === "SUPER_ADMIN" && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              User Role Management
            </h3>
            <p className="text-blue-700 mt-1">
              View all registered users and assign roles (Admin, Staff, etc).
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-transform active:scale-95 whitespace-nowrap"
          >
            <UserCog className="w-5 h-5" />
            Manage All Roles
          </Link>
        </div>
      )}

      {/* 1. SYSTEM CONTROL (Purple) */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-purple-600 rounded-full shadow-md shadow-purple-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              System Control
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Global access and configuration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRole === "SUPER_ADMIN" && (
            <>
              <Link href="/role-management" className="h-full">
                <Section
                  title="Role Management"
                  description="Assign or revoke system-wide access roles."
                  icon={<Users />}
                  variant="purple"
                />
              </Link>
              <Link href="/upload-qr-admin" className="h-full">
                <Section
                  title="Global QR Setup"
                  description="Manage master subscription payment QRs."
                  icon={<CreditCard />}
                  variant="purple"
                />
              </Link>
              <Link href="/features" className="h-full">
                <Section
                  title="Feature Control"
                  description="Enable or disable specific system modules."
                  icon={<LayoutDashboard />}
                  variant="purple"
                />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* 2. FINANCIAL OVERSIGHT (Emerald) */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-emerald-600 rounded-full shadow-md shadow-emerald-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Financial Oversight
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Revenue tracking and approvals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/super-admin/dashboard" className="h-full">
            <Section
              title="Society Requests"
              description="Review and approve new society registrations."
              icon={<ClipboardList />}
              variant="emerald"
            />
          </Link>
          <Link href="/billing" className="h-full">
            <Section
              title="Payment Reports"
              description="View global transaction history and exports."
              icon={<FileText />}
              variant="emerald"
            />
          </Link>
          <Link href="/Accounting" className="h-full">
            <Section
              title="Master Accounting"
              description="Track income, expenses, and ledgers."
              icon={<CreditCard />}
              variant="emerald"
            />
          </Link>
        </div>
      </section>

      {/* 3. OPERATIONS (Blue) */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-md shadow-blue-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Operations & Security
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Daily management and safety.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/staff-management" className="h-full">
            <Section
              title="Staff Management"
              description="Manage shifts, payroll, and staff tasks."
              icon={<Users />}
              variant="blue"
            />
          </Link>
          <Link href="/watchman-logs" className="h-full">
            <Section
              title="Gate Activity Logs"
              description="Monitor live entry and exit logs."
              icon={<Activity />}
              variant="blue"
            />
          </Link>
          <Link href="/emergency-contacts" className="h-full">
            <Section
              title="SOS Contacts"
              description="Update Police, Fire, and Ambulance numbers."
              icon={<ShieldAlert />}
              variant="rose"
            />
          </Link>
        </div>
      </section>

      {/* 4. COMMUNITY (Orange) */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-orange-600 rounded-full shadow-md shadow-orange-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Community
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Resident engagement tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/complaints" className="h-full">
            <Section
              title="Complaints"
              description="Track and resolve resident issues."
              icon={<FileText />}
              variant="orange"
            />
          </Link>
          <Link href="/notice-board" className="h-full">
            <Section
              title="Notice Board"
              description="Publish circulars and announcements."
              icon={<Megaphone />}
              variant="orange"
            />
          </Link>
          <Link href="/polls" className="h-full">
            <Section
              title="Polls & Voting"
              description="Create voting sessions for decisions."
              icon={<Vote />}
              variant="orange"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
