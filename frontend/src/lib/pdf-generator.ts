import jsPDF from "jspdf"

// Simplified FormData interface for work completion report
interface FormData {
  consumerName: string
  consumerAddress: string
  consumerMobile: string
  systemCapacity: string
  bankName: string
  bankBranch: string
  bankLocation: string
  installerName: string
  installerAddress: string
  installerContact: string
}

export const generatePDF = async (data: FormData, type: string, shouldDownload: boolean = true) => {
  const doc = new jsPDF()
  
  // Define purple theme colors
  const primaryColor = [108, 11, 169]     // #6C0BA9 - Deep purple
  const secondaryColor = [147, 112, 219]  // Medium purple
  const lightColor = [245, 240, 255]      // Very light purple background
  
  // Set default margin
  const margin = 20
  const pageWidth = doc.internal.pageSize.width
  const contentWidth = pageWidth - (margin * 2)

  // Company header with styling
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(data.installerName, pageWidth / 2, margin + 10, { align: "center" })

  // Company address
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(`Location: ${data.installerAddress}`, pageWidth / 2, margin + 18, { align: "center" })
  doc.text(`Mobile No: e${data.installerContact}`, pageWidth / 2, margin + 24, { align: "center" })

  // Decorative line
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

  // Letter address
  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text("To,", margin, margin + 40)
  doc.text(`${data.bankName},`, margin, margin + 48)
  doc.text(`${data.bankBranch},`, margin, margin + 56)
  doc.text(`${data.bankLocation}.`, margin, margin + 64)

  // Subject with styling
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("Sub: Submission of Work Completion Report and Hypothecation of Solar Rooftop System", margin, margin + 78)

  // Main content
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 60)
  doc.text("Respected Sir/Madam,", margin, margin + 90)

  // Letter body paragraphs
  const firstPara = `With reference to the above subject, I hereby confirm that we have successfully completed the installation work of a ${data.systemCapacity} KW rooftop solar system at the residence of ${data.consumerName} ${data.consumerAddress}, as per the guidelines of DISCOM under the net metering arrangement.`
  const splitFirstPara = doc.splitTextToSize(firstPara, contentWidth)
  doc.text(splitFirstPara, margin, margin + 102)

  const secondPara = `In accordance with the loan arrangement, I hereby hypothecate the installed ${data.systemCapacity} KW solar rooftop system to ${data.bankName}, ${data.bankBranch} as security for the loan sanctioned to ${data.consumerName} for this installation.`
  const splitSecondPara = doc.splitTextToSize(secondPara, contentWidth)
  doc.text(splitSecondPara, margin, margin + 126)

  doc.text("We kindly request you to release the pending payment at the earliest.", margin, margin + 145)

  // Consumer Details Table
  const tableTop = margin + 150
  const rowHeight = 12
  const colWidth = [50, contentWidth - 50]
  
  // Table header
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, tableTop, contentWidth, rowHeight, "F")
  
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Detail", margin + 5, tableTop + 8)
  doc.text("Information", margin + colWidth[0] + 5, tableTop + 8)

  // Table data
  const tableData = [
    ["Consumer Name:", data.consumerName],
    ["Consumer Number:", data.consumerMobile],
    ["System Capacity:", `${data.systemCapacity} KW`],
    ["Installation Address:", data.consumerAddress]
  ]

  doc.setFont("helvetica", "normal")
  tableData.forEach((row, index) => {
    const yPos = tableTop + ((index + 1) * rowHeight) + 8
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 255)
      doc.rect(margin, tableTop + ((index + 1) * rowHeight), contentWidth, rowHeight, "F")
    }
    doc.text(row[0], margin + 5, yPos)
    doc.text(row[1], margin + colWidth[0] + 5, yPos)
  })

  // Table border
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.setLineWidth(0.1)
  doc.rect(margin, tableTop, contentWidth, rowHeight * (tableData.length + 1))

  // Add vertical line between columns
  doc.line(
    margin + colWidth[0], 
    tableTop, 
    margin + colWidth[0], 
    tableTop + (rowHeight * (tableData.length + 1))
  )

  // Closing section
  const closingY = tableTop + (rowHeight * (tableData.length + 1)) + 15
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 60)
  doc.text("Yours Sincerely,", margin, closingY)
  
  // Signature section
  doc.text("(Signature and Stamp)", margin, closingY + 25)
  doc.text("Authorized Representative", margin, closingY + 30)

  if (shouldDownload) {
    doc.save(`${type}_${data.consumerName.replace(/\s+/g, '_')}.pdf`)
  } else {
    return doc.output('blob')
  }
}

