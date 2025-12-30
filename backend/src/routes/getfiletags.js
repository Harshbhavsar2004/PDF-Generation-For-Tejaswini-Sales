const CustomerData = require("../models/ConsumerCsvRow");

async function getFileTags(req, res) {
  try {
    const files = await CustomerData.distinct("fileTag");
    res.json({ files }); // always return array inside object
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch file list" });
  }
}

module.exports = { getFileTags };
