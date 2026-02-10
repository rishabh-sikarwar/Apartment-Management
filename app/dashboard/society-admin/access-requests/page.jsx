"use client";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Home, Car, Bike, Check, X, Loader2 } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AccessRequests() {
  const { data, mutate, isLoading } = useSWR(
    "/api/society-admin/access-requests",
    fetcher,
  );

  const act = async (id, action) => {
    try {
      // Optimistic UI update could be done here, but mutate is safe
      await fetch("/api/society-admin/access-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      toast.success(`Request ${action.toLowerCase()}d`);
      mutate();
    } catch (e) {
      toast.error("Failed to process request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pending Access Requests
        </h1>
        <Badge variant="outline" className="px-3 py-1">
          {data?.requests?.length || 0} Pending
        </Badge>
      </div>

      {(!data?.requests || data.requests.length === 0) && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500">No pending requests at the moment.</p>
        </div>
      )}

      <div className="grid gap-4">
        {data?.requests?.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Left: User Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg text-slate-800">
                  {r.user.name || r.user.firstName || "Unknown User"}
                </span>
                <Badge
                  className={
                    r.requestedRole === "HOUSE_OWNER"
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                  }
                >
                  {r.requestedRole.replace("_", " ")}
                </Badge>
              </div>

              {/* Details Grid */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                {/* Phone */}
                {(r.phoneNumber || r.user.phoneNumber) && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.phoneNumber || r.user.phoneNumber}</span>
                  </div>
                )}

                {/* Residence (If Building/Flat info is available in response) */}
                {(r.building || r.buildingId) && (
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {r.building?.name || "Bld " + r.buildingId}
                      {r.flat
                        ? ` - ${r.flat.flatNumber}`
                        : r.flatId
                          ? ` - ${r.flatId}`
                          : ""}
                    </span>
                  </div>
                )}

                {/* Vehicles (If user has vehicles) */}
                {r.user.vehicles && r.user.vehicles.length > 0 && (
                  <div
                    className="flex items-center gap-1.5"
                    title="User's registered vehicles"
                  >
                    {r.user.vehicles.some((v) => v.type === "FOUR_WHEELER") ? (
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Bike className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>
                      {r.user.vehicles.length} Vehicle
                      {r.user.vehicles.length > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <Button
                size="sm"
                onClick={() => act(r.id, "APPROVE")}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              >
                <Check className="w-4 h-4 mr-1.5" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => act(r.id, "REJECT")}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1.5" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
