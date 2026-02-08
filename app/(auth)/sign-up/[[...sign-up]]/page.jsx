"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Building2,
  Globe,
  RefreshCw,
} from "lucide-react";

// --- STATIC DATA: Country Codes ---
const countryCodes = [
  { country: "India", code: "+91" },
  { country: "Afghanistan", code: "+93" },
  { country: "Albania", code: "+355" },
  { country: "Algeria", code: "+213" },
  { country: "American Samoa", code: "+1-684" },
  { country: "Andorra", code: "+376" },
  { country: "Angola", code: "+244" },
  { country: "Anguilla", code: "+1-264" },
  { country: "Antarctica", code: "+672" },
  { country: "Antigua and Barbuda", code: "+1-268" },
  { country: "Argentina", code: "+54" },
  { country: "Armenia", code: "+374" },
  { country: "Aruba", code: "+297" },
  { country: "Australia", code: "+61" },
  { country: "Austria", code: "+43" },
  { country: "Azerbaijan", code: "+994" },
  { country: "Bahamas", code: "+1-242" },
  { country: "Bahrain", code: "+973" },
  { country: "Bangladesh", code: "+880" },
  { country: "Barbados", code: "+1-246" },
  { country: "Belarus", code: "+375" },
  { country: "Belgium", code: "+32" },
  { country: "Belize", code: "+501" },
  { country: "Benin", code: "+229" },
  { country: "Bermuda", code: "+1-441" },
  { country: "Bhutan", code: "+975" },
  { country: "Bolivia", code: "+591" },
  { country: "Bosnia and Herzegovina", code: "+387" },
  { country: "Botswana", code: "+267" },
  { country: "Brazil", code: "+55" },
  { country: "British Indian Ocean Territory", code: "+246" },
  { country: "British Virgin Islands", code: "+1-284" },
  { country: "Brunei", code: "+673" },
  { country: "Bulgaria", code: "+359" },
  { country: "Burkina Faso", code: "+226" },
  { country: "Burundi", code: "+257" },
  { country: "Cambodia", code: "+855" },
  { country: "Cameroon", code: "+237" },
  { country: "Canada", code: "+1" },
  { country: "Cape Verde", code: "+238" },
  { country: "Cayman Islands", code: "+1-345" },
  { country: "Central African Republic", code: "+236" },
  { country: "Chad", code: "+235" },
  { country: "Chile", code: "+56" },
  { country: "China", code: "+86" },
  { country: "Christmas Island", code: "+61" },
  { country: "Cocos Islands", code: "+61" },
  { country: "Colombia", code: "+57" },
  { country: "Comoros", code: "+269" },
  { country: "Cook Islands", code: "+682" },
  { country: "Costa Rica", code: "+506" },
  { country: "Croatia", code: "+385" },
  { country: "Cuba", code: "+53" },
  { country: "Curacao", code: "+599" },
  { country: "Cyprus", code: "+357" },
  { country: "Czech Republic", code: "+420" },
  { country: "Democratic Republic of the Congo", code: "+243" },
  { country: "Denmark", code: "+45" },
  { country: "Djibouti", code: "+253" },
  { country: "Dominica", code: "+1-767" },
  { country: "Dominican Republic", code: "+1-809" },
  { country: "East Timor", code: "+670" },
  { country: "Ecuador", code: "+593" },
  { country: "Egypt", code: "+20" },
  { country: "El Salvador", code: "+503" },
  { country: "Equatorial Guinea", code: "+240" },
  { country: "Eritrea", code: "+291" },
  { country: "Estonia", code: "+372" },
  { country: "Ethiopia", code: "+251" },
  { country: "Falkland Islands", code: "+500" },
  { country: "Faroe Islands", code: "+298" },
  { country: "Fiji", code: "+679" },
  { country: "Finland", code: "+358" },
  { country: "France", code: "+33" },
  { country: "French Polynesia", code: "+689" },
  { country: "Gabon", code: "+241" },
  { country: "Gambia", code: "+220" },
  { country: "Georgia", code: "+995" },
  { country: "Germany", code: "+49" },
  { country: "Ghana", code: "+233" },
  { country: "Gibraltar", code: "+350" },
  { country: "Greece", code: "+30" },
  { country: "Greenland", code: "+299" },
  { country: "Grenada", code: "+1-473" },
  { country: "Guam", code: "+1-671" },
  { country: "Guatemala", code: "+502" },
  { country: "Guernsey", code: "+44-1481" },
  { country: "Guinea", code: "+224" },
  { country: "Guinea-Bissau", code: "+245" },
  { country: "Guyana", code: "+592" },
  { country: "Haiti", code: "+509" },
  { country: "Honduras", code: "+504" },
  { country: "Hong Kong", code: "+852" },
  { country: "Hungary", code: "+36" },
  { country: "Iceland", code: "+354" },
  { country: "Indonesia", code: "+62" },
  { country: "Iran", code: "+98" },
  { country: "Iraq", code: "+964" },
  { country: "Ireland", code: "+353" },
  { country: "Isle of Man", code: "+44-1624" },
  { country: "Israel", code: "+972" },
  { country: "Italy", code: "+39" },
  { country: "Ivory Coast", code: "+225" },
  { country: "Jamaica", code: "+1-876" },
  { country: "Japan", code: "+81" },
  { country: "Jersey", code: "+44-1534" },
  { country: "Jordan", code: "+962" },
  { country: "Kazakhstan", code: "+7" },
  { country: "Kenya", code: "+254" },
  { country: "Kiribati", code: "+686" },
  { country: "Kosovo", code: "+383" },
  { country: "Kuwait", code: "+965" },
  { country: "Kyrgyzstan", code: "+996" },
  { country: "Laos", code: "+856" },
  { country: "Latvia", code: "+371" },
  { country: "Lebanon", code: "+961" },
  { country: "Lesotho", code: "+266" },
  { country: "Liberia", code: "+231" },
  { country: "Libya", code: "+218" },
  { country: "Liechtenstein", code: "+423" },
  { country: "Lithuania", code: "+370" },
  { country: "Luxembourg", code: "+352" },
  { country: "Macau", code: "+853" },
  { country: "Macedonia", code: "+389" },
  { country: "Madagascar", code: "+261" },
  { country: "Malawi", code: "+265" },
  { country: "Malaysia", code: "+60" },
  { country: "Maldives", code: "+960" },
  { country: "Mali", code: "+223" },
  { country: "Malta", code: "+356" },
  { country: "Marshall Islands", code: "+692" },
  { country: "Mauritania", code: "+222" },
  { country: "Mauritius", code: "+230" },
  { country: "Mayotte", code: "+262" },
  { country: "Mexico", code: "+52" },
  { country: "Micronesia", code: "+691" },
  { country: "Moldova", code: "+373" },
  { country: "Monaco", code: "+377" },
  { country: "Mongolia", code: "+976" },
  { country: "Montenegro", code: "+382" },
  { country: "Montserrat", code: "+1-664" },
  { country: "Morocco", code: "+212" },
  { country: "Mozambique", code: "+258" },
  { country: "Myanmar", code: "+95" },
  { country: "Namibia", code: "+264" },
  { country: "Nauru", code: "+674" },
  { country: "Nepal", code: "+977" },
  { country: "Netherlands", code: "+31" },
  { country: "Netherlands Antilles", code: "+599" },
  { country: "New Caledonia", code: "+687" },
  { country: "New Zealand", code: "+64" },
  { country: "Nicaragua", code: "+505" },
  { country: "Niger", code: "+227" },
  { country: "Nigeria", code: "+234" },
  { country: "Niue", code: "+683" },
  { country: "North Korea", code: "+850" },
  { country: "Northern Mariana Islands", code: "+1-670" },
  { country: "Norway", code: "+47" },
  { country: "Oman", code: "+968" },
  { country: "Pakistan", code: "+92" },
  { country: "Palau", code: "+680" },
  { country: "Palestine", code: "+970" },
  { country: "Panama", code: "+507" },
  { country: "Papua New Guinea", code: "+675" },
  { country: "Paraguay", code: "+595" },
  { country: "Peru", code: "+51" },
  { country: "Philippines", code: "+63" },
  { country: "Pitcairn", code: "+64" },
  { country: "Poland", code: "+48" },
  { country: "Portugal", code: "+351" },
  { country: "Puerto Rico", code: "+1-787" },
  { country: "Qatar", code: "+974" },
  { country: "Republic of the Congo", code: "+242" },
  { country: "Reunion", code: "+262" },
  { country: "Romania", code: "+40" },
  { country: "Russia", code: "+7" },
  { country: "Rwanda", code: "+250" },
  { country: "Saint Barthelemy", code: "+590" },
  { country: "Saint Helena", code: "+290" },
  { country: "Saint Kitts and Nevis", code: "+1-869" },
  { country: "Saint Lucia", code: "+1-758" },
  { country: "Saint Martin", code: "+590" },
  { country: "Saint Pierre and Miquelon", code: "+508" },
  { country: "Saint Vincent and the Grenadines", code: "+1-784" },
  { country: "Samoa", code: "+685" },
  { country: "San Marino", code: "+378" },
  { country: "Sao Tome and Principe", code: "+239" },
  { country: "Saudi Arabia", code: "+966" },
  { country: "Senegal", code: "+221" },
  { country: "Serbia", code: "+381" },
  { country: "Seychelles", code: "+248" },
  { country: "Sierra Leone", code: "+232" },
  { country: "Singapore", code: "+65" },
  { country: "Sint Maarten", code: "+1-721" },
  { country: "Slovakia", code: "+421" },
  { country: "Slovenia", code: "+386" },
  { country: "Solomon Islands", code: "+677" },
  { country: "Somalia", code: "+252" },
  { country: "South Africa", code: "+27" },
  { country: "South Korea", code: "+82" },
  { country: "South Sudan", code: "+211" },
  { country: "Spain", code: "+34" },
  { country: "Sri Lanka", code: "+94" },
  { country: "Sudan", code: "+249" },
  { country: "Suriname", code: "+597" },
  { country: "Svalbard and Jan Mayen", code: "+47" },
  { country: "Swaziland", code: "+268" },
  { country: "Sweden", code: "+46" },
  { country: "Switzerland", code: "+41" },
  { country: "Syria", code: "+963" },
  { country: "Taiwan", code: "+886" },
  { country: "Tajikistan", code: "+992" },
  { country: "Tanzania", code: "+255" },
  { country: "Thailand", code: "+66" },
  { country: "Togo", code: "+228" },
  { country: "Tokelau", code: "+690" },
  { country: "Tonga", code: "+676" },
  { country: "Trinidad and Tobago", code: "+1-868" },
  { country: "Tunisia", code: "+216" },
  { country: "Turkey", code: "+90" },
  { country: "Turkmenistan", code: "+993" },
  { country: "Turks and Caicos Islands", code: "+1-649" },
  { country: "Tuvalu", code: "+688" },
  { country: "U.S. Virgin Islands", code: "+1-340" },
  { country: "Uganda", code: "+256" },
  { country: "Ukraine", code: "+380" },
  { country: "United Arab Emirates", code: "+971" },
  { country: "United Kingdom", code: "+44" },
  { country: "United States", code: "+1" },
  { country: "Uruguay", code: "+598" },
  { country: "Uzbekistan", code: "+998" },
  { country: "Vanuatu", code: "+678" },
  { country: "Vatican", code: "+379" },
  { country: "Venezuela", code: "+58" },
  { country: "Vietnam", code: "+84" },
  { country: "Wallis and Futuna", code: "+681" },
  { country: "Western Sahara", code: "+212" },
  { country: "Yemen", code: "+967" },
  { country: "Zambia", code: "+260" },
  { country: "Zimbabwe", code: "+263" },
];


