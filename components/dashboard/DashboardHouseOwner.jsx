"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import {
  Home,
  IndianRupee,
  AlertTriangle,
  UserPlus,
  CalendarDays,
  Clipboard,
} from "lucide-react";

const DashboardHouseOwner = () => {
  // ... (Keep existing fetch logic) ...
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    async function fetchUserRole() {
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
      {/* 1. ESSENTIALS */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
          Essentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/pay-with-qr">
            <Section
              title="Pay Maintenance"
              description="Scan QR to clear dues instantly."
              icon={<IndianRupee className="w-6 h-6" />}
              variant="emerald"
            />
          </Link>
          <Link href="/complaints">
            <Section
              title="Raise Complaint"
              description="Report plumbing, electrical issues."
              icon={<AlertTriangle className="w-6 h-6" />}
              variant="rose"
            />
          </Link>
        </div>
      </div>

      {/* 2. LIFESTYLE & GATE */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 px-2">
          Lifestyle & Gate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/visitor/new">
            <Section
              title="Gate Pass"
              description="Pre-approve guests."
              icon={<UserPlus className="w-6 h-6" />}
              variant="blue"
            />
          </Link>
          <Link href="/Facilities">
            <Section
              title="Book Amenities"
              description="Gym, Hall, Clubhouse."
              icon={<CalendarDays className="w-6 h-6" />}
              variant="purple"
            />
          </Link>
          <Link href="/notice-board">
            <Section
              title="Notices"
              description="Read society updates."
              icon={<Clipboard className="w-6 h-6" />}
              variant="orange"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHouseOwner;
