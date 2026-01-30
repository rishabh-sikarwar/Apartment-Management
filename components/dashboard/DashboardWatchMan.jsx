"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import { Shield, UserPlus, Truck, QrCode } from "lucide-react";

export default function DashboardWatchMan() {
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
        console.error("Error fetching role:", error);
      }
    }
    fetchUserRole();
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
      {/* 1. GATE CONTROL */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-2 bg-rose-600 rounded-full shadow-lg shadow-rose-200"></div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Gate Control
            </h3>
            <p className="text-gray-500 font-medium text-sm">
              Entry/Exit management.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/watchman" className="h-full">
            <Section
              title="Security Console"
              description="Main dashboard for logging entries and exits."
              icon={<Shield />}
              variant="rose"
            />
          </Link>

          <Link href="/visitor" className="h-full">
            <Section
              title="Visitor Logs"
              description="View history of all visitor entries."
              icon={<UserPlus />}
              variant="blue"
            />
          </Link>
        </div>
      </section>

      {/* 2. VENDOR MANAGEMENT */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-2 bg-purple-600 rounded-full shadow-lg shadow-purple-200"></div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Vendor Management
            </h3>
            <p className="text-gray-500 font-medium text-sm">
              Service providers and deliveries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/vendor/register" className="h-full">
            <Section
              title="Register Vendor"
              description="Add a new daily help or service vendor."
              icon={<Truck />}
              variant="purple"
            />
          </Link>

          <Link href="/vendor/scan" className="h-full">
            <Section
              title="Scan Vendor QR"
              description="Quickly verify vendors using their QR code."
              icon={<QrCode />}
              variant="emerald"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
