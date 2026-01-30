"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import {
  CheckCircle,
  Users,
  CreditCard,
  Eye,
  Building,
  QrCode,
  FileText,
} from "lucide-react";

export default function DashboardSocietySecretary() {
  // ... (Keep existing fetch logic) ...
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    async function fetchUserRole() {
      // ... same fetch logic ...
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user.role);
        }
      } catch (error) {}
    }
    fetchUserRole();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      {/* 1. PRIORITY ACTIONS */}
      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Pending Approvals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/society-admin/approve-payments">
            <Section
              title="Approve Payments"
              description="Verify resident transactions."
              icon={<CheckCircle className="w-6 h-6" />}
              variant="blue"
            />
          </Link>
          <Link href="/dashboard/visitor">
            <Section
              title="Visitor Approvals"
              description="Manage gate pass requests."
              icon={<Users className="w-6 h-6" />}
              variant="blue"
            />
          </Link>
          <Link href="/dashboard/society-admin">
            <Section
              title="Admin Console"
              description="Main society settings."
              icon={<Building className="w-6 h-6" />}
              variant="blue"
            />
          </Link>
        </div>
      </div>

      {/* 2. FINANCE */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 px-2">
          Financial Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/Accounting">
            <Section
              title="Society Ledger"
              description="Accounting & Billing reports."
              icon={<FileText className="w-6 h-6" />}
              variant="emerald"
            />
          </Link>
          <Link href="/dashboard/society-admin/upload-qr">
            <Section
              title="QR Code Setup"
              description="Update UPI collection codes."
              icon={<QrCode className="w-6 h-6" />}
              variant="emerald"
            />
          </Link>
        </div>
      </div>

      {/* 3. MONITORING */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 px-2">
          Monitoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/watchman-logs">
            <Section
              title="Daily Logs"
              description="View entry/exit activity."
              icon={<Eye className="w-6 h-6" />}
              variant="orange"
            />
          </Link>
          <Link href="/allVisitor">
            <Section
              title="Visitor History"
              description="Full database of guests."
              icon={<Users className="w-6 h-6" />}
              variant="orange"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
