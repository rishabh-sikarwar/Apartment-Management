"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "End-to-End Accounting",
      img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748016715/WhatsApp_Image_2025-05-23_at_21.40.22_368915a7_uhkm97.jpg",
      desc: "From billing to expenses, year-end transactions, and audit statements, get complete financial control.",
      link: "/accounting",
    },
    {
      title: "Visitor Management",
      img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748017704/WhatsApp_Image_2025-05-23_at_21.45.24_159de20f_uei3wx.jpg",
      desc: "Secure your premises by verifying every visitor directly with residents seamlessly via the app.",
      link: "/visitors", // Standardized link
    },
    {
      title: "Complaint Management",
      img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748092865/42352cec-7291-4c5b-a420-e16d62eca3b3.png",
      desc: "Log and resolve resident complaints quickly and efficiently with full transparency and tracking.",
      link: "/complaints",
    },
    {
      title: "Facility Booking",
      img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748093061/44d10ad6-5123-4ab5-a31e-b39ab914ebdf.png",
      desc: "Let residents book community facilities like clubhouses or tennis courts with real-time availability.",
      link: "/facilities",
    },
    {
      title: "Emergency Contacts",
      img: "https://res.cloudinary.com/dayrre5om/image/upload/v1748017717/WhatsApp_Image_2025-05-23_at_21.52.25_2e8d5959_mua127.jpg",
      desc: "Quickly access emergency contacts for police, fire, and medical services with just a tap.",
      link: "/emergency-contacts",
    },
    {
      title: "Document Repository",
      img: "/image.png", // Ensure this image exists in public folder
      desc: "Store, access and manage all important society documents in a secure, organized digital repository.",
      link: "/documents",
    },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-8 text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Giant leap towards a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  SMART Society
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Streamline management, enhance security, and foster a better
                community. From simplified billing to instant communication,
                E-Partment handles it all.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/sign-up"
                  className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Free Trial
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Instant
                  Setup
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Secure
                  Data
                </span>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://res.cloudinary.com/dayrre5om/image/upload/v1748156504/b4ee1d95-a7c1-42e9-9386-cd583f2b1813.png"
                  alt="Smart Society"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-bold text-lg">Connected Communities</p>
                    <p className="text-sm opacity-80">Living made simpler.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Everything you need to manage your society
            </h2>
            <p className="text-lg text-gray-500">
              Powerful features designed to reduce workload and increase
              transparency.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={feature.link} className="group block h-full">
                  <div className="h-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={feature.img}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute right-0 top-0 bg-white w-96 h-96 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute left-0 bottom-0 bg-white w-96 h-96 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your society?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Experience the first support-free application post onboarding. Get
            started in just a matter of hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/sign-up"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Register New Society
            </Link>
            <Link
              href="/contact-us"
              className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-full font-bold hover:bg-blue-800 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
