"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function FacilityBookingPage() {
  const router = useRouter();

  // Custom Auth State
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const [form, setForm] = useState({
    facility: "",
    startDateTime: "",
    endDateTime: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  // 1. Check Auth (Replace Clerk)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setAuthLoaded(true);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to book a facility.");
      return router.push("/sign-in");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/facilityBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility: form.facility,
          startDateTime: form.startDateTime,
          endDateTime: form.endDateTime,
          reason: form.reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("🚫 Time slot already booked!");
        } else {
          toast.error(data.error || "⚠️ Booking failed.");
        }
        return;
      }

      toast.success("✅ Facility booked successfully!");
      setForm({ facility: "", startDateTime: "", endDateTime: "", reason: "" }); // Fixed typo here
    } catch (err) {
      console.error("Client Error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!authLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl bg-white border-gray-200 shadow-xl rounded-2xl p-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl text-center font-bold text-gray-800">
            Book a Facility
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Facility */}
            <div>
              <Label htmlFor="facility">Facility</Label>
              <Select
                onValueChange={(value) => setForm({ ...form, facility: value })}
              >
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select Facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GYM">Gym</SelectItem>
                  <SelectItem value="SWIMMING_POOL">Swimming Pool</SelectItem>
                  <SelectItem value="CLUBHOUSE">Clubhouse</SelectItem>
                  <SelectItem value="BANQUET_HALL">Banquet Hall</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  id="start"
                  value={form.startDateTime}
                  onChange={(e) =>
                    setForm({ ...form, startDateTime: e.target.value })
                  }
                  required
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              {/* End */}
              <div>
                <Label htmlFor="end">End Date & Time</Label>
                <Input
                  type="datetime-local"
                  id="end"
                  value={form.endDateTime}
                  onChange={(e) =>
                    setForm({ ...form, endDateTime: e.target.value })
                  }
                  required
                  className="bg-gray-50 border-gray-300"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason / Extra info</Label>
              <textarea
                id="reason"
                rows={3}
                placeholder="Why are you booking? (optional)"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg font-semibold rounded-md transition duration-300"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Book Facility"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
