import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Partment",
  description: "Smart Community Management Platform for Societies",
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <NextTopLoader
          color="#2563EB" // Blue-600 matching your theme
          height={3}
          showSpinner={false}
          easing="ease-in-out"
          speed={400}
          shadow="0 0 10px #2563EB,0 0 5px #2563EB"
        />

        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">{children}</main>

          <Footer />
        </div>

        {/* Global Toaster for Notifications */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
