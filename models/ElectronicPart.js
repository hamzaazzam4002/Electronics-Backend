const mongoose = require('mongoose');

const electronicPartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
});

module.exports = mongoose.model('ElectronicPart', electronicPartSchema);