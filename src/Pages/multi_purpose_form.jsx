"use client"

import { useState } from "react"
import SolarForm from "@/components/solar-form"
import { generateDCR } from "@/lib/generate-dcr"
import { generateWCR } from "@/lib/generate-wcr"
import { generateHypothecation } from "@/lib/generate-hypothecation"
import { generateNetMeter } from "@/lib/generate-net-meter"
import { generateModelAgreement } from "@/lib/generate-modelaggrement"


export default function Multipurpose() {
  const [formData, setFormData] = useState({
    consumerName: "",
    consumerNumber: "",
    mobileNumber: "",
    email: "",
    address: "",
    reArrangementType: "Net Metering Arrangement",
    reSource: "solar",
    sanctionedCapacity: "",
    capacityType: "single phase",
    projectModel: "NA",
    installedCapacityRooftop: "",
    installedCapacityTotal: "NA",
    installedCapacityGround: "NA",
    installationDate: "",
    inverterCapacity: "",
    inverterMake: "",
    numberOfModules: "",
    moduleCapacity: "",
    category: "Private",
    warrantyDetails: "30 Years",
    sanctionNumber: "",
    moduleManufacturer: "",
    moduleWattage: "",
    moduleSerialNumbers: ["", "", "", "", "", ""],
    inverterModel: "",
    inverterRating: "5 star",
    chargeControllerType: "1mppt",
    earthingCount: "3",
    lightningArrester: "Yes",
    manufacturingYear: new Date().getFullYear().toString(),
    aadharNumber: "",
    cellManufacturer: "",
    cellGSTInvoice: "",
    cellGSTDate: "",
    installerName: "",
    installerDesignation: "",
    installerPhone: "",
    installerEmail: "",
    companyName: "",
    msedclOfficerName: "",
    msedclOfficerDesignation: "",
    msedclInspectionDate: "",
    customerSignature: "",
    vendorSignature: "",
    companyStamp: "",
    totalCost: "",
  })

  const [previewUrls, setPreviewUrls] = useState({
    dcr: null,
    wcr: null,
    hypothecation: null,
    netMeter: null,
    modelAgreement: null
  })

  const handleFormChange = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handlePreviewDCR = async (e) => {
    e.preventDefault()
    try {
      const pdfBlob = await generateDCR(formData, false)
      const url = URL.createObjectURL(pdfBlob)
      setPreviewUrls(prev => ({ ...prev, dcr: url }))
    } catch (error) {
      console.error('Error generating DCR preview:', error)
    }
  }

  const handlePreviewWCR = async (e) => {
    e.preventDefault()
    try {
      const pdfBlob = await generateWCR(formData, false)
      const url = URL.createObjectURL(pdfBlob)
      setPreviewUrls(prev => ({ ...prev, wcr: url }))
    } catch (error) {
      console.error('Error generating WCR preview:', error)
    }
  }

  const handlePreviewHypothecation = async (e) => {
    e.preventDefault()
    try {
      const pdfBlob = await generateHypothecation(formData, false)
      const url = URL.createObjectURL(pdfBlob)
      setPreviewUrls(prev => ({ ...prev, hypothecation: url }))
    } catch (error) {
      console.error('Error generating Hypothecation preview:', error)
    }
  }

  const handlePreviewNetMeter = async (e) => {
    e.preventDefault()
    try {
      const pdfBlob = await generateNetMeter({
        consumerName: formData.consumerName,
        consumerNumber: formData.consumerNumber,
        consumerAddress: formData.address,
        agreementDate: new Date(),
        systemCapacity: formData.sanctionedCapacity,
        distributionLicensee: "MSEDCL",
        distributionOffice: "Dhule",
        vendorName: formData.companyName,
        consumerWitness: formData.installerName,
        msedclRepresentative: formData.msedclOfficerName,
        msedclWitness: formData.msedclOfficerDesignation,
        customerSignature: formData.customerSignature,
        vendorSignature: formData.vendorSignature,
        companyStamp: formData.companyStamp
      }, false)
      const url = URL.createObjectURL(pdfBlob)
      setPreviewUrls(prev => ({ ...prev, netMeter: url }))
    } catch (error) {
      console.error('Error generating Net Meter preview:', error)
    }
  }

  const handlePreviewModelAgreement = async (e) => {
    e.preventDefault()
    try {
      const pdfBlob = await generateModelAgreement(formData, false)
      const url = URL.createObjectURL(pdfBlob)
      setPreviewUrls(prev => ({ ...prev, modelAgreement: url }))
    } catch (error) {
      console.error('Error generating Model Agreement preview:', error)
    }
  }

  const handleGenerateDCR = async (e) => {
    e.preventDefault()
    try {
      await generateDCR(formData, true)
    } catch (error) {
      console.error('Error downloading DCR:', error)
    }
  }

  const handleGenerateWCR = async (e) => {
    e.preventDefault()
    try {
      await generateWCR(formData, true)
    } catch (error) {
      console.error('Error downloading WCR:', error)
    }
  }

  const handleGenerateHypothecation = async (e) => {
    e.preventDefault()
    try {
      await generateHypothecation(formData, true)
    } catch (error) {
      console.error('Error downloading Hypothecation:', error)
    }
  }

  const handleGenerateNetMeter = async (e) => {
    e.preventDefault()
    try {
      await generateNetMeter({
        consumerName: formData.consumerName,
        consumerNumber: formData.consumerNumber,
        consumerAddress: formData.address,
        agreementDate: new Date(),
        systemCapacity: formData.sanctionedCapacity,
        distributionLicensee: "MSEDCL",
        distributionOffice: "Dhule",
        vendorName: formData.companyName,
        consumerWitness: formData.installerName,
        msedclRepresentative: formData.msedclOfficerName,
        msedclWitness: formData.msedclOfficerDesignation,
        customerSignature: formData.customerSignature,
        vendorSignature: formData.vendorSignature,
        companyStamp: formData.companyStamp
      }, true)
    } catch (error) {
      console.error('Error downloading Net Meter:', error)
    }
  }

  const handleGenerateModelAgreement = async (e) => {
    e.preventDefault()
    try {
      await generateModelAgreement(formData, true)
    } catch (error) {
      console.error('Error downloading Model Agreement:', error)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Solar Installation Document Generator</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <SolarForm formData={formData} onChange={handleFormChange} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2  gap-4">
          {/* DCR Section */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewDCR}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Preview Annuxure
              </button>
              <button
                onClick={handleGenerateDCR}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download Annuxure
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.dcr ? (
                <object
                  data={previewUrls.dcr}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview Annuxure" to see the document here
                </div>
              )}
            </div>
          </div>

          {/* WCR Section */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewWCR}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Preview WCR
              </button>
              <button
                onClick={handleGenerateWCR}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Download WCR
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.wcr ? (
                <object
                  data={previewUrls.wcr}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview WCR" to see the document here
                </div>
              )}
            </div>
          </div>

          {/* Hypothecation Section */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewHypothecation}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Preview DCR
              </button>
              <button
                onClick={handleGenerateHypothecation}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Download DCR
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.hypothecation ? (
                <object
                  data={previewUrls.hypothecation}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview DCR" to see the document here
                </div>
              )}
            </div>
          </div>

          {/* Net Meter Section */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewNetMeter}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Preview NetMeter
              </button>
              <button
                onClick={handleGenerateNetMeter}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Download NetMeter
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.netMeter ? (
                <object
                  data={previewUrls.netMeter}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview Net Meter" to see the document here
                </div>
              )}
            </div>
          </div>

          {/* Model Agreement Section */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewModelAgreement}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Preview Model Agreement
              </button>
              <button
                onClick={handleGenerateModelAgreement}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Download Model Agreement
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.modelAgreement ? (
                <object
                  data={previewUrls.modelAgreement}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview Model Agreement" to see the document here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

