const CustomerData = require("../models/ConsumerCsvRow");

/**
 * GET /api/data/customers?fileTag=July_2025
 */
exports.getCustomers = async (req, res) => {
  try {
    const { fileTag } = req.query;
    if (!fileTag) {
      return res.status(400).json({ message: "fileTag required" });
    }

    const records = await CustomerData.find({ fileTag })
      .sort({ rowIndex: 1 })
      .lean();

    const customers = records.map((doc) => ({
      rowIndex: doc.rowIndex,
      invoiceGenerated: doc.invoiceGenerated,
      invoiceNumber: doc.invoiceNumber,
      ...doc.data, // 🔥 full CSV row
    }));

    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};


exports.markCustomerDone = async (req, res) => {
  try {
    const { fileTag, rowIndex, invoiceDate } = req.body;

    if (!fileTag || rowIndex === undefined) {
      return res.status(400).json({ message: "Missing data" });
    }

    // 🔢 Find last invoice number
    const lastInvoice = await CustomerData.findOne({
      invoiceGenerated: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    let nextInvoiceNumber = "INV-001";

    if (lastInvoice?.invoiceNumber) {
      const num = parseInt(lastInvoice.invoiceNumber.replace(/\D/g, ""));
      nextInvoiceNumber = `INV-${String(num + 1).padStart(3, "0")}`;
    }

    // ✅ Update selected customer
    await CustomerData.updateOne(
      { fileTag, rowIndex },
      {
        $set: {
          invoiceGenerated: true,
          invoiceNumber: nextInvoiceNumber,
          invoiceDate,
        },
      }
    );

    res.json({
      success: true,
      invoiceNumber: nextInvoiceNumber,
    });
  } catch (err) {
    console.error("MARK DONE ERROR:", err);
    res.status(500).json({ message: "Failed to mark done" });
  }
};

