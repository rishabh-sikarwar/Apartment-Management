import Link from "next/link";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-10">
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Banner CTA */}
        <div className="bg-blue-600 text-white flex flex-col md:flex-row justify-between items-center p-6 rounded-md shadow-lg -mt-16 z-10 relative">
          <h2 className="text-xl md:text-2xl font-semibold text-center md:text-left">
            Take a giant leap towards a SMART Society!
          </h2>
          <a
            href="/society-admin/request"
            className="bg-white text-blue-700 mt-4 md:mt-0 px-6 py-3 rounded hover:bg-gray-100 font-semibold transition"
          >
            SETUP YOUR SOCIETY
          </a>
        </div>

        {/* Footer Columns */}
        <div className="grid md:grid-cols-4 gap-10 mt-12 text-sm">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-2">EWAYS</h3>
            <p className="text-gray-300">
              © 2025 - Digital Platform for Residential Communities.
              <br />
              All rights reserved.
            </p>
            <p className="text-gray-400 mt-2 text-xs">
              Built by ewaysservices Pvt. Ltd. |{" "}
              <a
                href="https://www.ewaysservices.com/"
                className="text-gray-400 hover:underline"
              >
                www.eservices.com
              </a>
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h4 className="font-bold mb-3">Further Information</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/payments" className="hover:underline">
                  Payment Guide
                </a>
              </li>
              <li>
                <a href="/sitemap" className="hover:underline">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Social & App */}
          <div>
            <h4 className="font-bold mb-3">Download the app</h4>
            <div className="flex gap-2 mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="w-28 h-auto"
              />
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="w-28 h-auto"
              />
            </div>
            <h4 className="font-bold mb-2">Follow us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-white text-blue-700 p-2 rounded-full hover:bg-gray-200"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="bg-white text-blue-700 p-2 rounded-full hover:bg-gray-200"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
