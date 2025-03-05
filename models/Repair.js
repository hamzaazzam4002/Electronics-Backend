const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  issue: { type: String, required: true },
  receivedDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
});

module.exports = mongoose.model('Repair', repairSchema);