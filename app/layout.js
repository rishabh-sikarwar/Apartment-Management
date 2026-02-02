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
  title: "Apna Complex",
  description: "A community management platform for your apartment complex",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#1e40af"
          height={4}
          showSpinner={false}
          easing="ease-in-out"
          speed={400}
          crawl={true}
          crawlSpeed={200}
        />

        <Navbar />

        <main className="min-h-screen">{children}</main>

        {/* This handles the toasts for the entire app */}
        <Toaster position="top-center" reverseOrder={false} />

        <Footer />
      </body>
    </html>
  );
}
