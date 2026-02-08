"use client";

import { useEffect, useState } from "react";
// REMOVED: import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";

export default function AssignResidentPage() {
  // REMOVED: const { user } = useUser(); -> Not needed here
  const [users, setUsers] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFlat, setSelectedFlat] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/society-admin/get-user-flats");
        setUsers(res.data.users);
        setFlats(res.data.flats);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedUser || !selectedFlat || !selectedRole) {
      toast.error("Please select all fields");
      return;
    }

    try {
      await axios.post("/api/society-admin/assign-role", {
        userId: selectedUser,
        flatId: selectedFlat,
        role: selectedRole,
      });
      toast.success("Role assigned successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign role");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Assign Resident / Role</h2>

      <div className="space-y-4">
        <div>
          <Label>Select User</Label>
          <Select onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- none --" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Select Flat</Label>
          <Select onValueChange={setSelectedFlat}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- none --" />
            </SelectTrigger>
            <SelectContent>
              {flats.map((flat) => (
                <SelectItem key={flat.id} value={flat.id}>
                  {flat.flatNumber} - {flat.building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Assign Role</Label>
          <Select onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- none --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOUSE_OWNER">House Owner</SelectItem>
              <SelectItem value="SOCIETY_MEMBER">Society Member</SelectItem>
              <SelectItem value="TECHNICIAN">Technician</SelectItem>
              <SelectItem value="WATCHMAN">Watchman</SelectItem>
              <SelectItem value="STAFF">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAssign}>Assign</Button>
      </div>
    </div>
  );
}
