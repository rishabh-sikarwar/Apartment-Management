// app/staff/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function StaffHome() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get role from /api/users/me
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        } else {
          console.error("Failed role fetch: ", res.status);
        }
      } catch (err) {
        console.error("Role fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800">
        <Loader2 className="mr-2 animate-spin text-blue-500" />
        Loading staff portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        Staff Portal
      </h1>
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Staff Self-Service Features - Visible to all staff */}
        {["STAFF", "WATCHMAN", "TECHNICIAN"].includes(userRole) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-3">
              Staff Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                href="/staff/leave"
              >
                <h3 className="font-semibold text-blue-800">Apply Leave</h3>
                <p className="text-blue-600 text-sm">Submit leave applications</p>
              </Link>
              
              <Link
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                href="/staff/salary"
              >
                <h3 className="font-semibold text-blue-800">View Salary</h3>
                <p className="text-blue-600 text-sm">Download your salary slip</p>
              </Link>
              
              <Link
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                href="/staff/emergency-salary"
              >
                <h3 className="font-semibold text-blue-800">Emergency Salary Request</h3>
                <p className="text-blue-600 text-sm">Request an advance payout</p>
              </Link>
              
              <Link
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                href="/staff/view-shift-task"
              >
                <h3 className="font-semibold text-blue-800">View Shift/Task</h3>
                <p className="text-blue-600 text-sm">See today's shift & tasks</p>
              </Link>
              
              <Link
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                href="/complaints"
              >
                <h3 className="font-semibold text-blue-800">View Complaints</h3>
                <p className="text-blue-600 text-sm">View resident maintenance complaints</p>
              </Link>
              
              <Link
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                href="/resident-feedback"
              >
                <h3 className="font-semibold text-blue-800">Submit Feedback</h3>
                <p className="text-blue-600 text-sm">Provide feedback to management</p>
              </Link>
            </div>
          </div>
        )}

        {/* Watchman Specific Features */}
        {userRole === "WATCHMAN" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-green-700 border-b pb-3">
              Watchman Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                href="/watchman"
              >
                <h3 className="font-semibold text-green-800">Entry Logs</h3>
                <p className="text-green-600 text-sm">Manage entry logs and visitor records</p>
              </Link>
              
              <Link
                className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                href="/visitor"
              >
                <h3 className="font-semibold text-green-800">Visitor Log</h3>
                <p className="text-green-600 text-sm">Log and verify visitor entries</p>
              </Link>
              
              <Link
                className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                href="/vendor/register"
              >
                <h3 className="font-semibold text-green-800">Register Vendor</h3>
                <p className="text-green-600 text-sm">Register new vendors for society services</p>
              </Link>
              
              <Link
                className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                href="/vendor/scan"
              >
                <h3 className="font-semibold text-green-800">Scan Vendor QR</h3>
                <p className="text-green-600 text-sm">Scan vendor QR codes to verify identity</p>
              </Link>
            </div>
          </div>
        )}

        {/* Staff Management Features - Only for Society Admin */}
        {["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(userRole) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-red-700 border-b pb-3">
              Staff Management (Admin Only)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                href="/staff-management/add-staff"
              >
                <h3 className="font-semibold text-red-800">Add New Staff</h3>
                <p className="text-red-600 text-sm">On-board new team members</p>
              </Link>
              
              <Link
                className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                href="/staff-management/leave-requests"
              >
                <h3 className="font-semibold text-red-800">Manage Leave Requests</h3>
                <p className="text-red-600 text-sm">Approve or reject leave applications</p>
              </Link>
              
              <Link
                className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                href="/staff-management/assign-shift"
              >
                <h3 className="font-semibold text-red-800">Assign Shift</h3>
                <p className="text-red-600 text-sm">Create or modify shift schedule</p>
              </Link>
              
              <Link
                className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                href="/staff-management/assign"
              >
                <h3 className="font-semibold text-red-800">Assign Task</h3>
                <p className="text-red-600 text-sm">Allocate daily tasks to staff</p>
              </Link>
              
              <Link
                className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                href="/staff-management/upload-salary-slip"
              >
                <h3 className="font-semibold text-red-800">Upload Salary Slip</h3>
                <p className="text-red-600 text-sm">Publish salary slips for staff</p>
              </Link>
            </div>
          </div>
        )}

        {/* Access Denied Message for non-staff users */}
        {userRole && !["STAFF", "WATCHMAN", "TECHNICIAN", "SOCIETY_ADMIN", "SUPER_ADMIN"].includes(userRole) && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access the staff portal. Please contact your administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
