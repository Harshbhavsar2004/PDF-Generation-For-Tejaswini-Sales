const csv = require("csvtojson");
const ConsumerCsvRow = require("../models/ConsumerCsvRow");

async function importCsvData(req, res) {
  try {
    const { fileTag } = req.body;
    const file = req.file;

    if (!file || !fileTag) {
      return res.status(400).json({
        message: "CSV file and fileTag are required",
      });
    }

    // Parse CSV to JSON
    const rows = await csv({
      trim: true,
      ignoreEmpty: false, // 🔥 IMPORTANT
    }).fromString(file.buffer.toString("utf-8"));

    // 🔁 If same fileTag uploaded again → replace old data
    await ConsumerCsvRow.deleteMany({ fileTag });

    const documents = rows.map((row, index) => ({
      fileTag,
      rowIndex: index + 1,
      data: row, // 🔥 STORE EVERYTHING AS-IS
    }));

    await ConsumerCsvRow.insertMany(documents);

    res.json({
      message: "CSV data imported successfully",
      totalRows: documents.length,
      fileTag,
    });
  } catch (err) {
    console.error("CSV IMPORT ERROR:", err);
    res.status(500).json({
      message: "Failed to import CSV data",
    });
  }
}

module.exports = { importCsvData };
