"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generatePDF } from "@/lib/pdf-generator"

export default function WorkCompletionForm() {
  const [formData, setFormData] = useState({
    consumerName: "",
    consumerAddress: "",
    consumerMobile: "",
    systemCapacity: "",
    bankName: "SBI Bank",
    bankBranch: "Pramodnagar Branch",
    bankLocation: "Dhule",
    installerName: "JANHAVI ENTERPRISES DHULE",
    installerAddress: "Nakane Road - 424002, Maharashtra (MH), India",
    installerContact: "Mobile: +91 9765312906"
  })
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreview = async (e) => {
    e.preventDefault()
    try {
      const pdfBlob = await generatePDF(formData, "workCompletion", false)
      const url = URL.createObjectURL(pdfBlob)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  const handleDownload = async (e) => {
    e.preventDefault()
    try {
      await generatePDF(formData, "workCompletion", true)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Work Completion Report Generator</CardTitle>
            <CardDescription>
              Fill in the details to generate a work completion report
            </CardDescription>
          </CardHeader>
          <form>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="consumerName">Consumer Name</Label>
                  <Input
                    id="consumerName"
                    name="consumerName"
                    value={formData.consumerName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="consumerMobile">Mobile Number</Label>
                  <Input
                    id="consumerMobile"
                    name="consumerMobile"
                    value={formData.consumerMobile}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div>
                  <Label htmlFor="consumerAddress">Installation Address</Label>
                  <Textarea
                    id="consumerAddress"
                    name="consumerAddress"
                    value={formData.consumerAddress}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                  />
                </div>

                <div>
                  <Label htmlFor="systemCapacity">System Capacity (KW)</Label>
                  <Input
                    id="systemCapacity"
                    name="systemCapacity"
                    type="number"
                    value={formData.systemCapacity}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                  />
                </div>

                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. SBI Bank"
                  />
                </div>

                <div>
                  <Label htmlFor="bankBranch">Bank Branch</Label>
                  <Input
                    id="bankBranch"
                    name="bankBranch"
                    value={formData.bankBranch}
                    onChange={handleChange}
                    placeholder="e.g. Pramodnagar Branch"
                  />
                </div>

                <div>
                  <Label htmlFor="bankLocation">Bank Location</Label>
                  <Input
                    id="bankLocation"
                    name="bankLocation"
                    value={formData.bankLocation}
                    onChange={handleChange}
                    placeholder="e.g. Dhule"
                  />
                </div>

                <div>
                  <Label htmlFor="installerName">Installer Name</Label>
                  <Input
                    id="installerName"
                    name="installerName"
                    value={formData.installerName}
                    onChange={handleChange}
                    placeholder="e.g. JANHAVI ENTERPRISES DHULE"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button type="button" onClick={handlePreview}>
                Preview PDF
              </Button>
              <Button type="button" onClick={handleDownload}>
                Download PDF
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Preview Card */}
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>
          <CardContent className="h-[800px]">
            {previewUrl ? (
              <object
                data={previewUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <p>Unable to display PDF preview.</p>
              </object>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Click "Preview PDF" to see the document here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

