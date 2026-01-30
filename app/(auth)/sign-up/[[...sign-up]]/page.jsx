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
  Check,
  CheckCircle2, // New distinct icon for verified state
  Building2,
  Globe,
  AlertCircle,
} from "lucide-react";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "UAE" },
];

const SignUpPage = () => {
  const router = useRouter();

  // --- Loading States ---
  const [loading, setLoading] = useState(false); // For Register
  const [otpLoading, setOtpLoading] = useState(false); // For Sending OTP
  const [verifyingOtp, setVerifyingOtp] = useState(false); // For Verifying OTP

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpMethod, setOtpMethod] = useState("email");
  const [countryCode, setCountryCode] = useState("+91");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [shakeField, setShakeField] = useState(null);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10}$/;

  const checkStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  useEffect(() => {
    const strength = checkStrength(formData.password);
    setPasswordStrength(strength);
    const feedbackMessages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    setPasswordFeedback(feedbackMessages[strength] || "Very Weak");

    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.confirmPassword;
        return newErr;
      });
    }
  }, [formData.password, formData.confirmPassword]);

  const triggerShake = (fieldName) => {
    setShakeField(fieldName);
    setTimeout(() => setShakeField(null), 500);
  };

  const handleSendOtp = async () => {
    setErrors({});

    if (otpMethod === "email") {
      if (!formData.email.trim()) {
        triggerShake("email");
        toast.error("Email is required");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        triggerShake("email");
        setErrors({ email: "Invalid format" });
        return;
      }
    } else {
      if (!formData.phone.trim()) {
        triggerShake("phone");
        toast.error("Phone required");
        return;
      }
      if (!phoneRegex.test(formData.phone)) {
        triggerShake("phone");
        setErrors({ phone: "Must be 10 digits" });
        return;
      }
    }

    setOtpLoading(true); // START LOADING
    try {
      const identifier =
        otpMethod === "email" ? formData.email : formData.phone;
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          type: otpMethod,
          countryCode: otpMethod === "phone" ? countryCode : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) triggerShake(otpMethod);
        throw new Error(data.error);
      }

      setIsOtpSent(true);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOtpLoading(false); // STOP LOADING
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length < 6) {
      triggerShake("otp");
      toast.error("Enter 6-digit OTP");
      return;
    }

    setVerifyingOtp(true); // START LOADING
    try {
      const identifier =
        otpMethod === "email" ? formData.email : formData.phone;
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          otp: formData.otp,
          type: otpMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        triggerShake("otp");
        throw new Error(data.error);
      }

      setIsOtpVerified(true);
      toast.success("Verified Successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifyingOtp(false); // STOP LOADING
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!isOtpVerified) return toast.error("Please verify OTP first");
    if (formData.password !== formData.confirmPassword) {
      triggerShake("confirmPassword");
      return toast.error("Passwords do not match");
    }

    setLoading(true); // START LOADING
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: otpMethod === "email" ? formData.email : "",
          phone: otpMethod === "phone" ? formData.phone : "",
          password: formData.password,
          countryCode: countryCode,
          isVerified: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Account Created! Redirecting...");
      router.push("/dashboard");

      // OPTION B: If backend doesn't set cookie, force login page:
      // router.push("/sign-in");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // STOP LOADING
    }
  };

  return (
    <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[700px] border border-gray-100">
      {/* Left Visuals (Unchanged) */}
      <div className="hidden md:flex md:w-5/12 bg-blue-600 flex-col justify-center items-center p-12 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 text-center">
          <Building2 className="h-20 w-20 mb-6 mx-auto opacity-90" />
          <h2 className="text-4xl font-bold mb-4">E-Partment</h2>
          <p className="text-blue-100 text-xl">Smart Society Management.</p>
        </div>
        <div className="absolute top-10 left-10 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-base mt-2">
            Join your community today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-base font-medium text-gray-900 placeholder:text-gray-400"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Verification Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Verify via
            </label>

            {/* Toggle Buttons (Disabled if verified) */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                disabled={isOtpVerified || isOtpSent}
                onClick={() => {
                  setOtpMethod("email");
                  setIsOtpSent(false);
                  setErrors({});
                }}
                className={`flex-1 py-3 rounded-lg text-base font-medium border flex items-center justify-center gap-2 transition-all duration-200 ${
                  otpMethod === "email"
                    ? "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-200"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${isOtpVerified ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <Mail className="h-5 w-5" /> Email
              </button>
              <button
                type="button"
                disabled={isOtpVerified || isOtpSent}
                onClick={() => {
                  setOtpMethod("phone");
                  setIsOtpSent(false);
                  setErrors({});
                }}
                className={`flex-1 py-3 rounded-lg text-base font-medium border flex items-center justify-center gap-2 transition-all duration-200 ${
                  otpMethod === "phone"
                    ? "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-200"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${isOtpVerified ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <Phone className="h-5 w-5" /> Mobile
              </button>
            </div>

            {/* Input Field with Inline Action */}
            <div
              className={`relative group transition-transform ${shakeField === otpMethod ? "animate-pulse border-red-500" : ""}`}
            >
              {otpMethod === "email" ? (
                <>
                  <Mail
                    className={`absolute left-4 top-4 h-5 w-5 transition-colors ${
                      isOtpVerified
                        ? "text-green-600"
                        : errors.email
                          ? "text-red-500"
                          : "text-gray-400 group-focus-within:text-blue-600"
                    }`}
                  />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full pl-12 pr-28 py-3.5 rounded-xl border outline-none text-base font-medium transition-all ${
                      isOtpVerified
                        ? "bg-green-50 border-green-500 text-green-800 placeholder:text-green-600"
                        : errors.email
                          ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    }`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isOtpVerified || isOtpSent}
                  />
                </>
              ) : (
                <div className="flex">
                  <div className="relative">
                    <Globe className="absolute left-3 top-4 h-5 w-5 text-gray-500 z-10 pointer-events-none" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`h-full pl-10 pr-8 py-3.5 rounded-l-xl border border-r-0 outline-none text-base font-medium appearance-none ${
                        isOtpVerified
                          ? "bg-green-50 border-green-500 text-green-800"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                      disabled={isOtpVerified || isOtpSent}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative w-full">
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={10}
                      className={`w-full h-full pl-4 pr-28 rounded-r-xl border outline-none text-base font-medium transition-all ${
                        isOtpVerified
                          ? "bg-green-50 border-green-500 text-green-800 placeholder:text-green-600"
                          : errors.phone
                            ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      }`}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      disabled={isOtpVerified || isOtpSent}
                    />
                  </div>
                </div>
              )}

              {/* ACTION BUTTON (Right Side of Input) */}
              <div className="absolute right-2 top-2 bottom-2">
                {isOtpVerified ? (
                  // 1. VERIFIED STATE (Green Tick)
                  <div className="h-full px-4 flex items-center justify-center bg-green-100 text-green-700 rounded-lg font-bold text-sm gap-2 animate-in zoom-in">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Verified</span>
                  </div>
                ) : (
                  // 2. UNVERIFIED STATE (Send OTP Button)
                  !isOtpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="h-full px-4 bg-gray-900 hover:bg-black hover:scale-105 active:scale-95 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center shadow-md cursor-pointer min-w-[100px] justify-center"
                    >
                      {otpLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* OTP Input Section (Appears after Send, Disappears/Changes after Verify) */}
            {isOtpSent && !isOtpVerified && (
              <div
                className={`mt-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-blue-50 p-4 rounded-xl border border-blue-100 ${shakeField === "otp" ? "animate-pulse ring-2 ring-red-300" : ""}`}
              >
                <label className="block text-sm font-bold text-blue-800 mb-2">
                  Enter OTP sent to{" "}
                  {otpMethod === "email"
                    ? formData.email
                    : countryCode + formData.phone}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-600 outline-none text-center text-xl tracking-[0.5em] bg-white font-bold text-gray-900 disabled:opacity-50"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otp: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    disabled={verifyingOtp} // Disable while verifying
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 rounded-lg font-bold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-70 disabled:transform-none min-w-[100px] flex items-center justify-center"
                  >
                    {verifyingOtp ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-base font-medium text-gray-900 placeholder:text-gray-400 transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                Confirm
              </label>
              <div
                className={`relative group ${shakeField === "confirmPassword" ? "animate-pulse" : ""}`}
              >
                <Lock
                  className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${errors.confirmPassword ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-600"}`}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border outline-none text-base font-medium text-gray-900 placeholder:text-gray-400 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  }`}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-[24px]">
            {formData.password && (
              <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-500 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase mt-1">
                  <span
                    className={
                      errors.confirmPassword
                        ? "text-red-500"
                        : "text-transparent"
                    }
                  >
                    {errors.confirmPassword}
                  </span>
                  <span
                    className={
                      passwordStrength > 2
                        ? "text-green-600"
                        : "text-orange-500"
                    }
                  >
                    Strength: {passwordFeedback}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              !isOtpVerified ||
              loading ||
              formData.password !== formData.confirmPassword
            }
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-4 text-lg cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
