"use client";

import { useState, useEffect } from "react";
// ❌ REMOVED: import { useUser } from '@clerk/nextjs'

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/emergency-contacts");
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setContacts(Array.isArray(data.contacts) ? data.contacts : []);
        setUserData(data.user); // ✅ This contains your local user info
      } catch (error) {
        console.error("Fetch error:", error.message);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Check roles based on local user data
  const isAdmin =
    userData?.role === "SOCIETY_ADMIN" ||
    userData?.role === "SUPER_ADMIN" ||
    userData?.role === "SOCIETY_SECRETARY";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FIXED: Check userData instead of Clerk user
    if (!userData || !isAdmin) {
      alert("You are not authorized to add contacts");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError(
        "Please enter a valid 10-digit mobile number starting with 6-9",
      );
      return;
    }

    try {
      const res = await fetch("/api/emergency-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phoneNumber,
          email,
          designation,
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to add contact");

      const newContact = text ? JSON.parse(text) : null;
      if (newContact) {
        setContacts((prev) => [newContact, ...prev]); // Add new contact to top
        setName("");
        setPhoneNumber("");
        setEmail("");
        setDesignation("");
        setPhoneError(""); // Clear error on success
      }
    } catch (error) {
      console.error("Submit error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Emergency & Community Contacts
      </h1>

      {/* Only show form if Admin */}
      {isAdmin && (
        <div className="bg-gray-100 p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Add New Contact</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                className={`w-full p-2 border rounded ${phoneError ? "border-red-500" : ""}`}
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setPhoneNumber(value);
                    setPhoneError("");
                  }
                }}
                required
              />
              {phoneError && (
                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
              )}
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Designation (e.g. Electrician)"
              className="w-full p-2 border rounded"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Contact
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-3 text-gray-700">All Contacts</h2>
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No contacts found for your society.
          </p>
        ) : (
          <ul className="space-y-3">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
              >
                <div>
                  <p className="font-bold text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-500 font-medium">
                    {contact.designation}
                  </p>
                  <p className="text-xs text-gray-400">{contact.email}</p>
                </div>
                <div className="text-blue-600 font-mono font-medium bg-blue-50 px-3 py-1 rounded-md self-start sm:self-center">
                  {contact.phoneNumber}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
