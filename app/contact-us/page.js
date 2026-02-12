"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* --- Hero Section --- */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We are here to help. Reach out to us via phone, email, or visit our
            office for any assistance regarding your society management.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* --- Contact Info Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phone Card */}
          <ContactCard
            icon={<Phone className="w-6 h-6 text-blue-600" />}
            title="Call Us"
            content="+91-9555568955"
            subContent="Mon-Fri from 9am to 6pm"
            action="Call now"
            href="tel:+919555568955"
          />

          {/* Email Card */}
          <ContactCard
            icon={<Mail className="w-6 h-6 text-blue-600" />}
            title="Email Us"
            content="info@ewaysservices.com"
            subContent="We'll respond within 24 hours"
            action="Send email"
            href="mailto:info@ewaysservices.com"
          />

          {/* Office Card */}
          <ContactCard
            icon={<MapPin className="w-6 h-6 text-blue-600" />}
            title="Visit Us"
            content="East Delhi, India"
            subContent="F-124, E.V.Nagar, Kalyanvas"
            action="Get directions"
            href="https://maps.google.com/?q=Kalyanvas,East+Delhi"
            target="_blank"
          />
        </div>

        {/* --- Map & Detailed Address Section --- */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Address Details */}
          <div className="p-8 md:p-12 md:w-1/3 flex flex-col justify-center bg-blue-50/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" /> Headquarters
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Address
                </p>
                <p className="text-lg font-medium text-gray-900">
                  F-124, E.V.Nagar,
                  <br />
                  Kalyanvas, East Delhi,
                  <br />
                  New Delhi - 110091 (India)
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Office Hours
                </p>
                <p className="text-gray-700">Monday - Friday: 09:00 - 18:00</p>
                <p className="text-gray-700">Saturday: 10:00 - 14:00</p>
                <p className="text-red-500 font-medium">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Map */}
          <div className="md:w-2/3 h-96 md:h-auto bg-gray-200 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.679696987504!2d77.3039!3d28.6143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4cba950983b%3A0x6676067523276662!2sKalyan%20Vas%2C%20Kalyan%20Puri%2C%20New%20Delhi%2C%20Delhi%20110091!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Card Component for better code structure
function ContactCard({
  icon,
  title,
  content,
  subContent,
  action,
  href,
  target,
}) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-lg font-semibold text-gray-800">{content}</p>
      <p className="text-sm text-gray-500 mb-6">{subContent}</p>

      <a
        href={href}
        target={target}
        className="mt-auto inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
      >
        {action} <ArrowRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
}
