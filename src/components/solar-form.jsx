"use client"

import React from "react"

import { useState, useEffect } from "react"


export default function SolarForm({ formData, onChange }) {
  const [activeTab, setActiveTab] = useState(0)
  const [aadharPreview, setAadharPreview] = useState(null)

  // Update serial number fields when number of modules changes
  useEffect(() => {
    const numModules = Number.parseInt(formData.numberOfModules) || 0
    if (numModules > 0) {
      // Create or adjust array of serial numbers
      const currentSerials = [...formData.moduleSerialNumbers]
      const newSerials = [...currentSerials]

      // Expand array if needed
      while (newSerials.length < numModules) {
        newSerials.push("")
      }

      // Trim array if needed
      if (newSerials.length > numModules) {
        newSerials.length = numModules
      }

      if (JSON.stringify(currentSerials) !== JSON.stringify(newSerials)) {
        onChange({ moduleSerialNumbers: newSerials })
      }
    }
  }, [formData.numberOfModules])

  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const handleSerialNumberChange = (index, value) => {
    const updatedSerialNumbers = [...formData.moduleSerialNumbers]
    updatedSerialNumbers[index] = value
    onChange({ moduleSerialNumbers: updatedSerialNumbers })
  }

  const handleAadharImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        setAadharPreview(result)
        onChange({ aadharImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { name: "Basic Information", id: "basic" },
    { name: "Technical Details", id: "technical" },
    { name: "Module Information", id: "module" },
    { name: "Installer Details", id: "installer" },
    { name: "MSEDCL Details", id: "msedcl" },
    { name: "Documents & Images", id: "documents" },
  ]

  return (
    <div>
      <div className="mb-6 border-b">
        <div className="flex flex-wrap -mb-px">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`inline-block p-4 border-b-2 ${
                activeTab === index ? "border-blue-600 text-blue-600" : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Consumer Name</label>
            <input
              type="text"
              name="consumerName"
              value={formData.consumerName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Consumer Number</label>
            <input
              type="text"
              name="consumerNumber"
              value={formData.consumerNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Cost (₹)</label>
            <input
              type="text"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter total cost in rupees"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Installation Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RE Arrangement Type</label>
            <select
              name="reArrangementType"
              value={formData.reArrangementType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Net Metering Arrangement">Net Metering Arrangement</option>
              <option value="Gross Metering Arrangement">Gross Metering Arrangement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RE Source</label>
            <select
              name="reSource"
              value={formData.reSource}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sanctioned Capacity (KW)</label>
            <input
              type="text"
              name="sanctionedCapacity"
              value={formData.sanctionedCapacity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity Type</label>
            <select
              name="capacityType"
              value={formData.capacityType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="single phase">Single Phase</option>
              <option value="three phase">Three Phase</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar Number</label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Private">Private</option>
              <option value="Govt">Government</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Project Model</label>
            <input
              type="text"
              name="projectModel"
              value={formData.projectModel}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RE Installed Capacity (Rooftop) (KW)</label>
            <input
              type="text"
              name="installedCapacityRooftop"
              value={formData.installedCapacityRooftop}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RE Installed Capacity (Total) (KW)</label>
            <input
              type="text"
              name="installedCapacityTotal"
              value={formData.installedCapacityTotal}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RE Installed Capacity (Ground) (KW)</label>
            <input
              type="text"
              name="installedCapacityGround"
              value={formData.installedCapacityGround}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Installation Date</label>
            <input
              type="date"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inverter Capacity (KW)</label>
            <input
              type="text"
              name="inverterCapacity"
              value={formData.inverterCapacity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inverter Make</label>
            <input
              type="text"
              name="inverterMake"
              value={formData.inverterMake}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inverter Model</label>
            <input
              type="text"
              name="inverterModel"
              value={formData.inverterModel}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inverter Rating</label>
            <input
              type="text"
              name="inverterRating"
              value={formData.inverterRating}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Charge Controller Type</label>
            <input
              type="text"
              name="chargeControllerType"
              value={formData.chargeControllerType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Earthings</label>
            <input
              type="text"
              name="earthingCount"
              value={formData.earthingCount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lightning Arrester</label>
            <select
              name="lightningArrester"
              value={formData.lightningArrester}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Manufacturing Year</label>
            <input
              type="text"
              name="manufacturingYear"
              value={formData.manufacturingYear}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Warranty Details</label>
            <input
              type="text"
              name="warrantyDetails"
              value={formData.warrantyDetails}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sanction Number</label>
            <input
              type="text"
              name="sanctionNumber"
              value={formData.sanctionNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Number of PV Modules</label>
            <input
              type="number"
              name="numberOfModules"
              value={formData.numberOfModules}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Module Capacity (W)</label>
            <input
              type="text"
              name="moduleCapacity"
              value={formData.moduleCapacity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Module Manufacturer</label>
            <input
              type="text"
              name="moduleManufacturer"
              value={formData.moduleManufacturer}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Module Wattage</label>
            <input
              type="text"
              name="moduleWattage"
              value={formData.moduleWattage}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Module Serial Numbers</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {formData.moduleSerialNumbers.map((serial, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Serial #${index + 1}`}
                  value={serial}
                  onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cell Manufacturer</label>
            <input
              type="text"
              name="cellManufacturer"
              value={formData.cellManufacturer}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cell GST Invoice Number</label>
            <input
              type="text"
              name="cellGSTInvoice"
              value={formData.cellGSTInvoice}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cell GST Invoice Date</label>
            <input
              type="date"
              name="cellGSTDate"
              value={formData.cellGSTDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Installer Name</label>
            <input
              type="text"
              name="installerName"
              value={formData.installerName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Installer Designation</label>
            <input
              type="text"
              name="installerDesignation"
              value={formData.installerDesignation}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Installer Phone</label>
            <input
              type="text"
              name="installerPhone"
              value={formData.installerPhone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Installer Email</label>
            <input
              type="email"
              name="installerEmail"
              value={formData.installerEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      )}

      {activeTab === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">MSEDCL Officer Name</label>
            <input
              type="text"
              name="msedclOfficerName"
              value={formData.msedclOfficerName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">MSEDCL Officer Designation</label>
            <input
              type="text"
              name="msedclOfficerDesignation"
              value={formData.msedclOfficerDesignation}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">MSEDCL Inspection Date</label>
            <input
              type="date"
              name="msedclInspectionDate"
              value={formData.msedclInspectionDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      )}

      {activeTab === 5 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar Card Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAadharImageChange}
              className="w-full p-2 border rounded-md"
            />
            {aadharPreview && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <div className="border rounded-md p-2 max-w-xs">
                  <img src={aadharPreview || "/placeholder.svg"} alt="Aadhar Preview" className="max-w-full h-auto" />
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Signature</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    onChange({ customerSignature: event.target?.result})
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full p-2 border rounded-md"
            />
            {formData.customerSignature && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <div className="border rounded-md p-2 max-w-xs">
                  <img
                    src={formData.customerSignature || "/placeholder.svg"}
                    alt="Customer Signature"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Signature</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    onChange({ vendorSignature: event.target?.result })
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full p-2 border rounded-md"
            />
            {formData.vendorSignature && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <div className="border rounded-md p-2 max-w-xs">
                  <img
                    src={formData.vendorSignature || "/placeholder.svg"}
                    alt="Vendor Signature"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Stamp</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    onChange({ companyStamp: event.target?.result})
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full p-2 border rounded-md"
            />
            {formData.companyStamp && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <div className="border rounded-md p-2 max-w-xs">
                  <img
                    src={formData.companyStamp || "/placeholder.svg"}
                    alt="Company Stamp"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

