const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { importCsvData } = require("../controllers/importCsvData");

router.post("/api/data/import-csv", upload.single("file"), importCsvData);

module.exports = router;
