"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File } from "lucide-react"

export function FileUploadSection({ onFileUpload, isLoading }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setFileName(file.name)
      onFileUpload(file)
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      onFileUpload(file)
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-100"
            : "border-gray-300 bg-white hover:border-blue-400"
        }`}
      >
        <Upload className="h-10 w-10 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-medium text-gray-900 mb-1">
          Drag and drop your file here
        </p>
        <p className="text-xs text-gray-500 mb-3">or</p>

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={isLoading}
          className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          Browse Files
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />
      </div>

      {fileName && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <File className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {fileName}
          </span>
        </div>
      )}
    </div>
  )
}
