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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* 1. ESSENTIALS */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-green-600 rounded-full shadow-md shadow-green-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Essentials
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Payments and Complaints.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/pay-with-qr" className="h-full">
            <Section
              title="Pay Maintenance"
              description="Scan QR to clear dues instantly."
              icon={<IndianRupee />}
              variant="emerald"
            />
          </Link>
          <Link href="/complaints" className="h-full">
            <Section
              title="File a Complaint"
              description="Report plumbing, electrical issues."
              icon={<AlertTriangle />}
              variant="rose"
            />
          </Link>
        </div>
      </section>

      {/* 2. LIFESTYLE & GATE */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-md shadow-blue-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Lifestyle & Gate
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Bookings and Visitor Management.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/visitor/new" className="h-full">
            <Section
              title="Gate Pass"
              description="Pre-approve visitors for entry."
              icon={<UserPlus />}
              variant="blue"
            />
          </Link>
          <Link href="/Facilities" className="h-full">
            <Section
              title="Book Amenities"
              description="Gym, Hall, Clubhouse bookings."
              icon={<CalendarDays />}
              variant="purple"
            />
          </Link>
          <Link href="/notice-board" className="h-full">
            <Section
              title="Notices"
              description="Read society updates and circulars."
              icon={<Clipboard />}
              variant="orange"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DashboardHouseOwner;
