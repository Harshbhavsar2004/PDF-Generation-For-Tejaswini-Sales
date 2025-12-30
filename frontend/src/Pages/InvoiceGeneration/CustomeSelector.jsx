"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ChevronDown, CheckCircle } from "lucide-react";

export function CustomerSelector({
  customers = [],
  onSelectCustomer,
  selectedCustomer,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  /* ================= DETECT CUSTOMER NAME FIELD ================= */
  const customerNameField = useMemo(() => {
    if (!Array.isArray(customers) || customers.length === 0) return null;

    const firstCustomer = customers.find(
      (c) => c && typeof c === "object" && Object.keys(c).length > 0
    );

    if (!firstCustomer) return null;

    const possibleFields = [
      "Consumer Name",
      "Customer Name",
      "Name",
      "CUSTOMER_NAME",
      "customer_name",
    ];

    return (
      possibleFields.find((field) => field in firstCustomer) ||
      Object.keys(firstCustomer)[0]
    );
  }, [customers]);

  /* ================= FILTER ================= */
  const filteredCustomers = useMemo(() => {
    if (!customerNameField) return [];

    return customers.filter(
      (customer) =>
        customer &&
        typeof customer === "object" &&
        String(customer[customerNameField] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm, customerNameField]);

  /* ================= SELECT ================= */
  const handleSelectCustomer = (customer) => {
    if (!customer || !customerNameField) return;

    const customerName = String(customer[customerNameField] || "");
    onSelectCustomer(customerName, customer);

    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      {/* SEARCH INPUT */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customer by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10"
          />
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {selectedCustomer && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Selected: {selectedCustomer}
            </p>
          </div>
        )}
      </div>

      {/* DROPDOWN */}
      {isOpen && filteredCustomers.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto shadow-lg">
          <div className="divide-y">
            {filteredCustomers.map((customer, idx) => {
              const isDone = customer.invoiceGenerated;
              const invoiceNo = customer.invoiceNumber;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectCustomer(customer)}
                  className={`w-full text-left px-4 py-3 transition-colors
                    ${
                      isDone
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-blue-50"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm">
                      {customer[customerNameField]}
                    </p>

                    {isDone && (
                      <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                        <CheckCircle size={14} />
                        DONE
                      </span>
                    )}
                  </div>

                  {isDone && invoiceNo && (
                    <p className="text-xs text-gray-600 mt-1">
                      Invoice No: <strong>{invoiceNo}</strong>
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* EMPTY STATE */}
      {isOpen && filteredCustomers.length === 0 && searchTerm && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 p-4 shadow-lg">
          <p className="text-sm text-gray-500 text-center">
            No customers found matching "{searchTerm}"
          </p>
        </Card>
      )}
    </div>
  );
}
