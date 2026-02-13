"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const [userRole, setUserRole] = useState(null);

  // Check user role to determine if we should show the "Setup Society" banner
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user?.role);
        } else {
          setUserRole("VISITOR");
        }
      } catch (error) {
        setUserRole("VISITOR");
      }
    };

    checkUserRole();
  }, []);

  return (
    <footer
      className={`bg-slate-900 text-white pt-20 relative ${userRole === "VISITOR" ? "mt-32" : "mt-0"}`}
    >
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* --- Banner CTA (Only for Visitors) --- */}
        {userRole === "VISITOR" && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl z-20">
            <div className="bg-white text-gray-900 flex flex-col md:flex-row justify-between items-center p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
              {/* Decorative Blur for visual separation */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10 transform translate-x-10 -translate-y-10"></div>

              <div className="text-center md:text-left mb-6 md:mb-0 relative z-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                  Ready to digitize your community?
                </h2>
                <p className="text-gray-500 mt-2 text-base md:text-lg">
                  Join hundreds of smart societies managing their operations
                  effortlessly.
                </p>
              </div>

              {/* ✅ Button changed to Dark Slate to contrast with previous Blue section */}
              <Link
                href="/join-society"
                className="relative z-10 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-blue-600 font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 group"
              >
                Setup Your Society
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* --- Footer Columns --- */}
        <div
          className={`grid md:grid-cols-4 gap-12 text-sm ${userRole === "VISITOR" ? "mt-16" : "mt-0"}`}
        >
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold tracking-wide text-white">
              E-PARTMENT
            </h3>
            <p className="text-gray-400 leading-relaxed text-base">
              Simplifying residential living with smart management tools.
              Secure, efficient, and community-focused solutions for modern
              living.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-blue-400">Company</h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-white hover:pl-1 transition-all"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:pl-1 transition-all"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white hover:pl-1 transition-all"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-white hover:pl-1 transition-all"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-blue-400">
              Legal & Help
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white hover:pl-1 transition-all"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white hover:pl-1 transition-all"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="hover:text-white hover:pl-1 transition-all"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & App */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-blue-400">
              Get the App
            </h4>
            <div className="flex flex-col gap-3 mb-8">
              <button className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-xl transition-colors w-max">
                <FaGooglePlay className="text-green-500 text-xl" />
                <div className="text-left">
                  <p className="text-[10px] uppercase text-gray-400 leading-none">
                    Get it on
                  </p>
                  <p className="text-sm font-bold text-white leading-none mt-1">
                    Google Play
                  </p>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-xl transition-colors w-max">
                <FaApple className="text-white text-xl" />
                <div className="text-left">
                  <p className="text-[10px] uppercase text-gray-400 leading-none">
                    Download on the
                  </p>
                  <p className="text-sm font-bold text-white leading-none mt-1">
                    App Store
                  </p>
                </div>
              </button>
            </div>

            <h4 className="font-bold text-lg mb-4 text-blue-400">Follow Us</h4>
            <div className="flex gap-4">
              <SocialIcon icon={<FaFacebookF />} href="#" />
              <SocialIcon icon={<FaTwitter />} href="#" />
              <SocialIcon icon={<FaLinkedinIn />} href="#" />
              <SocialIcon icon={<FaInstagram />} href="#" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Copyright © {new Date().getFullYear()}{" "}
            <a
              href="https://ewaysservices.com/aboutus.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Eways Services (p) Ltd.
            </a>
            {" "} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Helper Component for Social Icons
function SocialIcon({ icon, href }) {
  return (
    <a
      href={href}
      className="bg-gray-800 text-gray-400 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}
