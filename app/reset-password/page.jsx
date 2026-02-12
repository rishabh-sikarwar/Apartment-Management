"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle } from "lucide-react";

// Inner component to use useSearchParams
function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate Token existence immediately
  useEffect(() => {
    if (!token) {
      toast.error("Invalid link");
      router.push("/sign-in");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Reset failed");

      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-600 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-600 outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <CheckCircle className="h-5 w-5" /> Reset Password
          </>
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 mb-8">
          Please enter your new password below.
        </p>
        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
