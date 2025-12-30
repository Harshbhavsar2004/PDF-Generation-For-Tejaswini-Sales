"use client";

import { useState, useEffect } from "react";
import { CustomerSelector } from "./CustomeSelector";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function InvoiceGenerator() {
  /* ================= STATE ================= */
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);

  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ================= FETCH FILES ================= */
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("http://localhost:5000/api/data/files");
        const data = await res.json();

        if (Array.isArray(data)) setFiles(data);
        else if (Array.isArray(data.files)) setFiles(data.files);
        else setFiles([]);
      } catch {
        setFiles([]);
      }
    }
    fetchFiles();
  }, []);

  /* ================= FETCH CUSTOMERS ================= */
  useEffect(() => {
    if (!selectedFile) return;

    fetch(`http://localhost:5000/api/data/customers?fileTag=${selectedFile}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setSelectedCustomer("");
        setSelectedCustomerData(null);
        setInvoiceNumber("");
        setTotalCost("");
      })
      .catch(() => setError("Failed to load customers"));
  }, [selectedFile]);

  /* ================= CUSTOMER SELECT ================= */
  const handleCustomerSelect = (name, data) => {
    setSelectedCustomer(name);
    setSelectedCustomerData(data);

    // 👇 IMPORTANT: invoice number from DB
    setInvoiceNumber(data?.invoiceNumber || "");
    setTotalCost(data?.totalCost || "");

    setError("");
    setSuccess(false);
  };

  const isInvoiceAlreadyGenerated = Boolean(invoiceNumber);

  /* ================= MAP DB → INVOICE ================= */
function mapDbRowToInvoice(row, customerName) {
  if (!row) return null;

  const serialNumbers =
    row["PV Module Serial No"]?.split(",").map((s) => s.trim()) || [];

  return {
    invoiceNo: invoiceNumber,
    date: row["Inspection Date"],

    customerName,
    ConsumberNo: row["Consumer Number"] || "N/A",
    customerAddress: row["Consumer Address"] || "N/A",

    items: [
      {
        component: "Solar PV Modules",
        capacity: {
          text: `${row["Module Capacity (WP)"]} WATT (${row["Module Quantity"]} NOS)`,
          serials: serialNumbers,
        },
        spec: row["PV Module Make"] || "N/A",
      },
      {
        component: "Grid Tie Inverter",
        capacity: { text: `${row["Inverter Capacity (kW)"]} KW, 1 Phase` },
        spec: row["Inverter Make"] || "N/A",
      },
      {
        component: "Structure for Modules",
        capacity: { text: `For ${row["Proposed PV Capacity (kWp)"]} kWp System` },
        spec: "GI Pipe ALL (18 KG)",
      },
      {
        component: "ACDB 1 In 1 Out",
        capacity: { text: `For ${row["Proposed PV Capacity (kWp)"]} kWp System` },
        spec: "As per standard",
      },
      {
        component: "DCDB 2 In 2 Out",
        capacity: { text: `For ${row["Proposed PV Capacity (kWp)"]} kWp System` },
        spec: "As per standard",
      },
      {
        component: "Earthing Rod",
        capacity: { text: "1 Meter / 3 Nos" },
        spec: "GI Earthing with Chemical Bag",
      },
      {
        component: "Lightning Arrestor",
        capacity: { text: "Copper + SWG 10 Gauge" },
        spec: "Copper + SWG 10 Gauge",
      },
      {
        component: "Wires & Cables",
        capacity: { text: "As per designs (Polycab / RR)" },
        spec: "AC & DC Cables",
      },
      {
        component: "Generation Meter",
        capacity: { text: "For LT Connection" },
        spec: "As per standard",
      },
    ],

    total: totalCost
      ? `Rs ${Number(totalCost).toLocaleString("en-IN")}/-`
      : "",
  };
}


  const invoiceData = mapDbRowToInvoice(
    selectedCustomerData,
    selectedCustomer
  );

  /* ================= MARK DONE ================= */
  const handleMarkAsDone = async () => {
    if (!selectedCustomerData || !totalCost) {
      setError("Total cost required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/data/mark-done", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileTag: selectedFile,
          rowIndex: selectedCustomerData.rowIndex,
          invoiceDate,
          totalCost,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setInvoiceNumber(result.invoiceNumber);
      setSuccess(true);
    } catch {
      setError("Failed to mark customer as done");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">GST Invoice Generator</h1>
        <p className="text-gray-600">Generate invoices from CSV datasets</p>
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
          <span className="text-green-700">Invoice ready</span>
        </Card>
      )}

      {/* FILE SELECT */}
      <Card className="p-6">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select dataset</option>
          {files.map((f, i) => (
            <option key={i} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Card>

      {/* CUSTOMER */}
      {selectedFile && (
        <Card className="p-6">
          <CustomerSelector
            customers={customers}
            onSelectCustomer={handleCustomerSelect}
            selectedCustomer={selectedCustomer}
          />
        </Card>
      )}

      {/* INVOICE */}
      {selectedCustomer && invoiceData && (
        <Card className="p-6 space-y-4">
          {invoiceNumber && (
            <p className="text-sm">
              Invoice No:{" "}
              <span className="font-semibold text-green-700">
                {invoiceNumber}
              </span>
            </p>
          )}

          <input
            type="number"
            placeholder="Total Cost"
            disabled={false}
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            className="border rounded px-3 py-2 disabled:bg-gray-100"
          />

          {!isInvoiceAlreadyGenerated && (
            <Button
              onClick={handleMarkAsDone}
              className="w-full bg-green-600 text-white"
            >
              ✅ Mark Customer as Done
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowPreview(true)}
          >
            Preview Invoice
          </Button>

          <PDFDownloadLink
            document={<InvoicePDF invoice={invoiceData} />}
            fileName={`${invoiceData.customerName}.pdf`}
          >
            {({ loading }) => (
              <Button className="w-full bg-blue-600 text-white">
                {loading ? "Generating..." : "Download Invoice PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </Card>
      )}

      {/* PREVIEW */}
      {showPreview && invoiceData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden">
            <div className="flex justify-between px-4 py-2 border-b">
              <h2 className="font-semibold">Invoice Preview</h2>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>

            <PDFViewer width="100%" height="100%">
              <InvoicePDF invoice={invoiceData} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
}
