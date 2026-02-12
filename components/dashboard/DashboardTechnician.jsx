"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import { Wrench, ClipboardCheck } from "lucide-react";

export default function DashboardTechnician() {
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-1.5 bg-emerald-600 rounded-full shadow-md shadow-emerald-200"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Maintenance Ops
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Manage repairs and service requests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/maintenance" className="h-full">
            <Section
              title="Active Jobs"
              description="View and update status of assigned maintenance jobs."
              icon={<Wrench />}
              variant="emerald"
            />
          </Link>

          <Link href="/complaints" className="h-full">
            <Section
              title="Technical Complaints"
              description="Review reported issues requiring technical attention."
              icon={<ClipboardCheck />}
              variant="blue"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
