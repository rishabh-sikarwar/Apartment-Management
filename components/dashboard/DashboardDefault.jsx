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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Let's Get You Started
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Choose an option below to proceed. You can either join an existing
          community or set up a new one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/join-society" className="h-full">
          <Section
            title="Join Existing Society"
            description="Find your building and request access as a Resident."
            icon={<UserPlus />}
            variant="blue"
          />
        </Link>

        <Link href="/society-admin/request" className="h-full">
          <Section
            title="Register New Society"
            description="Create a new society workspace as an Admin."
            icon={<Building2 />}
            variant="purple"
          />
        </Link>
      </div>

      {/* Only show if relevant logic applies, keeping it simple for now */}
      <div className="border-t border-gray-200 pt-10">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 text-center">
          Pending Actions
        </h3>
        <div className="max-w-md mx-auto">
          <Link href="/society-admin/payment" className="h-full">
            <Section
              title="Complete Admin Payment"
              description="Pay fee to activate your new society account."
              icon={<CreditCard />}
              variant="emerald"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
