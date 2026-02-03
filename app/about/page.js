"use client";

import React from "react";
import { Users, Zap, ShieldCheck, LayoutDashboard } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* --- Hero Section --- */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
            About <span className="text-blue-600">E-Partment</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one digital platform designed for smart, seamless, and
            secure society management.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* --- Mission Statement --- */}
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-200">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider text-blue-200">
            Our Mission
          </h2>
          <p className="text-2xl md:text-3xl font-medium leading-normal max-w-4xl mx-auto">
            "To simplify the everyday complexities of managing residential
            communities with intelligent tools, user-friendly solutions, and
            transparent communication."
          </p>
        </div>

        {/* --- Core Values / Features Grid --- */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <p className="text-gray-500 mt-2">
              Empowering communities with the tools they need to thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<Zap className="w-6 h-6 text-yellow-600" />}
              bgColor="bg-yellow-50"
              title="Effortless Operations"
              description="Streamline daily tasks, from maintenance requests to billing, reducing the burden of manual work."
            />
            <ValueCard
              icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
              bgColor="bg-green-50"
              title="Secure & Reliable"
              description="Built with top-tier security to ensure your data and community information remain safe and private."
            />
            <ValueCard
              icon={<Users className="w-6 h-6 text-purple-600" />}
              bgColor="bg-purple-50"
              title="Community First"
              description="Foster better engagement and transparency between residents, committee members, and staff."
            />
            <ValueCard
              icon={<LayoutDashboard className="w-6 h-6 text-blue-600" />}
              bgColor="bg-blue-50"
              title="Smart Dashboards"
              description="Intuitive real-time updates and feedback systems that make management accessible to everyone."
            />
          </div>
        </div>

        {/* --- Closing Text --- */}
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Whether you&apos;re a resident, committee member, or society
            manager,
            <span className="font-bold text-gray-900"> E-Partment</span> is
            tailored to meet your unique needs. Experience the future of society
            management, where convenience meets connectivity.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
            🚀 Building smarter communities, one society at a time.
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Value Card Component
function ValueCard({ icon, title, description, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div
        className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
