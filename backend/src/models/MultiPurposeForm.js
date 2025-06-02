const mongoose = require('mongoose');

const multiPurposeFormSchema = new mongoose.Schema({
  consumerName: {
    type: String
  },
  consumerNumber: {
    type: String
  },
  mobileNumber: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  reArrangementType: {
    type: String,
    default: "Net Metering Arrangement"
  },
  reSource: {
    type: String,
    default: "solar"
  },
  sanctionedCapacity: {
    type: String
  },
  capacityType: {
    type: String,
    default: "single phase"
  },
  projectModel: {
    type: String,
    default: "NA"
  },
  installedCapacityRooftop: {
    type: String
  },
  installedCapacityTotal: {
    type: String,
    default: "NA"
  },
  installedCapacityGround: {
    type: String,
    default: "NA"
  },
  installationDate: {
    type: String
  },
  inverterCapacity: {
    type: String
  },
  inverterMake: {
    type: String
  },
  numberOfModules: {
    type: String
  },
  moduleCapacity: {
    type: String
  },
  category: {
    type: String,
    default: "Private"
  },
  warrantyDetails: {
    type: String,
    default: "30 Years"
  },
  sanctionNumber: {
    type: String
  },
  moduleManufacturer: {
    type: String
  },
  moduleWattage: {
    type: String
  },
  moduleSerialNumbers: {
    type: [String],
    default: ["", "", "", "", "", ""]
  },
  inverterModel: {
    type: String
  },
  inverterRating: {
    type: String,
    default: "5 star"
  },
  chargeControllerType: {
    type: String,
    default: "1mppt"
  },
  earthingCount: {
    type: String,
    default: "3"
  },
  lightningArrester: {
    type: String,
    default: "Yes"
  },
  manufacturingYear: {
    type: String
  },
  aadharNumber: {
    type: String
  },
  cellManufacturer: {
    type: String
  },
  cellGSTInvoice: {
    type: String
  },
  cellGSTDate: {
    type: String
  },
  installerName: {
    type: String
  },
  installerDesignation: {
    type: String
  },
  installerPhone: {
    type: String
  },
  installerEmail: {
    type: String
  },
  companyName: {
    type: String
  },
  msedclOfficerName: {
    type: String
  },
  msedclOfficerDesignation: {
    type: String
  },
  msedclInspectionDate: {
    type: String
  },
  customerSignature: {
    type: String
  },
  vendorSignature: {
    type: String
  },
  companyStamp: {
    type: String
  },
  totalCost: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MultiPurposeForm', multiPurposeFormSchema); 