"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import RoleGuard from "../RoleGuard";
import { Users } from "lucide-react";

export default function DashboardAdmin() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
    fetchUserRole();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">
      {/* --- NEW: Quick Admin Actions --- */}
      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-blue-900">
              User Role Management
            </h3>
            <p className="text-sm text-blue-700">
              View all users and assign roles (Admin, Staff, etc).
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            <Users className="w-5 h-5" />
            Manage All Roles
          </Link>
        </div>
      </RoleGuard>

      {/* --- Main Dashboard Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RoleGuard
          roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]}
          userRole={userRole}
        >
          <Link href="/super-admin/dashboard">
            <Section
              title="Access Requests"
              description="Manage access requests to the society admin."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/role-management">
            <Section
              title="Role & Society Management"
              description="Assign and manage roles across societies."
            />
          </Link>
        </RoleGuard>

        <RoleGuard
          roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]}
          userRole={userRole}
        >
          <Link href="/billing">
            <Section
              title="Payment Reports"
              description="View & export payment data."
            />
          </Link>
        </RoleGuard>

        <RoleGuard
          roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]}
          userRole={userRole}
        >
          <Link href="/accounting">
            <Section
              title="End-to-End Accounting"
              description="Track income & expenses, manage financials."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/upload-qr-admin">
            <Section
              title="Upload QR Code"
              description="Upload QR codes for society subscriptions."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/features">
            <Section
              title="Features Control"
              description="Explore all tools and capabilities of the app."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/Facilities">
            <Section
              title="Facility Booking"
              description="Book and manage society facilities."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/allVisitor">
            <Section
              title="Visitor Management"
              description="Manage visitor entries and approvals."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/complaints">
            <Section
              title="Complaints Management"
              description="View and manage society complaints."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/polls">
            <Section
              title="Polls & Voting"
              description="Create and manage society polls."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/staff-management">
            <Section
              title="Staff Management"
              description="Manage society staff and their tasks."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/watchman-logs">
            <Section
              title="Watchman Activity Logs"
              description="View logs of all people entering and exiting the society."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/emergency-contacts">
            <Section
              title="Emergency Contacts"
              description="Manage emergency contact information."
            />
          </Link>
        </RoleGuard>

        <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
          <Link href="/notice-board">
            <Section
              title="Notice Board"
              description="Manage society notices and announcements."
            />
          </Link>
        </RoleGuard>
      </div>
    </div>
  );
}
