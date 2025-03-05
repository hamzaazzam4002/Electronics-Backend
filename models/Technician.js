const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // تأكد من إضافة حقل email
  invoices: [{
    partName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    totalRemaining: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    isDebtor: { type: Boolean, default: false },
  }],
});

module.exports = mongoose.model('Technician', technicianSchema);