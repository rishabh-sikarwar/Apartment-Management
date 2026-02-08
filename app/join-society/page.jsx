"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Car, Bike, CheckCircle2, XCircle } from "lucide-react"; // Icons

/* ──────────────────────────────── */

export default function JoinSociety() {
  /* form state */
  const [societyId, setSocietyId] = useState("");
  const [role, setRole] = useState("SOCIETY_MEMBER");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Building/Flat
  const [buildingId, setBuildingId] = useState("");
  const [flatId, setFlatId] = useState("");

  // ✅ Vehicle State
  const [hasVehicle, setHasVehicle] = useState("no"); // 'yes' or 'no'
  const [twoWheelerCount, setTwoWheelerCount] = useState(0);
  const [fourWheelerCount, setFourWheelerCount] = useState(0);
  // Stores vehicle numbers: { "2w_0": "MP04...", "4w_0": "DL01..." }
  const [vehicleNumbers, setVehicleNumbers] = useState({});

  const [loading, setLoading] = useState(false);

  /* dropdown data */
  const [societies, setSocieties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [flats, setFlats] = useState([]);

  /* ─── load societies once ─── */
  useEffect(() => {
    fetch("/api/public/societies")
      .then((r) => r.json())
      .then((d) => setSocieties(d.societies))
      .catch(() => toast.error("Load societies failed"));
  }, []);

  /* ─── load buildings ─── */
  useEffect(() => {
    if (!societyId) {
      setBuildings([]);
      setBuildingId("");
      return;
    }
    fetch(`/api/public/buildings?societyId=${societyId}`)
      .then((r) => r.json())
      .then((d) => setBuildings(d.buildings))
      .catch(() => toast.error("Load buildings failed"));
  }, [societyId]);

  /* ─── load flats ─── */
  useEffect(() => {
    if (!buildingId) {
      setFlats([]);
      setFlatId("");
      return;
    }
    fetch(`/api/public/flats?buildingId=${buildingId}`)
      .then((r) => r.json())
      .then((d) => setFlats(d.flats))
      .catch(() => toast.error("Load flats failed"));
  }, [buildingId]);

  /* ───────────────────────────── Helper to handle vehicle inputs */
  const handleVehicleNumChange = (key, value) => {
    setVehicleNumbers((prev) => ({ ...prev, [key]: value.toUpperCase() }));
  };

  /* ───────────────────────────── submit */
  const submit = async () => {
    if (!societyId) return toast.error("Choose a society first");
    if (!phone.trim()) return toast.error("Mobile number required");

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error("Enter valid 10-digit mobile number");
    }

    if (
      ["HOUSE_OWNER", "SOCIETY_MEMBER", "TENANT", "RESIDENT"].includes(role) &&
      !flatId
    )
      return toast.error("Select building and flat");

    // ✅ Prepare Vehicle Data
    let finalVehicles = [];
    if (hasVehicle === "yes") {
      // Validate 2-Wheelers
      for (let i = 0; i < twoWheelerCount; i++) {
        const num = vehicleNumbers[`2w_${i}`];
        if (!num || num.length < 4)
          return toast.error(
            `Please enter valid number for 2-Wheeler #${i + 1}`,
          );
        finalVehicles.push({ type: "TWO_WHEELER", number: num });
      }
      // Validate 4-Wheelers
      for (let i = 0; i < fourWheelerCount; i++) {
        const num = vehicleNumbers[`4w_${i}`];
        if (!num || num.length < 4)
          return toast.error(
            `Please enter valid number for 4-Wheeler #${i + 1}`,
          );
        finalVehicles.push({ type: "FOUR_WHEELER", number: num });
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/join-society", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          societyId,
          role,
          phoneNumber: phone,
          buildingId,
          flatId,
          vehicles: finalVehicles, // Send array
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Request sent successfully!");

      // Reset Form
      setSocietyId("");
      setRole("SOCIETY_MEMBER");
      setPhone("");
      setBuildingId("");
      setFlatId("");
      setHasVehicle("no");
      setTwoWheelerCount(0);
      setFourWheelerCount(0);
      setVehicleNumbers({});
    } catch (e) {
      toast.error(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────────── UI */
  return (
    <div className="max-w-lg mx-auto space-y-6 p-4 sm:p-6 bg-white shadow-sm rounded-xl border border-gray-100">
      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
        Register in a Society
      </h1>

      {/* Society */}
      <Field label="Choose Society">
        <Select value={societyId} onValueChange={setSocietyId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {societies.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Role */}
      <Field label="Desired role">
        <Select value={role} onValueChange={(val) => setRole(val)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOUSE_OWNER">House Owner</SelectItem>
            <SelectItem value="SOCIETY_MEMBER">Society Member</SelectItem>
            <SelectItem value="TENANT">Tenant</SelectItem>
            <SelectItem value="RESIDENT">Resident</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="TECHNICIAN">Technician</SelectItem>
            <SelectItem value="WATCHMAN">Watchman</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* Phone */}
      <Field label="Mobile number">
        <Input
          type="tel"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10) {
              setPhone(value);
              setPhoneError("");
              if (value.length === 10 && !/^[6-9]/.test(value)) {
                setPhoneError("Mobile number must start with 6-9");
              }
            }
          }}
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          className={phoneError ? "border-red-500" : ""}
        />
        {phoneError && (
          <p className="text-red-500 text-xs mt-1">{phoneError}</p>
        )}
      </Field>

      {/* Building / Flat Selection */}
      {["HOUSE_OWNER", "SOCIETY_MEMBER", "TENANT", "RESIDENT"].includes(
        role,
      ) && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Building">
            <Select value={buildingId} onValueChange={setBuildingId}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Flat">
            <Select value={flatId} onValueChange={setFlatId}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {flats.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.flatNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      )}

      {/* ✅ VEHICLE INFORMATION SECTION */}
      <div className="pt-4 border-t border-gray-100">
        <Field label="Do you own vehicles?">
          <Select value={hasVehicle} onValueChange={setHasVehicle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No, I don't have vehicles</SelectItem>
              <SelectItem value="yes">Yes, I have vehicles</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {hasVehicle === "yes" && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            {/* Counts Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 flex items-center gap-1">
                  <Bike className="w-3 h-3" /> Two Wheelers
                </Label>
                <Select
                  value={String(twoWheelerCount)}
                  onValueChange={(v) => setTwoWheelerCount(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500 flex items-center gap-1">
                  <Car className="w-3 h-3" /> Four Wheelers
                </Label>
                <Select
                  value={String(fourWheelerCount)}
                  onValueChange={(v) => setFourWheelerCount(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dynamic Inputs for 2-Wheelers */}
            {twoWheelerCount > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">
                  Two Wheeler Numbers
                </p>
                {Array.from({ length: twoWheelerCount }).map((_, i) => (
                  <Input
                    key={`2w_${i}`}
                    placeholder={`e.g. MP07AB1234 (Bike ${i + 1})`}
                    value={vehicleNumbers[`2w_${i}`] || ""}
                    onChange={(e) =>
                      handleVehicleNumChange(`2w_${i}`, e.target.value)
                    }
                    className="uppercase placeholder:normal-case"
                  />
                ))}
              </div>
            )}

            {/* Dynamic Inputs for 4-Wheelers */}
            {fourWheelerCount > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">
                  Four Wheeler Numbers
                </p>
                {Array.from({ length: fourWheelerCount }).map((_, i) => (
                  <Input
                    key={`4w_${i}`}
                    placeholder={`e.g. MP07CA9999 (Car ${i + 1})`}
                    value={vehicleNumbers[`4w_${i}`] || ""}
                    onChange={(e) =>
                      handleVehicleNumChange(`4w_${i}`, e.target.value)
                    }
                    className="uppercase placeholder:normal-case"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Button onClick={submit} disabled={loading} className="w-full">
        {loading ? "Submitting Request..." : "Submit Request"}
      </Button>
    </div>
  );
}

/* helper component */
const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-semibold text-gray-700">{label}</Label>
    {children}
  </div>
);
