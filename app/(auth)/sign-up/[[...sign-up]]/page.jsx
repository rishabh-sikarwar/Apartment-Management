"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Password Strength State
  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 4
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Validation Errors
  const [errors, setErrors] = useState({});

  const [otpMethod, setOtpMethod] = useState("email"); // Default to email

  // 1. Password Logic: Calculate Strength
  const checkStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;

    if (pass.length >= 8) score++; // Length Check
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++; // Case Check
    if (/\d/.test(pass)) score++; // Number Check
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Special Char Check

    return score;
  };

  // 2. Real-time Validation Effect
  useEffect(() => {
    const newErrors = {};
    const strength = checkStrength(formData.password);
    setPasswordStrength(strength);

    // Set Feedback Text
    const feedbackMessages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    setPasswordFeedback(feedbackMessages[strength] || "Very Weak");

    // Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    // Password Match
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Password Minimum Requirement (Must be at least 'Fair' i.e., score >= 2)
    if (formData.password && strength < 3) {
      newErrors.password = "Password is too weak";
    }

    setErrors(newErrors);
  }, [formData]);

  // 3. Helper to get color based on strength
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final block if errors exist
    if (Object.keys(errors).length > 0 || !formData.fullName) {
      toast.error("Please fix the form errors.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          otpMethod: otpMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Signup failed");

      toast.success("Account created! Please login.");
      router.push("/sign-in");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-purple-500/10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Secure access for society members
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="relative group">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-200 focus:border-purple-500"} focus:bg-white outline-none transition-all`}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="tel"
              placeholder="Phone (10 digits)"
              maxLength={10}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border ${errors.phone ? "border-red-500" : "border-gray-200 focus:border-purple-500"} focus:bg-white outline-none transition-all`}
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        </div>
        {(errors.email || errors.phone) && (
          <p className="text-xs text-red-500 px-1">
            {errors.email || errors.phone}
          </p>
        )}

        {/* Password Field */}
        <div className="relative group">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
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

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2 px-1">
            <div className="flex justify-between text-xs font-semibold text-gray-500">
              <span>Strength:</span>
              <span
                className={`${passwordStrength > 2 ? "text-green-600" : "text-orange-500"}`}
              >
                {passwordFeedback}
              </span>
            </div>
            {/* The Bar */}
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              ></div>
            </div>
            {/* Mini Requirements Checklist */}
            <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500 mt-1">
              <span
                className={`flex items-center gap-1 ${formData.password.length >= 8 ? "text-green-600" : ""}`}
              >
                {formData.password.length >= 8 ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="h-1 w-1 bg-gray-400 rounded-full" />
                )}{" "}
                8+ Chars
              </span>
              <span
                className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? "text-green-600" : ""}`}
              >
                {/[A-Z]/.test(formData.password) ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="h-1 w-1 bg-gray-400 rounded-full" />
                )}{" "}
                Uppercase
              </span>
              <span
                className={`flex items-center gap-1 ${/\d/.test(formData.password) ? "text-green-600" : ""}`}
              >
                {/\d/.test(formData.password) ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="h-1 w-1 bg-gray-400 rounded-full" />
                )}{" "}
                Number
              </span>
              <span
                className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""}`}
              >
                {/[^A-Za-z0-9]/.test(formData.password) ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="h-1 w-1 bg-gray-400 rounded-full" />
                )}{" "}
                Special Char
              </span>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative group">
          <Lock
            className={`absolute left-3 top-3 h-5 w-5 ${errors.confirmPassword ? "text-red-400" : "text-gray-400"} group-focus-within:text-purple-500 transition-colors`}
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"} focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 px-1">{errors.confirmPassword}</p>
        )}

        {/* OTP Method Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Send OTP via:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOtpMethod("email")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                otpMethod === "email"
                  ? "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Email</span>
            </button>

            <button
              type="button"
              onClick={() => setOtpMethod("phone")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                otpMethod === "phone"
                  ? "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">Phone</span>
            </button>
          </div>

          {/* Validation Warning */}
          {otpMethod === "email" && !formData.email && (
            <p className="text-xs text-orange-500">
              Please enter an email address first.
            </p>
          )}
          {otpMethod === "phone" && !formData.phone && (
            <p className="text-xs text-orange-500">
              Please enter a phone number first.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Creating...
            </>
          ) : (
            <>
              Sign Up <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="text-purple-600 font-bold hover:underline transition-all"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
