const Technician = require('../models/Technician');

exports.addTechnician = async (req, res) => {
  const { name } = req.body;
  try {
    const technician = new Technician({ name });
    await technician.save();
    res.status(201).json(technician);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addInvoice = async (req, res) => {
  const { id } = req.params;
  const { partName, quantity, price, amountPaid, remainingAmount, totalRemaining, isDebtor } = req.body;
  try {
    const technician = await Technician.findById(id);
    technician.invoices.push({ partName, quantity, price, amountPaid, remainingAmount, totalRemaining, isDebtor });
    await technician.save();
    res.status(201).json(technician);
  } catch (err) {
    res.status(400).json({ error: err.message });
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