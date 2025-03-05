const PDFDocument = require('pdfkit');

exports.generatePDF = (data, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');

  doc.pipe(res);

  data.forEach((item, index) => {
    doc.text(`Item ${index + 1}: ${JSON.stringify(item)}`);
    doc.moveDown();
  });

  doc.end();
};