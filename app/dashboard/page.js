"use client";

import { Loader2, PhoneCall, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardAdmin from "../../components/dashboard/DashboardAdmin";
import DashboardSocietySecretary from "../../components/dashboard/DashboardSocietySecretary";
import DashboardHouseOwner from "../../components/dashboard/DashboardHouseOwner";
import DashboardStaff from "../../components/dashboard/DashboardStaff";
import DashboardDefault from "../../components/dashboard/DashboardDefault";

export default function Dashboard() {
  const [role, setRole] = useState("VISITOR");
  const [userFirstName, setUserFirstName] = useState("");
  const [societyId, setSocietyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marqueeNotices, setMarqueeNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showManageNotices, setShowManageNotices] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Failed to fetch user details");

        const data = await res.json();
        setRole(data.role);
        setUserFirstName(data.firstName || data.name || "User");
        setIsAdmin(
          ["SUPER_ADMIN", "SOCIETY_SECRETARY", "SOCIETY_ADMIN"].includes(
            data.role,
          ),
        );
        setSocietyId(data.societyId);

        if (data.societyId) {
          const noticeRes = await fetch(
            `/api/marquee?societyId=${data.societyId}`,
          );
          const notices = await noticeRes.json();
          setMarqueeNotices(notices);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, []);

  const handleRemoveNotice = async (id) => {
    if (!confirm("Delete notice?")) return;
    try {
      const res = await fetch("/api/marquee", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setMarqueeNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert("Error deleting notice.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800 text-xl">
        Loading dashboard...
        <Loader2 className="animate-spin ml-2 text-blue-500" />
      </div>
    );
  }

  const renderRoleDashboard = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return <DashboardAdmin />;
      case "SOCIETY_SECRETARY":
      case "SOCIETY_ADMIN":
        return <DashboardSocietySecretary />;
      case "WATCHMAN":
      case "STAFF":
      case "TECHNICIAN":
        return <DashboardStaff />;
      case "HOUSE_OWNER":
      case "SOCIETY_MEMBER":
      case "TENANT":
      case "RESIDENT":
        return <DashboardHouseOwner />;
      default:
        return <DashboardDefault />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner Area */}
      <div className="bg-white border-b border-gray-200 px-4 py-10 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Welcome, <span className="text-blue-600">{userFirstName}</span>!
          </h1>
          <p className="text-lg text-gray-500">
            Manage your society operations seamlessly.
          </p>

          {/* Conditional: Only show for users in a society */}
          {societyId && (
            <>
              {/* Marquee Section */}
              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center shadow-sm max-w-3xl mx-auto">
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg mr-3 uppercase tracking-wider shadow-sm">
                  Notice
                </div>
                <div className="flex-1 overflow-hidden">
                  {marqueeNotices.length > 0 ? (
                    <marquee
                      behavior="scroll"
                      direction="left"
                      scrollamount="5"
                    >
                      <span className="text-blue-900 font-semibold text-sm">
                        {marqueeNotices.map((n) => n.content).join("  •  ")}
                      </span>
                    </marquee>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      No active notices currently.
                    </span>
                  )}
                </div>
              </div>

              {/* Emergency Button */}
              <div className="mt-6 flex justify-center">
                <Link
                  href="/emergency-contacts"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-all border border-red-200 shadow-sm hover:shadow-md"
                >
                  <PhoneCall className="w-4 h-4" /> Emergency SOS
                </Link>
              </div>

              {/* Admin Notice Controls */}
              {isAdmin && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowManageNotices(!showManageNotices)}
                    className="text-xs font-semibold text-gray-500 hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
                  >
                    {showManageNotices ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                    {showManageNotices ? "Close Manager" : "Manage Notices"}
                  </button>
                </div>
              )}

              {/* Notice Manager Dropdown */}
              {isAdmin && showManageNotices && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 max-w-2xl mx-auto text-left">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newNotice.trim()) return;
                      const res = await fetch("/api/marquee", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: newNotice, societyId }),
                      });
                      if (res.ok) {
                        const added = await res.json();
                        setMarqueeNotices((prev) => [added, ...prev]);
                        setNewNotice("");
                      }
                    }}
                    className="flex gap-2 mb-4"
                  >
                    <input
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Type a new notice..."
                      value={newNotice}
                      onChange={(e) => setNewNotice(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm"
                    >
                      Add
                    </button>
                  </form>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {marqueeNotices.map((n) => (
                      <div
                        key={n.id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 text-sm shadow-sm"
                      >
                        <span className="font-medium text-gray-700">
                          {n.content}
                        </span>
                        <button
                          onClick={() => handleRemoveNotice(n.id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="w-full">{renderRoleDashboard()}</div>
    </div>
  );
}
