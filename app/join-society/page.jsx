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
import {
  Car,
  Bike,
  Plus,
  Trash2,
  Building,
  User,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function JoinSociety() {
  /* ─── STATE MANAGEMENT ─── */
  const [societyId, setSocietyId] = useState("");
  const [role, setRole] = useState("SOCIETY_MEMBER");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Location State
  const [buildingId, setBuildingId] = useState("");
  const [flatId, setFlatId] = useState("");

  // Vehicle State
  const [hasVehicle, setHasVehicle] = useState("no");
  const [vehicleList, setVehicleList] = useState([]);
  const [currentVehicleType, setCurrentVehicleType] = useState("TWO_WHEELER");
  const [currentVehicleNumber, setCurrentVehicleNumber] = useState("");

  const [loading, setLoading] = useState(false);

  // Dropdown Data
  const [societies, setSocieties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [flats, setFlats] = useState([]);

  /* ─── DATA FETCHING ─── */
  useEffect(() => {
    fetch("/api/public/societies")
      .then((r) => r.json())
      .then((d) => setSocieties(d.societies))
      .catch(() => toast.error("Failed to load societies"));
  }, []);

  useEffect(() => {
    if (!societyId) {
      setBuildings([]);
      setBuildingId("");
      return;
    }
    fetch(`/api/public/buildings?societyId=${societyId}`)
      .then((r) => r.json())
      .then((d) => setBuildings(d.buildings))
      .catch(() => toast.error("Failed to load buildings"));
  }, [societyId]);

  useEffect(() => {
    if (!buildingId) {
      setFlats([]);
      setFlatId("");
      return;
    }
    fetch(`/api/public/flats?buildingId=${buildingId}`)
      .then((r) => r.json())
      .then((d) => setFlats(d.flats))
      .catch(() => toast.error("Failed to load flats"));
  }, [buildingId]);

  /* ─── HANDLERS ─── */
  const handleAddVehicle = () => {
    if (!currentVehicleNumber.trim())
      return toast.error("Please enter a vehicle number");
    if (currentVehicleNumber.length < 4)
      return toast.error("Vehicle number is too short");

    const formattedNumber = currentVehicleNumber
      .toUpperCase()
      .replace(/\s/g, "");
    const exists = vehicleList.some((v) => v.number === formattedNumber);
    if (exists) return toast.error("Vehicle already added to list");

    setVehicleList((prev) => [
      ...prev,
      { type: currentVehicleType, number: formattedNumber },
    ]);
    setCurrentVehicleNumber("");
    toast.success("Vehicle added");
  };

  const handleRemoveVehicle = (index) => {
    setVehicleList((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!societyId) return toast.error("Please select a society");
    if (!phone.trim()) return toast.error("Mobile number is required");

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone))
      return toast.error("Invalid mobile number format");

    if (
      ["HOUSE_OWNER", "SOCIETY_MEMBER", "TENANT", "RESIDENT"].includes(role) &&
      !flatId
    ) {
      return toast.error("Please select your building and flat");
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
          vehicles: hasVehicle === "yes" ? vehicleList : [],
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      toast.success("Request sent! Admin approval pending.");

      // Reset
      setSocietyId("");
      setRole("SOCIETY_MEMBER");
      setPhone("");
      setBuildingId("");
      setFlatId("");
      setHasVehicle("no");
      setVehicleList([]);
    } catch (e) {
      toast.error(e.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────────── RENDER ─── */
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Join a Society
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Submit your details to the admin for approval.
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* SECTION 1: BASIC DETAILS */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Society & Role
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Select Society">
                <Select value={societyId} onValueChange={setSocietyId}>
                  <SelectTrigger className="w-full h-10 border-slate-300 focus:ring-slate-400">
                    <SelectValue placeholder="Search Society..." />
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

              <Field label="I am a...">
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full h-10 border-slate-300 focus:ring-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOUSE_OWNER">House Owner</SelectItem>
                    <SelectItem value="SOCIETY_MEMBER">
                      Society Member
                    </SelectItem>
                    <SelectItem value="TENANT">Tenant</SelectItem>
                    <SelectItem value="RESIDENT">Resident</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="TECHNICIAN">Technician</SelectItem>
                    <SelectItem value="WATCHMAN">Watchman</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Mobile Number">
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setPhone(val);
                  }}
                  placeholder="9876543210"
                  className="pl-9 h-10 border-slate-300 focus:border-primary"
                />
              </div>
            </Field>
          </section>

          <hr className="border-slate-100" />

          {/* SECTION 2: RESIDENCE */}
          {["HOUSE_OWNER", "SOCIETY_MEMBER", "TENANT", "RESIDENT"].includes(
            role,
          ) && (
            <section className="space-y-4 animate-in fade-in slide-in-from-top-1">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" /> Residence Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Building / Block">
                  <Select value={buildingId} onValueChange={setBuildingId}>
                    <SelectTrigger className="h-10 border-slate-300">
                      <SelectValue placeholder="Select Building" />
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

                <Field label="Flat Number">
                  <Select value={flatId} onValueChange={setFlatId}>
                    <SelectTrigger className="h-10 border-slate-300">
                      <SelectValue placeholder="Select Flat" />
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
            </section>
          )}

          <hr className="border-slate-100" />

          {/* SECTION 3: VEHICLES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" /> Vehicle Information
              </h2>
              <Select value={hasVehicle} onValueChange={setHasVehicle}>
                <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No Vehicles</SelectItem>
                  <SelectItem value="yes">I have Vehicles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasVehicle === "yes" && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-in fade-in zoom-in-95">
                {/* Add Vehicle Form */}
                <div className="flex flex-col md:flex-row gap-3 items-end mb-4">
                  <div className="w-full md:w-1/3 space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500">
                      Type
                    </Label>
                    <Select
                      value={currentVehicleType}
                      onValueChange={setCurrentVehicleType}
                    >
                      <SelectTrigger className="bg-white h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TWO_WHEELER">
                          Bike / Scooter
                        </SelectItem>
                        <SelectItem value="FOUR_WHEELER">Car / SUV</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/2 space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500">
                      Number Plate
                    </Label>
                    <Input
                      value={currentVehicleNumber}
                      onChange={(e) =>
                        setCurrentVehicleNumber(e.target.value.toUpperCase())
                      }
                      placeholder="MP07AB1234"
                      className="uppercase bg-white h-9"
                    />
                  </div>
                  <Button
                    onClick={handleAddVehicle}
                    size="sm"
                    className="w-full md:w-auto h-9 bg-slate-900 text-white hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>

                {/* List */}
                <div className="space-y-2">
                  {vehicleList.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 border-dashed">
                      No vehicles added yet. Use the form above.
                    </div>
                  ) : (
                    vehicleList.map((v, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md shadow-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-full ${v.type === "TWO_WHEELER" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
                          >
                            {v.type === "TWO_WHEELER" ? (
                              <Bike className="w-4 h-4" />
                            ) : (
                              <Car className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {v.number}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium capitalize">
                              {v.type.toLowerCase().replace("_", " ")}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveVehicle(i)}
                          className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <Button
              onClick={submit}
              disabled={loading}
              className="w-full h-11 text-base font-medium shadow-md transition-all hover:shadow-lg"
            >
              {loading ? "Submitting Request..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper for consistent spacing */
const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
      {label}
    </Label>
    {children}
  </div>
);
