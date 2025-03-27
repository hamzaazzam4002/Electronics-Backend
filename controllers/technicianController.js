const Technician = require('../models/Technician');
const Electronic = require('../models/ElectronicPart');

// exports.getTechnicians = async (req, res) => {
//   try {
//       const technicians = await Technician.find(); // جلب جميع الفنيين
//       res.status(200).json({
//           success: true,
//           count: technicians.length,
//           data: technicians,
//       });
//   } catch (err) {
//       res.status(500).json({
//           success: false,
//           message: 'حدث خطأ أثناء جلب الفنيين',
//           error: err.message,
//       });
//   }
// };
exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// exports.getTechnicianById = async (req, res) => {
//   try {
//     const technician = await Technician.findById(req.params.id);
//     if (!technician) {
//       return res.status(404).json({ success: false, message: 'Technician not found' });
//     }
//     res.status(200).json({ success: true, data: technician });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

exports.getTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }
    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// exports.addTechnician = async (req, res) => {
//   const { name } = req.body;
//   try {
//     const technician = new Technician({ name });
//     await technician.save();
//     res.status(201).json(technician);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

exports.addTechnician = async (req, res) => {
  try {
    const technician = new Technician(req.body);
    await technician.save();
    res.status(201).json({ success: true, data: technician });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateTechnician = async (req, res) => {
  try {
    const technician = await Technician.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }
    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findByIdAndDelete(req.params.id);
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }
    res.status(200).json({ success: true, message: 'Technician deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};



exports.addInvoiceToTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }

    if (!technician.address) {
      technician.address = 'عنوان افتراضي';
    }

    const { items, date } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array is required and must not be empty' });
    }

    let totalAmountToAdd = 0;

    for (const item of items) {
      if (!item.partId || !item.partName || !item.quantity || !item.price || item.remainingAmount === undefined) {
        return res.status(400).json({ success: false, error: 'All items must have partId, partName, quantity, price, and remainingAmount' });
      }

      const quantity = parseInt(item.quantity);
      const price = parseFloat(item.price);
      const paidAmount = parseFloat(item.paidAmount || 0);
      const remainingAmount = parseFloat(item.remainingAmount);

      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, error: `Invalid quantity for item ${item.partName}` });
      }
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ success: false, error: `Invalid price for item ${item.partName}` });
      }
      if (isNaN(paidAmount) || paidAmount < 0) {
        return res.status(400).json({ success: false, error: `Invalid paidAmount for item ${item.partName}` });
      }
      if (isNaN(remainingAmount) || remainingAmount < 0) {
        return res.status(400).json({ success: false, error: `Invalid remainingAmount for item ${item.partName}` });
      }

      const electronic = await Electronic.findById(item.partId);
      if (!electronic) {
        return res.status(404).json({ success: false, error: `Electronic part with ID ${item.partId} not found` });
      }

      if (electronic.quantity < quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${item.partName}. Available: ${electronic.quantity}, Requested: ${quantity}` });
      }

      electronic.quantity -= quantity;
      await electronic.save();

      const invoice = {
        partId: item.partId,
        partName: item.partName,
        quantity: quantity,
        price: price,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount,
        date: date ? new Date(date) : Date.now(),
      };

      if (isNaN(new Date(invoice.date).getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format' });
      }

      technician.invoices.push(invoice);
      totalAmountToAdd += (quantity * price) - paidAmount;
    }

    technician.totalDueAmount += totalAmountToAdd;
    await technician.save();

    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.makePayment = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    let remainingPayment = req.body.amount;
    for (let invoice of technician.invoices) {
      if (remainingPayment <= 0) break;

      if (invoice.remainingAmount > 0) {
        const paymentForInvoice = Math.min(remainingPayment, invoice.remainingAmount);
        invoice.remainingAmount -= paymentForInvoice;
        remainingPayment -= paymentForInvoice;
      }
    }

    technician.totalDebt = technician.invoices.reduce((total, invoice) => total + invoice.remainingAmount, 0);
    await technician.save();

    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.payAmountToTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }

    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid payment amount' });
    }

    if (amount > technician.totalDueAmount) {
      return res.status(400).json({ success: false, error: 'Payment amount exceeds total due amount' });
    }

    technician.totalDueAmount -= amount;
    await technician.save();
    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.filterInvoices = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const technicians = await Technician.find({
      'invoices.date': { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.status(200).json(technicians);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getInvoicesSummary = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('invoices');

    const summary = technicians.map((technician) => {
      const totalInvoices = technician.invoices.length;
      const totalAmountPaid = technician.invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
      const totalRemainingAmount = technician.invoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0);

      return {
        technician: technician.name,
        totalInvoices,
        totalAmountPaid,
        totalRemainingAmount,
        invoices: technician.invoices,
      };
    });

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.filterInvoicesByTechnician = async (req, res) => {
  const { technicianId } = req.params;
  try {
    const technician = await Technician.findById(technicianId).populate('invoices');
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.status(200).json(technician.invoices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.exportInvoicesPDF = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('invoices');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices.pdf');

    doc.pipe(res);

    technicians.forEach((technician) => {
      doc.text(`Technician: ${technician.name}`);
      technician.invoices.forEach((invoice, index) => {
        doc.text(`Invoice ${index + 1}:`);
        doc.text(`Part Name: ${invoice.partName}`);
        doc.text(`Quantity: ${invoice.quantity}`);
        doc.text(`Price: ${invoice.price}`);
        doc.text(`Amount Paid: ${invoice.amountPaid}`);
        doc.text(`Remaining Amount: ${invoice.remainingAmount}`);
        doc.text(`Total Remaining: ${invoice.totalRemaining}`);
        doc.text(`Date: ${invoice.date}`);
        doc.moveDown();
      });
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const ExcelJS = require('exceljs');

exports.exportInvoicesExcel = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('invoices');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoices');

    worksheet.columns = [
      { header: 'Technician', key: 'technician', width: 20 },
      { header: 'Part Name', key: 'partName', width: 20 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Amount Paid', key: 'amountPaid', width: 15 },
      { header: 'Remaining Amount', key: 'remainingAmount', width: 20 },
      { header: 'Total Remaining', key: 'totalRemaining', width: 20 },
      { header: 'Date', key: 'date', width: 20 },
    ];

    technicians.forEach((technician) => {
      technician.invoices.forEach((invoice) => {
        worksheet.addRow({
          technician: technician.name,
          partName: invoice.partName,
          quantity: invoice.quantity,
          price: invoice.price,
          amountPaid: invoice.amountPaid,
          remainingAmount: invoice.remainingAmount,
          totalRemaining: invoice.totalRemaining,
          date: invoice.date,
        });
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.exportInvoicesSummaryPDF = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('invoices');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices_summary.pdf');

    doc.pipe(res);

    technicians.forEach((technician) => {
      doc.text(`Technician: ${technician.name}`);
      doc.text(`Total Invoices: ${technician.invoices.length}`);
      doc.text(`Total Amount Paid: ${technician.invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0)}`);
      doc.text(`Total Remaining Amount: ${technician.invoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0)}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportInvoicesSummaryExcel = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('invoices');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoices Summary');

    worksheet.columns = [
      { header: 'Technician', key: 'technician', width: 20 },
      { header: 'Total Invoices', key: 'totalInvoices', width: 15 },
      { header: 'Total Amount Paid', key: 'totalAmountPaid', width: 20 },
      { header: 'Total Remaining Amount', key: 'totalRemainingAmount', width: 20 },
    ];

    technicians.forEach((technician) => {
      worksheet.addRow({
        technician: technician.name,
        totalInvoices: technician.invoices.length,
        totalAmountPaid: technician.invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0),
        totalRemainingAmount: technician.invoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices_summary.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.filterInvoicesByStatus = async (req, res) => {
  const { status } = req.query; // status: 'debtor' أو 'creditor'
  try {
    const technicians = await Technician.find({
      'invoices.isDebtor': status === 'debtor',
    }).populate('invoices');
    res.status(200).json(technicians);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



const transporter = require('../config/nodemailer');

exports.sendLateInvoicesNotifications = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('invoices');

    technicians.forEach((technician) => {
      technician.invoices.forEach((invoice) => {
        if (new Date(invoice.date) < new Date()) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: technician.email, // تأكد من وجود حقل email في نموذج الفني
            subject: 'فاتورة متأخرة',
            text: `الفاتورة ${invoice.partName} متأخرة. الرجاء السداد في أقرب وقت ممكن.`,
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error('Error sending email:', err);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        }
      });
    });

    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGeneralStatistics = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('invoices');

    const totalInvoices = technicians.reduce((sum, technician) => sum + technician.invoices.length, 0);
    const totalAmountPaid = technicians.reduce((sum, technician) => sum + technician.invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0), 0);
    const totalRemainingAmount = technicians.reduce((sum, technician) => sum + technician.invoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0), 0);
    const debtorsCount = technicians.filter((technician) => technician.invoices.some((invoice) => invoice.isDebtor)).length;
    const creditorsCount = technicians.length - debtorsCount;

    res.status(200).json({
      totalInvoices,
      totalAmountPaid,
      totalRemainingAmount,
      debtorsCount,
      creditorsCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

