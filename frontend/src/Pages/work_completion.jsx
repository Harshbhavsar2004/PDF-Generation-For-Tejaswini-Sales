"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generatePDF } from "@/lib/pdf-generator"
import { Eye, Download } from "lucide-react"

export default function WorkCompletionForm() {
  const [formData, setFormData] = useState({
    consumerName: "",
    consumerAddress: "",
    consumerMobile: "",
    systemCapacity: "",
    bankName: "SBI Bank",
    bankBranch: "Pramodnagar Branch",
    bankLocation: "Dhule",
    installerName: "Tejaswini Sales",
    installerAddress: "",
    installerContact: "",
  })

  const [errors, setErrors] = useState({})
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitError, setSubmitError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.consumerName) newErrors.consumerName = "Required"
    if (!formData.consumerAddress) newErrors.consumerAddress = "Required"
    if (!formData.consumerMobile) newErrors.consumerMobile = "Required"
    if (!formData.systemCapacity) newErrors.systemCapacity = "Required"
    if (!formData.installerAddress) newErrors.installerAddress = "Required"
    if (!formData.installerContact) newErrors.installerContact = "Required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handlePreview = async () => {
    setSubmitError("")
    if (!validateForm()) {
      setSubmitError("Fill all required fields to preview")
      return
    }

    try {
      const pdfBlob = await generatePDF(formData, "workCompletion", false)
      const url = URL.createObjectURL(pdfBlob)
      setPreviewUrl(url)
    } catch {
      setSubmitError("Failed to generate preview")
    }
  }

  const handleDownload = async () => {
    setSubmitError("")
    if (!validateForm()) {
      setSubmitError("Fill all required fields to download")
      return
    }

    try {
      await generatePDF(formData, "workCompletion", true)
    } catch {
      setSubmitError("Failed to download PDF")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORM */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Work Completion Report</CardTitle>
            <CardDescription>Frontend-only PDF generator</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {submitError && (
              <div className="bg-red-100 text-red-700 p-3 rounded">
                {submitError}
              </div>
            )}

            {[
              ["consumerName", "Consumer Name"],
              ["consumerMobile", "Mobile Number"],
              ["systemCapacity", "System Capacity (KW)"],
              ["bankName", "Bank Name"],
              ["bankBranch", "Bank Branch"],
              ["bankLocation", "Bank Location"],
              ["installerName", "Installer Name"],
              ["installerContact", "Installer Contact *"],
            ].map(([name, label]) => (
              <div key={name}>
                <Label>{label}</Label>
                <Input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={errors[name] ? "border-red-500" : ""}
                />
              </div>
            ))}

            <div>
              <Label>Installation Address *</Label>
              <Textarea
                name="consumerAddress"
                value={formData.consumerAddress}
                onChange={handleChange}
                className={errors.consumerAddress ? "border-red-500" : ""}
              />
            </div>

            <div>
              <Label>Installer Address *</Label>
              <Textarea
                name="installerAddress"
                value={formData.installerAddress}
                onChange={handleChange}
                className={errors.installerAddress ? "border-red-500" : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* PREVIEW */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>

            <div className="h-[600px] border rounded">
              {previewUrl ? (
                <object
                  data={previewUrl}
                  type="application/pdf"
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click Preview to view PDF
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
