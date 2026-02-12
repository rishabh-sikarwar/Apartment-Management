"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Building2,
  ArrowRight,
  LogIn,
} from "lucide-react";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation state for error shake
  const [shakeField, setShakeField] = useState(false);

  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const triggerShake = () => {
    setShakeField(true);
    setTimeout(() => setShakeField(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      triggerShake();
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerShake();
        // Uses the specific error message from the backend ("Invalid credentials")
        throw new Error(
          data.error || "Login failed. Please check your details.",
        );
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      // Display the specific error in the toast
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px] border border-gray-100">
      {/* --- LEFT SIDE: Visuals --- */}
      <div className="hidden md:flex md:w-5/12 bg-blue-600 flex-col justify-center items-center p-12 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 text-center">
          <div className="bg-white/10 p-4 rounded-full inline-flex mb-6 backdrop-blur-sm">
            <LogIn className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Sign in to access your society dashboard, manage payments, and stay
            connected.
          </p>
        </div>
        {/* Decor Circles */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* --- RIGHT SIDE: Form --- */}
      <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-blue-600 md:hidden" />
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          </div>
          <p className="text-gray-500 text-base">
            Please enter your details to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Phone Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Email or Phone
            </label>
            <div
              className={`relative group ${shakeField ? "animate-pulse border-red-500" : ""}`}
            >
              <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="user@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-base font-medium text-gray-900 placeholder:text-gray-400"
                value={formData.identifier}
                onChange={(e) =>
                  setFormData({ ...formData, identifier: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Password
            </label>
            <div
              className={`relative group ${shakeField ? "animate-pulse border-red-500" : ""}`}
            >
              <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-base font-medium text-gray-900 placeholder:text-gray-400"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="text-right mt-2">
              {/* ✅ FIXED: Updated href from "#" to "/forgot-password" */}
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 text-lg cursor-pointer group"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                Sign In{" "}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-blue-600 font-bold hover:underline transition-all cursor-pointer"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
