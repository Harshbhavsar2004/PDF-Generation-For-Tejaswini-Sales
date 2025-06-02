import jsPDF from "jspdf"

// Common utility functions
const setupPage = (doc, data) => {
  // Define theme colors
  const primaryColor = [108, 11, 169] // #6C0BA9
  const secondaryColor = [147, 112, 219]
  const lightColor = [245, 240, 255]
  
  // Set default margin
  const margin = 20
  const pageWidth = doc.internal.pageSize.width
  const contentWidth = pageWidth - (margin * 2)

  // Company header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(data.installerName, pageWidth / 2, margin + 10, { align: "center" })

  // Company details
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(data.installerAddress, pageWidth / 2, margin + 18, { align: "center" })
  doc.text(data.installerContact, pageWidth / 2, margin + 24, { align: "center" })

  // Decorative line
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, margin + 30, pageWidth - margin, margin + 30)

  return { margin, pageWidth, contentWidth, primaryColor, secondaryColor, lightColor }
}

const addSystemDetails = (doc, data, startY, { margin, contentWidth, lightColor }) => {
  const rowHeight = 12
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2])
  doc.rect(margin, startY, contentWidth, rowHeight, "F")
  
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("System Specifications", margin + 5, startY + 8)

  const specs = [
    ["System Type:", data.systemType],
    ["System Capacity:", `${data.systemCapacity} KW`],
    ["Panel Make:", data.panelMake],
    ["Panel Model:", data.panelModel],
    ["Number of Panels:", data.panelCount],
    ["Inverter Make:", data.inverterMake],
    ["Inverter Model:", data.inverterModel]
  ]

  doc.setFont("helvetica", "normal")
  specs.forEach((row, index) => {
    const y = startY + ((index + 1) * rowHeight) + 8
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 255)
      doc.rect(margin, startY + ((index + 1) * rowHeight), contentWidth, rowHeight, "F")
    }
    doc.text(row[0], margin + 5, y)
    doc.text(row[1], margin + contentWidth/2, y)
  })

  return startY + ((specs.length + 1) * rowHeight)
}

// Generate Work Completion Report
const generateWorkCompletionReport = (doc, data, pageConfig) => {
  const { margin, pageWidth, contentWidth, primaryColor } = pageConfig
  
  // Title
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(14)
  doc.text("WORK COMPLETION REPORT", pageWidth / 2, margin + 45, { align: "center" })

  // Letter content
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)

  let currentY = margin + 65
  
  // Consumer details
  doc.text(`Date: ${new Date(data.completionDate).toLocaleDateString()}`, margin, currentY)
  currentY += 20

  doc.text("To,", margin, currentY)
  currentY += 10
  doc.text(`${data.bankName},`, margin, currentY)
  currentY += 8
  doc.text(`${data.bankBranch},`, margin, currentY)
  currentY += 8
  doc.text(`${data.bankLocation}`, margin, currentY)
  currentY += 20

  // Main content
  const content = [
    `This is to certify that we have successfully completed the installation of ${data.systemCapacity} KW Solar Rooftop System at the following location:`,
    "",
    `Consumer Name: ${data.consumerName}`,
    `Address: ${data.consumerAddress}`,
    `Contact: ${data.consumerMobile}`,
    "",
    "The installation has been completed as per MNRE/MSEDCL guidelines and specifications.",
    "",
    `Installation Date: ${new Date(data.installationDate).toLocaleDateString()}`,
    `Completion Date: ${new Date(data.completionDate).toLocaleDateString()}`
  ]

  content.forEach(line => {
    doc.text(line, margin, currentY)
    currentY += 10
  })

  // Add system details
  currentY = addSystemDetails(doc, data, currentY + 10, pageConfig)

  // Signature
  currentY += 30
  doc.text("Yours faithfully,", margin, currentY)
  currentY += 25
  doc.text("(Authorized Signatory)", margin, currentY)
  doc.text(data.installerName, margin, currentY + 10)
}

