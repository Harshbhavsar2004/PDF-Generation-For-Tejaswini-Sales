const mongoose = require('mongoose');

const workCompletionSchema = new mongoose.Schema({
  consumerName: {
    type: String,
    required: true
  },
  consumerAddress: {
    type: String,
    required: true
  },
  consumerMobile: {
    type: String,
    required: true
  },
  systemCapacity: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true,
    default: 'SBI Bank'
  },
  bankBranch: {
    type: String,
    required: true,
    default: 'Pramodnagar Branch'
  },
  bankLocation: {
    type: String,
    required: true,
    default: 'Dhule'
  },
  installerName: {
    type: String,
    required: true,
    default: 'JANHAVI ENTERPRISES DHULE'
  },
  installerAddress: {
    type: String,
    required: true
  },
  installerContact: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkCompletion', workCompletionSchema); 