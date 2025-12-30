"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, Loader2 } from "lucide-react"

export function InvoicePreview({ customerData, pdfUrl, isLoading }) {
  if (!customerData && !pdfUrl) return null

  return (
    <Card className="sticky top-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 h-fit">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-600" />
        Invoice Preview
      </h3>

      {customerData && (
        <div className="space-y-3 mb-4">
          <div className="border-b pb-3">
            <p className="text-xs text-gray-600 uppercase font-semibold">
              Selected Customer
            </p>

            {Object.entries(customerData)
              .slice(0, 4)
              .map(([key, value]) => (
                <div key={key} className="mt-2">
                  <p className="text-xs text-gray-600">{key}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {String(value)}
                  </p>
                </div>
              ))}
          </div>

          {pdfUrl && (
            <div className="pt-2">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-3">
                Status
              </p>
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <div className="h-2 w-2 rounded-full bg-green-600" />
                <p className="text-xs font-medium text-green-700">
                  Ready to Download
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {pdfUrl ? (
        <div className="space-y-2">
          <Button
            onClick={() => window.open(pdfUrl, "_blank")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Invoice
          </Button>

          <Button
            onClick={() => {
              const link = document.createElement("a")
              link.href = pdfUrl
              link.download = "invoice.pdf"
              link.click()
            }}
            variant="outline"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        </div>
      ) : null}
    </Card>
  )
}
