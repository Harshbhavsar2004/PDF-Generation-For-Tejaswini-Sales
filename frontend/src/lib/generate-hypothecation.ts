import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { FormData } from "./types"
import { formatDate } from "./utils"

const addImageWithFixedSize = async (
  doc: jsPDF,
  imgData: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
) => {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = imgData;

    img.onload = () => {
      let imgWidth = img.width;
      let imgHeight = img.height;
      const aspectRatio = imgWidth / imgHeight;

      // Resize while maintaining aspect ratio
      if (imgWidth > imgHeight) {
        imgWidth = maxWidth;
        imgHeight = maxWidth / aspectRatio;
      } else {
        imgHeight = maxHeight;
        imgWidth = maxHeight * aspectRatio;
      }

      // Add image to PDF without compression
      doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
      resolve();
    };

    img.onerror = () => resolve(); // Continue without breaking if image fails
  });
};




export const generateHypothecation = async (data: FormData, download = false) => {
  const doc = new jsPDF()

  // Set document properties
  doc.setProperties({
    title: "Annexure-A",
    subject: "Undertaking/Self-Declaration for Domestic Content Requirement",
    author: data.companyName,
    creator: data.installerName,
  })

  // Add header
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Annexure -A", doc.internal.pageSize.width / 2, 15, { align: "center" })
  doc.setFontSize(12)
  doc.text(
    "Undertaking/Self- Declaration for Domestic Content Requirement fulfillment",
    doc.internal.pageSize.width / 2,
    22,
    { align: "center" },
  )
  doc.text("(On a plain Paper)", doc.internal.pageSize.width / 2, 28, { align: "center" })

  // Add certification text - using exact formatting as in the sample
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  let y = 40
  doc.text(
    `This is to certify that M/S ${data.installerName} has installed ${data.sanctionedCapacity} KW Grid Connected Rooftop Solar`,
    14,
    y,
  )
  doc.text(`Plant for ${data.consumerName} at`, 14, y + 5)
  doc.text(`${data.address}`, 14, y + 10)
  doc.text(`under application number ${data.sanctionNumber} under MAHARASHTRA`, 14, y + 15)
  doc.text("ELECTRICITY DISTRIBUTION CO. LTD.", 14, y + 20)

  y += 30
  doc.text("2", 14, y)
  doc.text(
    "It is hereby undertaken that the PV modules installed for the above-mentioned project are domestically",
    20,
    y,
  )
  doc.text(
    "manufactured using domestic manufactured solar cells. The details of installed PV Modules are follows:",
    20,
    y + 5,
  )

  // Add module details table
  autoTable(doc, {
    startY: y + 10,
    body: [
      ["1. PV Module Capacity", `:- ${data.moduleCapacity}`],
      ["2. Number of PV Modules", `:- ${data.numberOfModules}`],
      ["3. Sr No of PV Module", ""],
    ],
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 80 },
    },
  })

  // Add serial numbers table
  const serialNumbers = data.moduleSerialNumbers.filter((s) => s.trim() !== "")
  const serialRows = []

  for (let i = 0; i < serialNumbers.length; i += 2) {
    if (i + 1 < serialNumbers.length) {
      serialRows.push([`${i + 1}`, serialNumbers[i], `${i + 2}`, serialNumbers[i + 1]])
    } else {
      serialRows.push([`${i + 1}`, serialNumbers[i], "", ""])
    }
  }

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 5,
    head: [["Sr", "Serial Number", "Sr", "Serial Number"]],
    body: serialRows,
    theme: "grid",
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 3 },
  })

  // Add more details
  y = (doc as any).lastAutoTable.finalY + 15

  doc.text("4. PV Module Make:", 14, y)
  doc.text(data.moduleManufacturer, 80, y)

  y += 5
  doc.text("5. Cell manufacturer's name –", 14, y)
  doc.text(data.cellManufacturer, 80, y)

  y += 5
  doc.text("6. Cell GST invoice No –", 14, y)
  doc.text(`${data.cellGSTInvoice} Date.${formatDate(data.cellGSTDate)}`, 80, y)

  // Add declaration
  y += 15
  doc.text("3", 14, y)
  doc.text("The above undertaking is based on the certificate issued by PV Module manufacturer/supplier while", 20, y)
  doc.text("supplying the above mentioned order.", 20, y + 5)

  y += 15
  doc.text("4", 14, y)
  doc.text(`I, ${data.installerName} on behalf of ${data.companyName} further declare that the`, 20, y)
  doc.text(
    "information given above is true and correct and nothing has been concealed therein. If anything is found",
    20,
    y + 5,
  )
  doc.text(
    "incorrect at any stage,then REC/ MNRE may take any appropriate action against my company for wrong",
    20,
    y + 10,
  )
  doc.text(
    "declaration. Supporting documents and proof of the above information will be provided as and when requested",
    20,
    y + 15,
  )
  doc.text("by MNRE.", 20, y + 20)

  // Add signature section with increased box size
  y += 35

 // Check if PV modules are greater than 6
if (Number(data.numberOfModules) > 4) {
  doc.addPage(); // Move signature section to a new page
  y = 20; // Reset y position for new page
}

// Define signature box properties
const boxWidth = 80;
const boxHeight = 40;
const boxX = doc.internal.pageSize.width - boxWidth - 20;

const imagePromises = [];

// Add company stamp (Fixed 50x30)
if (data.companyStamp) {
  imagePromises.push(addImageWithFixedSize(doc, data.companyStamp, boxX + 5, y - 15, boxWidth - 10, boxHeight - 10));
}


// Wait for all images to load before saving/returning the PDF
await Promise.all(imagePromises);


// Signature details
doc.text(`For ${data.companyName}`, boxX, y + boxHeight + 5);
doc.text(`Name: ${data.installerName}`, boxX, y + boxHeight + 10);
doc.text(`Designation: ${data.installerDesignation}`, boxX, y + boxHeight + 15);
doc.text(`Phone: ${data.installerPhone}`, boxX, y + boxHeight + 20);
doc.text(`Email: ${data.installerEmail}`, boxX, y + boxHeight + 25);

  // Instead of saving directly, return blob for preview or save for download
  if (download) {
    doc.save("DCR.pdf")
  } else {
    return doc.output('blob')
  }
}

