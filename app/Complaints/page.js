"use client";


import { useEffect, useState } from "react";
// 2. REMOVED: import { useUser } from "@clerk/nextjs"; <--- This was crashing your build
import { toast } from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ComplaintPage() {
  // 3. REMOVED: const { user } = useUser(); <--- This was also crashing it

  const [societyName, setSocietyName] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
  });

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        // This API call now uses your custom Cookies, not Clerk.
        const res = await fetch("/api/users/me");
        const data = await res.json();

        if (!res.ok) {
          toast.error(data?.error || "Failed to load society");
          return;
        }

        if (data?.society?.name) {
          setSocietyName(data.society.name);
        } else {
          // Optional: You can silence this if you want
          // toast.error("No society data found");
        }
      } catch {
        toast.error("Failed to load society information");
      }
    };

    fetchSociety();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading("Submitting complaint...");

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Error submitting complaint", {
          id: toastId,
        });
        return;
      }

      toast.success("Complaint filed successfully", { id: toastId });
      setForm({ title: "", description: "", type: "" });
    } catch {
      toast.error("Something went wrong. Please try again later.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl bg-gray-900 text-white border border-gray-700 shadow-2xl rounded-2xl p-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold text-center mb-4">
            {societyName || "Your Society"} – Submit a Complaint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Complaint Title</Label>
              <Input
                id="title"
                placeholder="Eg: Water Leakage"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-gray-800 text-white border-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Complaint Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select complaint type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="bg-gray-800 text-white border-gray-700"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg font-semibold rounded-md transition duration-300"
            >
              Submit Complaint
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
