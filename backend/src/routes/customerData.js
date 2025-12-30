const express = require("express");
const router = express.Router();

const {
  getCustomers,
  markCustomerDone,
} = require("../controllers/customerData");

router.get("/customers", getCustomers);
router.post("/mark-done", markCustomerDone);

module.exports = router;
