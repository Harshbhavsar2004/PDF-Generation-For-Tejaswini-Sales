const mongoose = require("mongoose");

const ConsumerCsvRowSchema = new mongoose.Schema(
  {
    fileTag: { type: String, index: true },
    rowIndex: Number,

    data: { type: Object, required: true },

    // 🔥 INVOICE STATUS
    invoiceGenerated: {
      type: Boolean,
      default: false,
    },

    invoiceNumber: {
      type: String,
    },

    invoiceDate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConsumerCsvRow", ConsumerCsvRowSchema);
