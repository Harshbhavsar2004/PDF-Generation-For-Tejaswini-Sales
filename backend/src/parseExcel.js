const XLSX = require("xlsx")

async function parseExcel(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" })
    }

    const buffer = req.file.buffer
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(worksheet)
    res.json({ customers: data })
  } catch (error) {
    console.error("Error parsing Excel:", error)
    res.status(500).json({ error: "Failed to parse Excel file" })
  }
}

module.exports = parseExcel
