const PDFDocument = require("pdfkit")

async function generateInvoice(req, res) {
  try {
    const { customerName, customerData } = req.body
    const data = JSON.parse(customerData) // parsed Excel row

    const doc = new PDFDocument({ size: "A4", margin: 40 })
    const chunks = []

    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks)
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${customerName}.pdf"`
      )
      res.send(pdfBuffer)
    })

    /* ================= HEADER ================= */
    doc.fontSize(22).font("Helvetica-Bold").text("TAX INVOICE", {
      align: "center",
    })
    doc.moveDown(1)

    /* ================= COMPANY ================= */
    doc.fontSize(12).font("Helvetica-Bold").text("TEJASWINI SALES")
    doc.fontSize(10).font("Helvetica")
    doc.text("Solar Sales & Installation")
    doc.text("Dhule, Maharashtra")
    doc.moveDown(1)

    /* ================= CUSTOMER DETAILS ================= */
    doc.fontSize(11).font("Helvetica-Bold").text("CUSTOMER DETAILS")
    doc.moveDown(0.5)
    doc.fontSize(10).font("Helvetica")

    doc.text(`Name: ${data["Consumer Name"] || customerName}`)
    doc.text(`Mobile: ${data["Mobile No. of Consumer"] || "N/A"}`)
    doc.text(`Address: ${data["Consumer Address"] || "N/A"}`)
    doc.text(`District: ${data["District Name"] || "N/A"}`)
    doc.text(`State: ${data["State Name"] || "N/A"}`)

    doc.moveDown(1)

    /* ================= SYSTEM DETAILS ================= */
    doc.fontSize(11).font("Helvetica-Bold").text("SOLAR SYSTEM DETAILS")
    doc.moveDown(0.5)
    doc.fontSize(10).font("Helvetica")

    doc.text(`Proposed Capacity: ${data["Proposed PV Capacity (kWp)"]} kWp`)
    doc.text(
      `Installed Capacity: ${data["Installed PV Module Capacity (kWp)"]} kWp`
    )
    doc.text(`Module Make: ${data["PV Module Make"]}`)
    doc.text(`Module Quantity: ${data["Module Quantity"]}`)
    doc.text(`Inverter Make: ${data["Inverter Make"]}`)
    doc.text(`Inverter Capacity: ${data["Inverter Capacity (kW)"]} kW`)

    doc.moveDown(1)

    /* ================= SUBSIDY ================= */
    doc.fontSize(11).font("Helvetica-Bold").text("SUBSIDY DETAILS")
    doc.moveDown(0.5)
    doc.fontSize(10).font("Helvetica")

    doc.text(`Subsidy Amount: ₹${data["Subsidy Amount (Rs.)"]}`)
    doc.text(`Status: ${data["Current Status of Application"]}`)

    doc.moveDown(2)

    /* ================= FOOTER ================= */
    doc
      .fontSize(9)
      .text(
        "This is a computer-generated invoice / document. Signature not required.",
        { align: "center" }
      )

    doc.end()
  } catch (err) {
    console.error("PDF ERROR:", err)
    res.status(500).json({ error: "Failed to generate invoice" })
  }
}

module.exports = { generateInvoice }
