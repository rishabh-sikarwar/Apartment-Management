"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// 1. We move the logic into a separate "Content" component
function CheckinContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [message, setMessage] = useState("Processing...");

  useEffect(() => {
    if (!token) {
      setMessage("❌ Missing QR token.");
      return;
    }

    const checkIn = async () => {
      try {
        const res = await fetch("/api/visitor/checkin", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.success) {
          const status = data.visitor.status;
          const name = data.visitor.name;
          const time = new Date(
            status === "CHECKED_OUT"
              ? data.visitor.checkOutTime
              : data.visitor.checkInTime,
          ).toLocaleString();

          setMessage(`${data.message} for ${name} at ${time}`);
        } else {
          setMessage(`❌ ${data.message || data.error || "Check-in failed"}`);
        }
      } catch (err) {
        console.error("Check-in error:", err);
        setMessage("❌ Network error during check-in.");
      }
    };

    checkIn();
  }, [token]);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Visitor Status Update</h1>
      <p className="text-lg">{message}</p>
    </div>
  );
}

// 2. The Main Page just renders the content inside Suspense
export default function VisitorCheckinStatusPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <CheckinContent />
    </Suspense>
  );
}
