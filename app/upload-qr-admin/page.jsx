"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

/* Cloudinary upload configuration */
const CLOUD_URL = "https://api.cloudinary.com/v1_1/dayrre5om/image/upload";
const UPLOAD_PRESET = "Apartment"; // ✅ Replace with your actual preset

export default function UploadQR() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image first!");

    const toastId = toast.loading("Uploading image...");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      // Save the uploaded URL to your backend
      const save = await fetch("/api/payments/upload-qr-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.secure_url }),
      });

      if (!save.ok) throw new Error("Failed to save QR URL to backend");

      toast.success("QR uploaded and saved!", { id: toastId });
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Upload Society QR</h1>

      <Input type="file" accept="image/*" onChange={handleSelect} />

      {preview && (
        <img
          src={preview}
          alt="QR Preview"
          className="w-48 h-auto mx-auto border rounded"
        />
      )}

      <Button onClick={handleUpload} disabled={!file || loading} className="cursor-pointer">
        {loading ? "Uploading…" : "Save QR"}
      </Button>
    </div>
  );
}
