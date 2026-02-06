"use client";
import React, { useState, useEffect } from "react";
import Section from "../section";
import Link from "next/link";
import { UserPlus, Building2, CreditCard } from "lucide-react";

export default function DashboardDefault() {
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
      {/* SECTION 1: ONBOARDING */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Let's Get You Started
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Choose an option below to proceed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/join-society" className="h-full">
            <Section
              title="Join Existing Society"
              description="Find your building and request access as a Resident or Owner."
              icon={<UserPlus />}
              variant="blue"
            />
          </Link>

          <Link href="/society-admin/request" className="h-full">
            <Section
              title="Register New Society"
              description="Create a new workspace for your society as an Admin."
              icon={<Building2 />}
              variant="purple"
            />
          </Link>
        </div>
      </section>

      {/* SECTION 2: PAYMENTS & ACTIONS */}
      <section className="border-t border-gray-200 pt-12">
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800 tracking-wide uppercase">
            Pending Actions
          </h3>
          <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
        </div>

        <div className="max-w-md mx-auto">
          <Link href="/society-admin/payment" className="h-full">
            <Section
              title="Complete Admin Payment"
              description="Pay the platform fee to activate your new society account."
              icon={<CreditCard />}
              variant="emerald"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
