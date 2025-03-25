// const mongoose = require('mongoose');

// const technicianSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   // email: { type: String, required: true }, // تأكد من إضافة حقل email
//   invoices: [{
//     partName: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true },
//     amountPaid: { type: Number, required: true },
//     remainingAmount: { type: Number, required: true },
//     totalRemaining: { type: Number, required: true },
//     date: { type: Date, default: Date.now },
//     isDebtor: { type: Boolean, default: false },
//   }],
// });

// module.exports = mongoose.model('Technician', technicianSchema);



const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  partId: { type: mongoose.Schema.Types.ObjectId, ref: 'Electronic', required: true },
  partName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paidAmount: { type: Number, default: 0 }, // المبلغ المدفوع لكل فاتورة
  remainingAmount: { type: Number, required: true }, // المبلغ المتبقي لكل فاتورة
});

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  invoices: [invoiceSchema],
  totalDueAmount: { type: Number, default: 0 }, // المبلغ المستحق الكلي
});

module.exports = mongoose.model('Technician', technicianSchema);