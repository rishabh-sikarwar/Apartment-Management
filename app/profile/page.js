"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
  });

  const fileInputRef = useRef(null);

  // Fetch Current User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: imageUrl, profileFile: file });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. If file exists, upload it first (You need an upload API for this)
      // const formData = new FormData();
      // if (user.profileFile) formData.append("file", user.profileFile);

      // 2. Update User Data
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          email: user.email,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Cover / Top Section */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative"></div>

          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center text-4xl font-bold text-indigo-300 bg-indigo-50">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.firstName?.[0]}</span>
                  )}
                </div>
                {/* Camera Icon Overlay */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-transform hover:scale-110"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-black transition-all shadow-md active:scale-95"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-medium text-gray-800"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-medium text-gray-800"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={user.email || ""}
                    onChange={handleChange}
                    // Make email read-only if it was the registration method
                    disabled={user.email && user.isVerified}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none font-medium text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none font-medium text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
