"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadExcelPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const handleUpload = async () => {
    setError("");
    setSuccess(false);

    if (!file || !fileName) {
      setError("Please provide dataset name and CSV file");
      return;
    }

    if (!file.name.endsWith(".csv")) {
      setError("Only .csv files are allowed");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fileTag", fileName); // 🔥 dataset identifier
      formData.append("file", file);

      const res = await fetch("https://pdf-generation-for-tejaswini-sales.vercel.app/api/data/import-csv", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Failed to upload CSV data");
      }

      setSuccess(true);
      setFile(null);
      setFileName("");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Upload Excel Data</h1>
        <p className="text-gray-600">
          Upload XLSX file to database (supports multiple versions)
        </p>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200 p-4 flex gap-2">
          <AlertCircle className="text-red-600" />
          <span className="text-red-700">{error}</span>
        </Card>
      )}

      {success && (
        <Card className="bg-green-50 border-green-200 p-4 flex gap-2">
          <CheckCircle2 className="text-green-600" />
          <span className="text-green-700">File uploaded successfully</span>
        </Card>
      )}

      <Card className="p-6 space-y-4">
        {/* File Name */}
        <div>
          <label className="text-sm font-medium">File Name</label>
          <input
            type="text"
            placeholder="PM_Surya_Ghar_July_2025"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {/* File Upload */}
       <div>
  <label className="text-sm font-medium">CSV File</label>
  <div className="mt-1 flex items-center gap-2">
    <input
      type="file"
      accept=".csv"
      onChange={(e) => setFile(e.target.files[0])}
    />
    {file && (
      <span className="text-sm flex items-center gap-1">
        <FileText size={16} /> {file.name}
      </span>
    )}
  </div>
</div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white"
        >
          {loading ? "Uploading..." : "Upload XLSX to Database"}
        </Button>
      </Card>
    </div>
  );
}
