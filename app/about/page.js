"use client";

import React from "react";
import {
  Users,
  Zap,
  ShieldCheck,
  Heart,
  Target,
  Lightbulb,
} from "lucide-react";

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
            An initiative by{" "}
            <span className="font-bold text-gray-800">
              EWAYS Services Pvt. Ltd.
            </span>
            <br />
            Providing leading-edge technology solutions to help build a{" "}
            {/* FIXED: Replaced single quotes with &apos; */}
            <span className="text-blue-600 font-bold">
              &apos;NAYA BHARAT&apos;
            </span>
            .
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* --- Who We Are (Context) --- */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                EWAYS Services Private Ltd is a start-up venture driven by young
                professional minds with deep experience across business markets
                and diverse domains. We provide end-to-end technology solutions
                ranging from ERP and CRM to Digital Pathshala and Payment
                Gateways.
              </p>
              <p>
                <strong>E-Partment</strong> is our dedicated vertical for
                residential communities. We believe technology should help
                people communicate effortlessly. Our solution enables every
                individual with a dream for their own platform to realize it
                through robust website design, mobile app development, and daily
                activity management.
              </p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" /> Our Vision
            </h3>
            {/* FIXED: Replaced double quotes with &quot; */}
            <p className="text-gray-700 italic mb-6">
              &quot;To foster growth by helping organizations with
              entrepreneurial potential and realize their aspirations. To create
              sustainable long-term growth and contribute to nation
              building.&quot;
            </p>
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" /> Our Belief
            </h3>
            {/* FIXED: Replaced double quotes with &quot; */}
            <p className="text-gray-700 italic">
              &quot;We believe that the world is a better place when technology
              is used to help people and businesses communicate
              effortlessly.&quot;
            </p>
          </div>
        </div>

        {/* --- Mission Statement --- */}
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-sm font-bold mb-4 uppercase tracking-[0.3em] text-blue-200">
              Our Mission
            </h2>
            {/* FIXED: Replaced double quotes with &quot; */}
            <p className="text-3xl md:text-5xl font-extrabold leading-tight max-w-4xl mx-auto">
              &quot;Breaking Barriers, <br className="hidden md:block" />{" "}
              Building Bonds.&quot;
            </p>
            <p className="mt-6 text-blue-100 max-w-2xl mx-auto text-lg">
              We make communication easier, faster, and more reliable for
              customers, while delivering excellence and value to our partners.
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* --- Core Values Grid --- */}
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Core Values
            </h2>
            <p className="text-gray-500 mt-3">
              These values underpin our desire to create a unity of purpose and
              foster a performance-based culture that is open, innovative, and
              promotes mutual trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <ValueCard
              icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
              bgColor="bg-green-50"
              title="Integrity"
              description="Our reputation is based on fulfilling promises. We are honest, accountable, and proactive. We ensure the highest ethical standards guide our decisions and treat everyone the way we would like to be treated."
            />
            <ValueCard
              icon={<Heart className="w-6 h-6 text-red-600" />}
              bgColor="bg-red-50"
              title="Customer Focus"
              description="We listen, connect, and treat partners with dignity. By anticipating needs, we make it easy to do business with us, aiming to enrich lives and enhance business success."
            />
            <ValueCard
              icon={<Zap className="w-6 h-6 text-yellow-600" />}
              bgColor="bg-yellow-50"
              title="Challenger Spirit"
              description="When faced with challenges, we do not say 'Cannot' but ask 'Why not?'. We are tenacious, creative, and constantly look for better ways of doing business."
            />
            <ValueCard
              icon={<Users className="w-6 h-6 text-purple-600" />}
              bgColor="bg-purple-50"
              title="Teamwork"
              description="We value ideas from everyone. By communicating and sharing knowledge, we develop strong bonds. We encourage open discussion and believe all of us have a part to play."
            />
          </div>
        </div>

        {/* --- Closing Text --- */}
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Personal Excellence
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-4xl mx-auto">
            Leadership and superior performance are achieved through the pursuit
            of personal excellence. We allow every individual to grow and excel.
            Together, we celebrate our success.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <span className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold shadow-lg">
              Join us in building &apos;NAYA BHARAT&apos;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Value Card Component
function ValueCard({ icon, title, description, bgColor }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
      <div
        className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-6`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </div>
  );
}