const SignUpPage = () => {
  const router = useRouter();

  // --- States ---
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpMethod, setOtpMethod] = useState("email");
  const [countryCode, setCountryCode] = useState("+91");

  // OTP States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0); // Timer for Resend

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

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  // --- Password Strength Logic ---
  useEffect(() => {
    let score = 0;
    const pass = formData.password;
    if (pass) {
      if (pass.length >= 8) score++;
      if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
      if (/\d/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;
    }
    setPasswordStrength(score);
    const feedbackMessages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    setPasswordFeedback(feedbackMessages[score] || "Very Weak");

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

  // --- Resend Timer Logic ---
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const triggerShake = (fieldName) => {
    setShakeField(fieldName);
    setTimeout(() => setShakeField(null), 500);
  };

  const handleSendOtp = async (isResend = false) => {
    setErrors({});

    // Validation
    if (otpMethod === "email") {
      if (!formData.email.trim()) {
        triggerShake("email");
        return toast.error("Email is required");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        triggerShake("email");
        return setErrors({ email: "Invalid format" });
      }
    } else {
      if (!formData.phone.trim()) {
        triggerShake("phone");
        return toast.error("Phone required");
      }
      if (formData.phone.length < 10) {
        triggerShake("phone");
        return setErrors({ phone: "Invalid number" });
      }
    }

    setOtpLoading(true);
    try {
      const identifier =
        otpMethod === "email" ? formData.email : formData.phone;

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          type: otpMethod,
          // Send country code separately if phone
          countryCode: otpMethod === "phone" ? countryCode : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          toast.error(data.error); // Show "Please wait" error
          return;
        }
        throw new Error(data.error);
      }

      setIsOtpSent(true);
      setTimer(30); 
     toast.success(
       <div>
         <p className="font-bold">OTP Sent Successfully!</p>
         {otpMethod === "email" && (
           <p className="text-xs mt-1 opacity-90">
             If not found, please check your <b>Spam/Junk</b> folder.
           </p>
         )}
       </div>,
       { duration: 5000 }, // Show for 5 seconds so they have time to read
     );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      triggerShake("otp");
      toast.error("Please enter a complete 6-digit OTP.");
      return;
    }

    setVerifyingOtp(true);
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
        throw new Error(data.error || "Verification failed");
      }

      setIsOtpVerified(true);
      toast.success("Verified Successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!isOtpVerified) return toast.error("Please verify OTP first");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
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
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[700px] border border-gray-100">
      {/* Left Visuals */}
      <div className="hidden md:flex md:w-5/12 bg-blue-600 flex-col justify-center items-center p-12 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 text-center">
          <Building2 className="h-20 w-20 mb-6 mx-auto opacity-90" />
          <h2 className="text-4xl font-bold mb-4">E-Partment</h2>
          <p className="text-blue-100 text-xl">Smart Society Management.</p>
        </div>
        <div className="absolute top-10 left-10 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
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
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-base font-medium"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          {/* --- Unified Verification Section --- */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Verify via
            </label>

            {/* Toggle Method */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                disabled={isOtpVerified || isOtpSent}
                onClick={() => {
                  setOtpMethod("email");
                  setIsOtpSent(false);
                  setErrors({});
                }}
                className={`flex-1 py-3 rounded-lg text-base font-medium border flex items-center justify-center gap-2 transition-all ${
                  otpMethod === "email"
                    ? "bg-blue-50 border-blue-600 text-blue-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${isOtpVerified ? "opacity-50 cursor-not-allowed" : ""}`}
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
                className={`flex-1 py-3 rounded-lg text-base font-medium border flex items-center justify-center gap-2 transition-all ${
                  otpMethod === "phone"
                    ? "bg-blue-50 border-blue-600 text-blue-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${isOtpVerified ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Phone className="h-5 w-5" /> Mobile
              </button>
            </div>

            {/* Inputs based on selection */}
            <div
              className={`relative group mb-3 ${shakeField === otpMethod ? "animate-pulse" : ""}`}
            >
              {otpMethod === "email" ? (
                // EMAIL INPUT
                <>
                  <Mail
                    className={`absolute left-4 top-4 h-5 w-5 transition-colors ${isOtpVerified ? "text-green-600" : "text-gray-400"}`}
                  />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none text-base font-medium transition-all ${
                      isOtpVerified
                        ? "bg-green-50 border-green-500 text-green-800"
                        : errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-blue-600"
                    }`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isOtpVerified || isOtpSent}
                  />
                </>
              ) : (
                // PHONE INPUT (Split Layout)
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative w-full md:w-1/3">
                    <Globe className="absolute left-3 top-4 h-5 w-5 text-gray-500 pointer-events-none" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`w-full h-full pl-10 pr-4 py-3.5 rounded-xl border outline-none text-base font-medium appearance-none ${
                        isOtpVerified
                          ? "bg-green-50 border-green-500 text-green-800"
                          : "bg-white border-gray-300 focus:border-blue-600"
                      }`}
                      disabled={isOtpVerified || isOtpSent}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.country} value={c.code}>
                          {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative w-full md:w-2/3">
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={15}
                      className={`w-full h-full px-4 py-3.5 rounded-xl border outline-none text-base font-medium transition-all ${
                        isOtpVerified
                          ? "bg-green-50 border-green-500 text-green-800"
                          : errors.phone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-blue-600"
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
            </div>

            {/* UNIFIED BUTTON SECTION */}
            {isOtpVerified ? (
              <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in">
                <CheckCircle2 className="h-5 w-5" /> Verified Successfully
              </div>
            ) : !isOtpSent ? (
              // 1. Initial State: Send Button (Same look for both)
              <button
                type="button"
                onClick={() => handleSendOtp(false)}
                disabled={otpLoading}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center shadow-md"
              >
                {otpLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Send Verification Code"
                )}
              </button>
            ) : (
              // 2. Sent State: OTP Input + Verify + Resend
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-bold text-blue-800 mb-2">
                  Enter OTP sent to{" "}
                  {otpMethod === "email"
                    ? formData.email
                    : countryCode + " " + formData.phone}
                </label>

                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-600 outline-none text-center text-xl tracking-[0.5em] bg-white font-bold text-gray-900"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otp: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    disabled={verifyingOtp}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center min-w-[100px]"
                  >
                    {verifyingOtp ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>

                {/* Resend Logic with Timer */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={() => handleSendOtp(true)} // Pass true for resend
                    disabled={timer > 0 || otpLoading}
                    className={`font-semibold flex items-center gap-1 ${
                      timer > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:underline"
                    }`}
                  >
                    {otpLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <RefreshCw
                          className={`h-3 w-3 ${timer > 0 ? "" : "group-hover:rotate-180 transition-transform"}`}
                        />
                        {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                      </>
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
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-300 focus:border-blue-600 outline-none transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
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
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-3.5 h-5 w-5 ${errors.confirmPassword ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-600"}`}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border outline-none transition-all ${errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-600"}`}
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
                  className="absolute right-3 top-3.5 text-gray-400"
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

          {/* Strength Bar */}
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
                  <span className="text-red-500">{errors.confirmPassword}</span>
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

          {/* Main Register Button */}
          <button
            type="submit"
            disabled={
              !isOtpVerified ||
              loading ||
              formData.password !== formData.confirmPassword
            }
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 text-lg"
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
            className="text-blue-600 font-bold hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;