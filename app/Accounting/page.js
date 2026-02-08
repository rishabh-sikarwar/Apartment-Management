"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // ✅ Import React Hot Toast
import {
  BarChart3,
  Banknote,
  FileText,
  ClipboardList,
  PieChart,
  TrendingUp,
  Receipt,
  Loader2,
  LogOut,
} from "lucide-react";

// Recharts components
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// FORCE DYNAMIC (Important for build)
export const dynamic = "force-dynamic";

// --- Component: AddExpenseForm ---
function AddExpenseForm({ onSubmit, userEmail }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Conditional fields
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (
      !amount ||
      !category ||
      !description ||
      !transactionDate ||
      !paymentMethod
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Conditional Validation
    if (paymentMethod === "Cheque" && !chequeNumber)
      return toast.error("Please enter cheque number.");
    if (
      paymentMethod === "Bank Transfer" &&
      (!bankName || !ifscCode || !transactionId)
    )
      return toast.error("Please enter Bank Name, IFSC, and Transaction ID.");
    if (paymentMethod === "Online Payment" && !transactionId)
      return toast.error("Please enter Transaction ID.");
    if (paymentMethod === "UPI" && !upiId && !transactionId)
      return toast.error("Please enter UPI ID or Transaction ID.");

    try {
      await onSubmit({
        amount: parseFloat(amount),
        category,
        description,
        transactionDate,
        paymentMethod,
        chequeNumber,
        bankName,
        transactionId,
        ifscCode,
        upiId,
        type: "EXPENSE",
        email: userEmail,
      });

      toast.success("Expense added successfully!");

      // Reset Form
      setAmount("");
      setCategory("");
      setDescription("");
      setPaymentMethod("Cash");
      setChequeNumber("");
      setBankName("");
      setTransactionId("");
      setIfscCode("");
      setUpiId("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          placeholder="e.g. 1500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          placeholder="e.g. Repairs"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
          <option value="Online Payment">Online Payment</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {/* Conditional Inputs */}
      {paymentMethod === "Cheque" && (
        <input
          type="text"
          placeholder="Cheque Number"
          value={chequeNumber}
          onChange={(e) => setChequeNumber(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      )}
      {paymentMethod === "Bank Transfer" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      )}
      {(paymentMethod === "Online Payment" || paymentMethod === "UPI") && (
        <div className="space-y-2">
          {paymentMethod === "UPI" && (
            <input
              type="text"
              placeholder="UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="border p-2 rounded w-full"
            />
          )}
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          placeholder="Brief description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          rows={2}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-red-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-red-700 w-full font-medium transition-colors"
      >
        Add Expense
      </button>
    </form>
  );
}

// --- Component: AddPaymentForm ---
function AddPaymentForm({ onSubmit, userEmail }) {
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [flat, setFlat] = useState("");
  const [month, setMonth] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [description, setDescription] = useState("");

  // Conditional
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !amount ||
      !payer ||
      !flat ||
      !month ||
      !transactionDate ||
      !paymentMethod ||
      !description
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (paymentMethod === "Cheque" && !chequeNumber)
      return toast.error("Please enter Cheque Number.");
    if (
      paymentMethod === "Bank Transfer" &&
      (!bankName || !ifscCode || !transactionId)
    )
      return toast.error("Please enter Bank details.");
    if (
      (paymentMethod === "Online Payment" || paymentMethod === "UPI") &&
      !transactionId
    )
      return toast.error("Please enter Transaction ID.");

    try {
      await onSubmit({
        amount: parseFloat(amount),
        payerName: payer,
        flatNumber: flat,
        forMonth: month,
        transactionDate,
        paymentMethod,
        description,
        chequeNumber,
        bankName,
        transactionId,
        ifscCode,
        upiId,
        paidStatus: true,
        type: "INCOME",
        email: userEmail,
      });

      toast.success("Payment recorded successfully!");

      // Reset
      setAmount("");
      setPayer("");
      setFlat("");
      setDescription("");
      setChequeNumber("");
      setBankName("");
      setTransactionId("");
      setIfscCode("");
      setUpiId("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to record payment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          placeholder="e.g. 2500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payer Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flat No.
          </label>
          <input
            type="text"
            placeholder="A-101"
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <input
            type="text"
            placeholder="May 2025"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
          <option value="Online Payment">Online Payment</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {/* Conditional Fields */}
      {paymentMethod === "Cheque" && (
        <input
          type="text"
          placeholder="Cheque No."
          value={chequeNumber}
          onChange={(e) => setChequeNumber(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      )}

      {paymentMethod === "Bank Transfer" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      )}

      {(paymentMethod === "Online Payment" || paymentMethod === "UPI") && (
        <div className="space-y-2">
          {paymentMethod === "UPI" && (
            <input
              type="text"
              placeholder="UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="border p-2 rounded w-full"
            />
          )}
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          placeholder="Optional notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
          rows={2}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-green-700 w-full font-medium transition-colors"
      >
        Record Payment
      </button>
    </form>
  );
}

// --- Component: ReceiptTable ---
function ReceiptTable({ societyInfo, userRole }) {
  const [receipts, setReceipts] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [flatFilter, setFlatFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const receiptsPerPage = 6;

  const fetchReceipts = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (month) query.append("month", month);
      if (year) query.append("year", year);
      if (flatFilter) query.append("flat", flatFilter);
      if (typeFilter) query.append("type", typeFilter);

      const res = await fetch(
        `/api/accounting/approve-transaction?${query.toString()}`,
      );
      if (res.ok) {
        const data = await res.json();
        setReceipts(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      }
    } catch (e) {
      console.error("Failed to fetch receipts", e);
      toast.error("Could not load receipts.");
    }
  }, [month, year, flatFilter, typeFilter]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const download = async (payment) => {
    toast.loading("Generating Receipt...", { id: "receipt-gen" });

    const receiptNode = document.createElement("div");
    receiptNode.style.position = "absolute";
    receiptNode.style.top = "-9999px";
    receiptNode.style.padding = "24px";
    receiptNode.style.fontFamily = "Arial, sans-serif";
    receiptNode.style.width = "600px";

    receiptNode.innerHTML = `
      <div style="border:1px solid #ccc; padding: 20px;">
        <h2 style="text-align: center; color: #2563eb; margin: 0;">${societyInfo?.name || "Society Name"}</h2>
        <p style="text-align: center; margin: 0; font-size: 12px;">${societyInfo?.address || "Society Address"}</p>
        <hr style="margin: 16px 0;" />
        <p><strong>Name:</strong> ${payment.payerName || "—"}</p>
        <p><strong>Flat No.:</strong> ${payment.flatNumber || "—"}</p>
        <p><strong>Amount:</strong> ₹${payment.amount || "—"}</p>
        <p><strong>For Month:</strong> ${payment.forMonth || "—"}</p>
        <p><strong>Payment Method:</strong> ${payment.paymentMethod || "—"}</p>
        ${payment.transactionId ? `<p><strong>Transaction ID:</strong> ${payment.transactionId}</p>` : ""}
        <p style="font-size: 12px; color: gray;">Paid on: ${new Date(payment.approvedAt || payment.transactionDate).toLocaleDateString("en-IN")}</p>
        <p style="text-align: center; font-size: 12px; color: gray; margin-top: 20px;">Thank you for your payment!</p>
      </div>
    `;

    document.body.appendChild(receiptNode);

    try {
      const domtoimage = (await import("dom-to-image-more")).default;
      const { jsPDF } = await import("jspdf");
      const blob = await domtoimage.toPng(receiptNode);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(blob);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(blob, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${payment.payerName || "Unknown"}.pdf`);
      toast.success("Receipt Downloaded!", { id: "receipt-gen" });
    } catch (err) {
      console.error("PDF Error", err);
      toast.error("Failed to generate PDF", { id: "receipt-gen" });
    } finally {
      document.body.removeChild(receiptNode);
    }
  };

  const safeReceipts = Array.isArray(receipts) ? receipts : [];
  const paginatedReceipts = safeReceipts.slice(
    (currentPage - 1) * receiptsPerPage,
    currentPage * receiptsPerPage,
  );
  const totalPages = Math.ceil(safeReceipts.length / receiptsPerPage);

  // Helper for dropdowns
  const months = [...Array(12).keys()].map((i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">Payment Receipts</h2>
        <div className="flex gap-2 flex-wrap">
          <select
            onChange={(e) => setMonth(e.target.value)}
            className="border px-2 py-1 rounded text-sm bg-white"
          >
            <option value="">All Months</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setYear(e.target.value)}
            className="border px-2 py-1 rounded text-sm bg-white"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {userRole === "SOCIETY_ADMIN" && (
            <select
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border px-2 py-1 rounded text-sm bg-white"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Flat</th>
              <th className="px-3 py-2">Month</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReceipts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No receipts found.
                </td>
              </tr>
            ) : (
              paginatedReceipts.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{p.payerName}</td>
                  <td className="px-3 py-2">{p.flatNumber}</td>
                  <td className="px-3 py-2">{p.forMonth}</td>
                  <td className="px-3 py-2 font-medium">₹{p.amount}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => download(p)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Receipt className="w-4 h-4" /> Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function AccountingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [role, setRole] = useState("VISITOR");

  const [loadingData, setLoadingData] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  });
  const [societyInfo, setSocietyInfo] = useState(null);

  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);

  // 1. AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setRole(userData.role);
          // Fetch society info for receipts if available
          if (userData.societyId) {
            fetch(`/api/society/${userData.societyId}`)
              .then((r) => r.json())
              .then(setSocietyInfo)
              .catch(console.error);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setAuthLoaded(true);
      }
    };
    checkAuth();
  }, []);

  // 2. FETCH DATA
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const res = await fetch("/api/accounting/transactions");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setAllTransactions(data);

      // Process Charts
      const newMonthlyData = data.reduce((acc, t) => {
        const date = new Date(t.transactionDate);
        const key = `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
        let entry = acc.find((m) => m.name === key);
        if (!entry) {
          entry = { name: key, income: 0, expense: 0, fullDate: date };
          acc.push(entry);
        }
        if (t.type === "INCOME") entry.income += t.amount;
        else if (t.type === "EXPENSE") entry.expense += t.amount;
        return acc;
      }, []);
      newMonthlyData.sort((a, b) => a.fullDate - b.fullDate);
      setMonthlyData(newMonthlyData);

      // Process Summary (Current Month)
      const now = new Date();
      const current = data.filter((t) => {
        const d = new Date(t.transactionDate);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
      const income = current
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0);
      const expense = current
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0);
      setSummary({
        totalIncome: income,
        totalExpenses: expense,
        netBalance: income - expense,
      });
    } catch (error) {
      console.error(error);
      toast.error("Could not load financial data.");
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoaded && user) {
      fetchTransactions();
    }
  }, [authLoaded, user, fetchTransactions]);

  // 3. HANDLERS
  const handleAddPayment = async (data) => {
    try {
      const res = await fetch("/api/accounting/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) fetchTransactions();
      else throw new Error("API Error");
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleAddExpense = async (data) => {
    try {
      const res = await fetch("/api/accounting/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) fetchTransactions();
      else throw new Error("API Error");
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  // 4. LOADING STATE
  if (!authLoaded || loadingData)
    return (
      <div className="flex justify-center h-screen items-center">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );

  // 5. RESTRICTED STATE
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Access Restricted
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to manage accounting.
          </p>
          <Link
            href="/sign-in"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 font-bold shadow-lg transition-transform hover:scale-105"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  // 6. MAIN UI
  return (
    <div className="bg-gray-50 min-h-screen px-4 py-10 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              Monthly Finance Overview
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value) =>
                        `₹ ${value.toLocaleString("en-IN")}`
                      }
                      cursor={{ fill: "#f3f4f6" }}
                    />
                    <Bar
                      dataKey="income"
                      fill="#2563eb"
                      name="Income"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      fill="#f97316"
                      name="Expense"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
              Current Month Summary
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Income</span>
              <span className="text-green-600 font-bold text-xl">
                ₹ {summary.totalIncome.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Expenses</span>
              <span className="text-red-600 font-bold text-xl">
                ₹ {summary.totalExpenses.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-gray-800 font-bold text-lg">
                Net Balance
              </span>
              <span
                className={`font-extrabold text-2xl ${summary.netBalance >= 0 ? "text-blue-700" : "text-red-600"}`}
              >
                ₹ {summary.netBalance.toLocaleString("en-IN")}
              </span>
            </div>
            {/* User Info */}
            <div className="mt-4 pt-4 border-t border-dashed text-xs text-gray-400 flex justify-between">
              <span>Role: {role}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Action Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {role !== "VISITOR" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Banknote className="w-6 h-6 text-green-600" /> Record Payment
              </h3>
              <AddPaymentForm
                onSubmit={handleAddPayment}
                userEmail={user.email}
              />
            </div>
          )}
          {["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(role) && (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-red-600" /> Log Expense
              </h3>
              <AddExpenseForm
                onSubmit={handleAddExpense}
                userEmail={user.email}
              />
            </div>
          )}
        </div>

        {/* Receipts Table */}
        {role !== "VISITOR" && (
          <ReceiptTable societyInfo={societyInfo} userRole={role} />
        )}

        {/* Features Toggle (Visual Only) */}
        <div className="text-center pt-8">
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="text-blue-600 hover:underline"
          >
            {showAllFeatures
              ? "Hide Features Info"
              : "View Accounting Features Info"}
          </button>
          {showAllFeatures && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-left">
              {/* Simplified feature cards for brevity */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800">Tracking</h4>
                <p className="text-sm text-blue-600">
                  Track every rupee in and out.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800">Reconciliation</h4>
                <p className="text-sm text-green-600">
                  Match with bank statements.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800">Audits</h4>
                <p className="text-sm text-purple-600">
                  Generate reports for auditors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
