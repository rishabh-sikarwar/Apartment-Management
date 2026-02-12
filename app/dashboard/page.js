"use client";

import {
  Loader2,
  PhoneCall,
  Megaphone,
  X,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardAdmin from "../../components/dashboard/DashboardAdmin";
import DashboardSocietySecretary from "../../components/dashboard/DashboardSocietySecretary";
import DashboardHouseOwner from "../../components/dashboard/DashboardHouseOwner";
import DashboardStaff from "../../components/dashboard/DashboardStaff";
import DashboardDefault from "../../components/dashboard/DashboardDefault";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [role, setRole] = useState("VISITOR");
  const [userFirstName, setUserFirstName] = useState("");
  const [societyId, setSocietyId] = useState(null);
  const [societyName, setSocietyName] = useState("");
  const [loading, setLoading] = useState(true);

  // Notices
  const [marqueeNotices, setMarqueeNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showManageNotices, setShowManageNotices] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Failed to fetch user details");

        const data = await res.json();

        setRole(data.role);
        setUserFirstName(data.firstName || data.name || "User");
        setSocietyId(data.societyId);

        if (data.society) {
          setSocietyName(data.society.name);
        }

        setIsAdmin(
          ["SUPER_ADMIN", "SOCIETY_SECRETARY", "SOCIETY_ADMIN"].includes(
            data.role,
          ),
        );

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

  const openDeleteModal = (id) => {
    setNoticeToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/marquee", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noticeToDelete }),
      });

      if (res.ok) {
        setMarqueeNotices((prev) =>
          prev.filter((n) => n.id !== noticeToDelete),
        );
        toast.success("Notice deleted successfully");
        setDeleteModalOpen(false);
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting notice");
    } finally {
      setIsDeleting(false);
      setNoticeToDelete(null);
    }
  };

  const handlePostNotice = async (e) => {
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
      toast.success("Notice posted");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        <p className="text-slate-500 font-medium">Loading your dashboard...</p>
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

  // ✅ Prepare Content for Seamless Loop
  // If there are notices, we render them twice. If none, show placeholder.
  const noticeContent =
    marqueeNotices.length > 0
      ? marqueeNotices.map((n) => n.content).join("     •     ")
      : "No active announcements.";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 relative">
      {/* --- Top Banner Section --- */}
      <div className="bg-white border-b border-gray-200 px-6 py-10 shadow-sm">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Texts */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back,{" "}
              <span className="text-blue-600">{userFirstName}</span>
            </h1>
            <p className="text-lg text-slate-500 mt-2 font-medium">
              {societyName ? (
                <>
                  Managing operations at{" "}
                  <span className="text-slate-800 font-bold">
                    {societyName}
                  </span>
                </>
              ) : (
                "Manage your society operations seamlessly."
              )}
            </p>
          </div>

          {/* --- Unified Action Bar --- */}
          {societyId && (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                {/* 1. Notice Board Container */}
                <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl flex items-center p-1.5 shadow-sm relative overflow-hidden">
                  {/* Badge */}
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm z-20 shrink-0 relative">
                    <Megaphone className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                      Notice Board
                    </span>
                  </div>

                  {/* ✅ Seamless Marquee Content */}
                  <div className="flex-1 overflow-hidden relative h-full flex items-center mask-image-gradient">
                    {marqueeNotices.length > 0 ? (
                      <div className="flex whitespace-nowrap animate-marquee">
                        {/* Render notices TWICE to create the seamless loop */}
                        <span className="text-sm font-semibold text-blue-900 mx-4">
                          {noticeContent}
                        </span>
                        <span className="text-sm font-semibold text-blue-900 mx-4">
                          {noticeContent}
                        </span>
                        {/* Optional: Render 3rd time if text is very short to ensure fill */}
                        <span className="text-sm font-semibold text-blue-900 mx-4">
                          {noticeContent}
                        </span>
                      </div>
                    ) : (
                      <span className="text-blue-400 text-sm italic pl-4">
                        No active announcements.
                      </span>
                    )}
                  </div>

                  {/* Admin Manage Button */}
                  {isAdmin && (
                    <button
                      onClick={() => setShowManageNotices(!showManageNotices)}
                      className={`p-2 rounded-lg transition-all shrink-0 z-20 border ml-2 relative ${
                        showManageNotices
                          ? "bg-blue-200 text-blue-800 border-blue-300"
                          : "bg-white text-gray-500 border-gray-200 hover:text-blue-600 hover:border-blue-300"
                      }`}
                      title="Manage Notices"
                    >
                      {showManageNotices ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Edit3 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* 2. SOS Button */}
                <Link
                  href="/emergency-contacts"
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 shrink-0"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>SOS</span>
                </Link>
              </div>

              {/* --- Admin Notice Manager --- */}
              {isAdmin && showManageNotices && (
                <div className="mt-3 bg-white p-4 rounded-xl border border-gray-200 shadow-md animate-in slide-in-from-top-2 fade-in">
                  <form onSubmit={handlePostNotice} className="flex gap-2">
                    <input
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Type a new announcement..."
                      value={newNotice}
                      onChange={(e) => setNewNotice(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Post
                    </button>
                  </form>

                  {/* List of active notices */}
                  {marqueeNotices.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Active Notices
                      </p>
                      {marqueeNotices.map((n) => (
                        <div
                          key={n.id}
                          className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100 group hover:border-gray-300 transition-colors"
                        >
                          <span className="text-sm text-gray-700 font-medium truncate flex-1 mr-3">
                            {n.content}
                          </span>
                          <button
                            onClick={() => openDeleteModal(n.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderRoleDashboard()}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Notice?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this notice?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Updated Styles for Smooth Seamless Loop */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          } /* Move exactly 1/3rd (since we repeated 3 times) */
        }

        .animate-marquee {
          display: flex;
          min-width: 100%;
          animation: marquee 10s linear infinite; /* Adjusted speed for readability */
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Optional: Fade effect on edges */
        .mask-image-gradient {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 5%,
            black 95%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 5%,
            black 95%,
            transparent
          );
        }
      `}</style>
    </div>
  );
}
