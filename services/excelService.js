const ExcelJS = require('exceljs');

exports.generateExcel = async (data, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // إضافة عناوين الأعمدة
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Quantity', key: 'quantity', width: 15 },
    { header: 'Price', key: 'price', width: 15 },
  ];

  // إضافة البيانات
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // إعداد الاستجابة
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};