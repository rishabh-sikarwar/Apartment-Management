"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ CHANGED: Initial state is now null (all closed) instead of "general"
  const [openSectionId, setOpenSectionId] = useState(null);

  const faqSections = [
    {
      id: "general",
      title: "General FAQs",
      items: [
        {
          q: "What is the E-Partment Services?",
          a: "The E-Partment platform is an online Society Management System that helps residents, committee members, and staff manage daily operations of a housing society - including billing, complaints, communication, and visitor tracking.",
        },
        {
          q: "Who can use the system?",
          a: "Residents, society committee members, security staff, accountants, and property managers can use the system based on assigned roles and permissions.",
        },
        {
          q: "Is my data secure?",
          a: "Yes, the system uses secure servers, encrypted data transmission, and role-based access controls to ensure data privacy and protection.",
        },
        {
          q: "How can I access the system?",
          a: "You can log in through the web portal www.eways.co.in or download the mobile app (available for Android and iOS). Internet access is required.",
        },
        {
          q: "Who provides my login credentials?",
          a: "Your society administrator or system operator provides approvals based on your request. You may change the password after your first login.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Profile Management",
      items: [
        {
          q: "How can I register on the platform?",
          a: "You can register using your registered mobile number or email ID provided to the society office. An OTP verification process is usually required.",
        },
        {
          q: "How do I create or activate my account?",
          a: "1. Go to the registration page. \n2. Enter your flat number, name, and registered mobile/email. \n3. Submit the form for verification by the society admin. \n4. Once approved, you'll receive an activation link or login credentials.",
        },
        {
          q: "How can I update my profile details?",
          a: "Navigate to Profile → Edit Profile, update your personal or contact details, and click Save. Certain fields (like flat number or ownership details) may require admin approval.",
        },
        {
          q: "What should I do if I forget my password?",
          a: "Click 'Forgot Password' on the login screen. Enter your registered email or mobile number and follow the reset instructions sent to you.",
        },
      ],
    },
    {
      id: "billing",
      title: "Maintenance & Billing",
      items: [
        {
          q: "How can I view my monthly maintenance bill?",
          a: "Log in to your account, go to Billing → My Invoices, and select the billing month to view details such as amount, due date, and status.",
        },
        {
          q: "How do I pay my bill online?",
          a: "Click 'Pay Now' under the invoice section. Choose from available payment options such as UPI, net banking, debit/credit card, or wallet. A receipt is automatically generated after successful payment.",
        },
        {
          q: "Can I view past payments?",
          a: "Yes. All previous transactions are available under Billing → Payment History. You can download receipts anytime.",
        },
      ],
    },
    {
      id: "complaints",
      title: "Complaints & Service Requests",
      items: [
        {
          q: "How do I raise a complaint or maintenance request?",
          a: "Go to Complaints → New Complaint, select a category (e.g., plumbing, electrical), enter details, and submit. You'll receive a tracking number.",
        },
        {
          q: "How can I track my complaint status?",
          a: "Check Complaints → My Complaints to see if your issue is Open, In Progress, or Resolved. You will also receive updates via notifications.",
        },
        {
          q: "Can I attach photos or documents to my complaint?",
          a: "Yes, you can upload relevant images or files to help the maintenance team better understand the issue.",
        },
      ],
    },
    {
      id: "communication",
      title: "Communication & Notices",
      items: [
        {
          q: "How will I receive important society announcements?",
          a: "All announcements and notices are displayed on the Notice Board. You'll also get alerts through SMS, email, or mobile app notifications.",
        },
        {
          q: "Can I send messages to other residents or the admin?",
          a: "Yes. Use the Community Chat or Message Admin feature for direct communication. Messages are private and secure.",
        },
      ],
    },
    {
      id: "security",
      title: "Security & Visitor Management",
      items: [
        {
          q: "How is visitor entry managed in the system?",
          a: "Security staff record visitor details in the system. Residents can also pre-approve guests through the Visitor Pass (QR) feature for faster entry.",
        },
        {
          q: "Can I view my visitor history?",
          a: "Yes. Go to Visitors → My Visitors to see all your approved or logged visits.",
        },
      ],
    },
    {
      id: "amenities",
      title: "Parking & Amenities",
      items: [
        {
          q: "How can I view my parking slot details?",
          a: "Open Parking Management → My Slot to view assigned slots and any visitor parking information.",
        },
        {
          q: "How can I book amenities like clubhouse or gym?",
          a: "Navigate to Amenities → Booking, select the facility, date, and time slot, then confirm your reservation. Confirmations are visible under My Bookings.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical & Support",
      items: [
        {
          q: "What should I do if I face a technical problem?",
          a: "Click Help & Support → Raise Ticket to log your issue. Include a brief description and screenshot if possible.",
        },
        {
          q: "How do I contact support?",
          a: "You can reach the technical support team via Email: support@ewaysservices.com or Phone: +91-9555568955. (Mon-Sat, 9 AM to 6 PM).",
        },
      ],
    },
  ];

  const toggleSection = (id) => {
    setOpenSectionId(openSectionId === id ? null : id);
  };

  // Filter sections based on search
  const filteredSections = faqSections
    .map((section) => {
      // If search term is empty, return everything
      if (!searchTerm) return section;

      // Check if title matches
      const titleMatch = section.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Check if any items match
      const matchingItems = section.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      // If title matches, show all items. If items match, show only those.
      if (titleMatch) return section;
      if (matchingItems.length > 0) return { ...section, items: matchingItems };

      return null;
    })
    .filter(Boolean); // Remove nulls

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header with Search */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto mb-8 text-lg">
            Browse our frequently asked questions to find answers to common
            queries about using the platform.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
              placeholder="Search for answers (e.g., billing, password, visitor)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="space-y-4">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, idx) => {
              // Open if clicked OR if searching (to show results)
              const isOpen =
                openSectionId === section.id || searchTerm.length > 0;

              return (
                <div
                  key={section.id}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-blue-200 shadow-md ring-1 ring-blue-100"
                      : "border-slate-200 shadow-sm hover:border-blue-300"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                        {idx + 1}
                      </span>
                      <h2 className="text-lg font-bold text-slate-800">
                        {section.title}
                      </h2>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-6 pt-2 border-t border-slate-100">
                        {section.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="group">
                            <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {item.q}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
                              {item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">
                No results found for "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-blue-600 hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Contact Support Footer */}
        <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Can't find the answer you are looking for? Please chat to our
            friendly team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:support@ewaysservices.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              Email Support
            </a>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
