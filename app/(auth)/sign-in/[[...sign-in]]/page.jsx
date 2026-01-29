"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-indigo-500/10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Sign in to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email/Phone Input */}
        <div className="group">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              required
              placeholder="Email or Phone Number"
              className=" w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="relative group">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Signing In...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-indigo-600 font-bold hover:underline transition-all"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
