"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import {
  CheckCircle,
  Users,
  Building,
  QrCode,
  FileText,
  Eye,
} from "lucide-react";

export default function DashboardSocietySecretary() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch (error) {}
    }
    fetchUserRole();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* 1. PRIORITY ACTIONS */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-md shadow-blue-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Approvals & Actions
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Items requiring your attention.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboard/society-admin/approve-payments"
            className="h-full"
          >
            <Section
              title="Approve Payments"
              description="Verify resident transactions."
              icon={<CheckCircle />}
              variant="blue"
            />
          </Link>
          <Link href="/dashboard/visitor" className="h-full">
            <Section
              title="Visitor Approvals"
              description="Manage gate pass requests."
              icon={<Users />}
              variant="blue"
            />
          </Link>
          <Link href="/dashboard/society-admin" className="h-full">
            <Section
              title="Admin Console"
              description="Main society settings."
              icon={<Building />}
              variant="blue"
            />
          </Link>
        </div>
      </section>

      {/* 2. FINANCE */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-emerald-600 rounded-full shadow-md shadow-emerald-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Financials
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Manage funds and accounts.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/Accounting" className="h-full">
            <Section
              title="Society Ledger"
              description="Accounting & Billing reports."
              icon={<FileText />}
              variant="emerald"
            />
          </Link>
          <Link href="/dashboard/society-admin/upload-qr" className="h-full">
            <Section
              title="QR Code Setup"
              description="Update UPI collection codes."
              icon={<QrCode />}
              variant="emerald"
            />
          </Link>
        </div>
      </section>

      {/* 3. MONITORING */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-orange-600 rounded-full shadow-md shadow-orange-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Monitoring
            </h3>
            <p className="text-gray-500 text-sm mt-1">View logs and history.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/watchman-logs" className="h-full">
            <Section
              title="Gate Logs"
              description="View entry/exit activity."
              icon={<Eye />}
              variant="orange"
            />
          </Link>
          <Link href="/allVisitor" className="h-full">
            <Section
              title="Visitor History"
              description="Full database of guests."
              icon={<Users />}
              variant="orange"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