// Generate Bank Hypothecation Letter
const generateBankHypothecation = (doc, data, pageConfig) => {
  const { margin, pageWidth, contentWidth, primaryColor } = pageConfig

  // Title
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(14)
  doc.text("BANK HYPOTHECATION LETTER", pageWidth / 2, margin + 45, { align: "center" })

  // Letter content
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)

  let currentY = margin + 65

  // Date and address
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, currentY)
  currentY += 20

  doc.text("To,", margin, currentY)
  currentY += 10
  doc.text(`The Branch Manager,`, margin, currentY)
  currentY += 8
  doc.text(`${data.bankName},`, margin, currentY)
  currentY += 8
  doc.text(`${data.bankBranch},`, margin, currentY)
  currentY += 8
  doc.text(`${data.bankLocation}`, margin, currentY)
  currentY += 20

  // Main content
  const content = `I, ${data.consumerName}, residing at ${data.consumerAddress}, hereby hypothecate the installed ${data.systemCapacity} KW solar rooftop system to ${data.bankName}, ${data.bankBranch}, as security against the loan sanctioned for this installation.`
  
  const wrappedContent = doc.splitTextToSize(content, contentWidth)
  doc.text(wrappedContent, margin, currentY)
  currentY += wrappedContent.length * 12 + 20

  // System details
  currentY = addSystemDetails(doc, data, currentY, pageConfig)

  // Bank details
  currentY += 20
  const bankDetails = [
    "Bank Account Details:",
    `Account Number: ${data.accountNumber}`,
    `IFSC Code: ${data.ifscCode}`,
    `Branch: ${data.bankBranch}`
  ]

  bankDetails.forEach(line => {
    doc.text(line, margin, currentY)
    currentY += 10
  })

  // Signature
  currentY += 30
  doc.text("Yours sincerely,", margin, currentY)
  currentY += 25
  doc.text("(Consumer Signature)", margin, currentY)
  doc.text(data.consumerName, margin, currentY + 10)
}

// Generate Subsidy Application
const generateSubsidyApplication = (doc, data, pageConfig) => {
  const { margin, pageWidth, contentWidth, primaryColor } = pageConfig

  // Title
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(14)
  doc.text("SOLAR ROOFTOP SUBSIDY APPLICATION", pageWidth / 2, margin + 45, { align: "center" })

  // Application content
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)

  let currentY = margin + 65

  // Application details
  const applicationDetails = [
    { label: "Application Date:", value: new Date().toLocaleDateString() },
    { label: "Consumer Name:", value: data.consumerName },
    { label: "Aadhar Number:", value: data.consumerAadhar },
    { label: "Contact Number:", value: data.consumerMobile },
    { label: "Email:", value: data.consumerEmail },
    { label: "Installation Address:", value: data.consumerAddress },
    { label: "MSEDCL Consumer Number:", value: data.consumerNumber },
    { label: "Meter Number:", value: data.meterNumber },
    { label: "Sanction Load:", value: `${data.sanctionLoadKW} KW` },
    { label: "Project Cost:", value: `₹ ${data.projectCost}` }
  ]

  applicationDetails.forEach(detail => {
    doc.text(`${detail.label} ${detail.value}`, margin, currentY)
    currentY += 10
  })

  // System details
  currentY = addSystemDetails(doc, data, currentY + 10, pageConfig)

  // Declaration
  currentY += 20
  const declaration = "I hereby declare that all the information provided above is true to the best of my knowledge. I request for the processing of my solar rooftop subsidy application as per the applicable government schemes."
  
  const wrappedDeclaration = doc.splitTextToSize(declaration, contentWidth)
  doc.text(wrappedDeclaration, margin, currentY)

  // Signature
  currentY += wrappedDeclaration.length * 12 + 30
  doc.text("Signature of Applicant", margin, currentY)
  doc.text(data.consumerName, margin, currentY + 10)
}

// Main export function
export const generateMultiPDF = async (data, type, shouldDownload = true) => {
  const doc = new jsPDF()
  const pageConfig = setupPage(doc, data)

  switch (type) {
    case "workCompletion":
      generateWorkCompletionReport(doc, data, pageConfig)
      break
    case "bankHypothecation":
      generateBankHypothecation(doc, data, pageConfig)
      break
    case "subsidy":
      generateSubsidyApplication(doc, data, pageConfig)
      break
  }

  // Add Aadhar image if available
  if (data.aadharImagePreview) {
    try {
      const img = new Image()
      img.src = data.aadharImagePreview
      await new Promise((resolve) => {
        img.onload = resolve
      })
      doc.addPage()
      doc.text("Attached Documents", pageConfig.margin, pageConfig.margin + 10)
      doc.text("Aadhar Card:", pageConfig.margin, pageConfig.margin + 20)
      doc.addImage(
        img,
        'JPEG',
        pageConfig.margin,
        pageConfig.margin + 30,
        pageConfig.contentWidth,
        pageConfig.contentWidth * (img.height / img.width)
      )
    } catch (error) {
      console.error('Error adding Aadhar image:', error)
    }
  }

  if (shouldDownload) {
    doc.save(`${type}_${data.consumerName.replace(/\s+/g, '_')}.pdf`)
  } else {
    return doc.output('blob')
  }
} 