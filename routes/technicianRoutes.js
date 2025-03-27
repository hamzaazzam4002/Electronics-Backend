const express = require('express');
const technicianController = require('../controllers/technicianController');

const router = express.Router();


/**
 * @swagger
 * /api/technicians:
 *   post:
 *     summary: Add a new technician
 *     description: Add a new technician with a name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the technician.
 *     responses:
 *       201:
 *         description: Technician added successfully.
 *       400:
 *         description: Invalid input data.
*/
router.post('/', technicianController.addTechnician);


/**
 * @swagger
 * /technicians:
 *   get:
 *     summary: استرجاع قائمة الفنيين
 *     description: يُستخدم هذا الـ endpoint لجلب قائمة بجميع الفنيين المسجلين في النظام مع تفاصيل كل فني.
 *     tags:
 *       - Technicians
 *     responses:
 *       200:
 *         description: تم استرجاع قائمة الفنيين بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: معرف الفني
 *                     example: "507f1f77bcf86cd799439011"
 *                   address:
 *                     type: string
 *                     description: عنوان الفني
 *                     example: "عنوان افتراضي"
 *                   totalDueAmount:
 *                     type: number
 *                     description: إجمالي المبلغ المستحق
 *                     example: 200.00
 *                   invoices:
 *                     type: array
 *                     description: قائمة الفواتير الخاصة بالفني
 *                     items:
 *                       type: object
 *                       properties:
 *                         partId:
 *                           type: string
 *                           example: "507f191e810c19729de860ea"
 *                         partName:
 *                           type: string
 *                           example: "بطارية"
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                         price:
 *                           type: number
 *                           example: 50.00
 *                         paidAmount:
 *                           type: number
 *                           example: 20.00
 *                         remainingAmount:
 *                           type: number
 *                           example: 30.00
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-03-26T10:00:00Z"
 *       500:
 *         description: خطأ في الخادم الداخلي
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "حدث خطأ أثناء استرجاع الفنيين"
 */
router.get('/', technicianController.getTechnicians);

/**
 * @swagger
 * /technicians/{id}/invoices:
 *   post:
 *     summary: إضافة فاتورة جديدة لفني
 *     description: يُستخدم هذا الـ endpoint لإضافة فاتورة جديدة إلى قائمة فواتير فني معين بناءً على معرفه، مع تحديث المخزون والمبلغ المستحق.
 *     tags:
 *       - Technicians
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الفني
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 description: قائمة العناصر المراد إضافتها إلى الفاتورة
 *                 items:
 *                   type: object
 *                   required:
 *                     - partId
 *                     - partName
 *                     - quantity
 *                     - price
 *                     - remainingAmount
 *                   properties:
 *                     partId:
 *                       type: string
 *                       description: معرف القطعة الإلكترونية
 *                       example: "507f191e810c19729de860ea"
 *                     partName:
 *                       type: string
 *                       description: اسم القطعة
 *                       example: "بطارية"
 *                     quantity:
 *                       type: integer
 *                       description: الكمية المطلوبة
 *                       example: 2
 *                     price:
 *                       type: number
 *                       description: سعر الوحدة
 *                       example: 50.00
 *                     paidAmount:
 *                       type: number
 *                       description: المبلغ المدفوع (اختياري، يفترض 0 إذا لم يُحدد)
 *                       example: 20.00
 *                     remainingAmount:
 *                       type: number
 *                       description: المبلغ المتبقي
 *                       example: 80.00
 *               date:
 *                 type: string
 *                 format: date
 *                 description: تاريخ الفاتورة (اختياري، يتم استخدام التاريخ الحالي إذا لم يُحدد)
 *                 example: "2025-03-26"
 *     responses:
 *       200:
 *         description: تم إضافة الفاتورة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     invoices:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           partId:
 *                             type: string
 *                           partName:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           price:
 *                             type: number
 *                           paidAmount:
 *                             type: number
 *                           remainingAmount:
 *                             type: number
 *                           date:
 *                             type: string
 *                             format: date-time
 *                     totalDueAmount:
 *                       type: number
 *                       example: 80.00
 *       400:
 *         description: خطأ في الطلب (مثل بيانات غير صالحة أو مخزون غير كافٍ)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Insufficient stock for بطارية. Available: 1, Requested: 2"
 *       404:
 *         description: الفني أو القطعة الإلكترونية غير موجودة
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Technician not found"
 */
router.post('/:id/invoices', technicianController.addInvoiceToTechnician);


/**
 * @swagger
 * /technicians/{id}/payment:
 *   post:
 *     summary: تسجيل دفعة مالية لفني
 *     description: يُستخدم هذا الـ endpoint لتسجيل دفعة مالية لفني معين بناءً على معرفه، حيث يتم توزيع المبلغ المدفوع على الفواتير ذات المبالغ المتبقية وتحديث الدين الكلي.
 *     tags:
 *       - Technicians
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الفني
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: المبلغ المدفوع
 *                 example: 50.00
 *     responses:
 *       200:
 *         description: تم تسجيل الدفعة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     invoices:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           partId:
 *                             type: string
 *                             example: "507f191e810c19729de860ea"
 *                           partName:
 *                             type: string
 *                             example: "بطارية"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 50.00
 *                           paidAmount:
 *                             type: number
 *                             example: 20.00
 *                           remainingAmount:
 *                             type: number
 *                             example: 30.00
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-03-26T10:00:00Z"
 *                     totalDebt:
 *                       type: number
 *                       description: إجمالي الدين المتبقي بعد الدفعة
 *                       example: 30.00
 *       400:
 *         description: خطأ في الطلب (مثل بيانات غير صالحة)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid amount provided"
 *       404:
 *         description: الفني غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Technician not found"
 */
router.post('/:id/payment', technicianController.makePayment);


/**
 * @swagger
 * /technicians/{id}/pay:
 *   post:
 *     summary: دفع مبلغ لتقليل دين الفني
 *     description: يُستخدم هذا الـ endpoint لتسجيل دفعة مالية لتقليل المبلغ المستحق الكلي لفني معين بناءً على معرفه.
 *     tags:
 *       - Technicians
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الفني
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: المبلغ المدفوع لتقليل الدين
 *                 example: 50.00
 *     responses:
 *       200:
 *         description: تم تسجيل الدفعة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     totalDueAmount:
 *                       type: number
 *                       description: المبلغ المستحق المتبقي بعد الدفع
 *                       example: 150.00
 *                     invoices:
 *                       type: array
 *                       description: قائمة الفواتير (غير متأثرة بهذا الـ endpoint)
 *                       items:
 *                         type: object
 *                         properties:
 *                           partId:
 *                             type: string
 *                           partName:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           price:
 *                             type: number
 *                           paidAmount:
 *                             type: number
 *                           remainingAmount:
 *                             type: number
 *                           date:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: خطأ في الطلب (مثل مبلغ غير صالح أو يتجاوز الدين الكلي)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Payment amount exceeds total due amount"
 *       404:
 *         description: الفني غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Technician not found"
 */
router.post('/:id/pay', technicianController.payAmountToTechnician); // مسار جديد للسداد

/**
 * @swagger
 * /api/technicians/invoices/filter:
 *   get:
 *     summary: Filter invoices by date range
 *     description: Retrieve invoices within a specified date range.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the range (YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the range (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: List of invoices filtered by date range.
 *       400:
 *         description: Invalid query parameters.
 */
router.get('/invoices/filter', technicianController.filterInvoices);

/**
 * @swagger
 * /api/technicians/export/pdf:
 *   get:
 *     summary: Export invoices as PDF
 *     description: Export all invoices as a PDF file.
 *     responses:
 *       200:
 *         description: PDF file containing invoices.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error.
 */
router.get('/export/pdf', technicianController.exportInvoicesPDF);


router.get('/:id', technicianController.getTechnicianById);
/**
 * @swagger
 * /api/technicians/export/excel:
 *   get:
 *     summary: Export invoices as Excel
 *     description: Export all invoices as an Excel file.
 *     responses:
 *       200:
 *         description: Excel file containing invoices.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error.
 */
router.get('/export/excel', technicianController.exportInvoicesExcel);
/**
 * @swagger
 * /api/technicians/invoices/summary:
 *   get:
 *     summary: Get invoices summary
 *     description: Retrieve a summary of all invoices.
 *     responses:
 *       200:
 *         description: Summary of invoices.
 *       500:
 *         description: Internal server error.
 */
router.get('/invoices/summary', technicianController.getInvoicesSummary);

/**
 * @swagger
 * /api/technicians/invoices/filter/technician/{technicianId}:
 *   get:
 *     summary: Filter invoices by technician
 *     description: Retrieve invoices for a specific technician.
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the technician.
 *     responses:
 *       200:
 *         description: List of invoices for the specified technician.
 *       404:
 *         description: Technician not found.
 */

router.get('/invoices/filter/technician/:technicianId', technicianController.filterInvoicesByTechnician);

/**
 * @swagger
 * /api/technicians/invoices/export/pdf:
 *   get:
 *     summary: Export invoices summary as PDF
 *     description: Export a summary of all invoices as a PDF file.
 *     responses:
 *       200:
 *         description: PDF file containing invoices summary.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error.
 */
router.get('/invoices/export/pdf', technicianController.exportInvoicesSummaryPDF);

/**
 * @swagger
 * /api/technicians/invoices/export/excel:
 *   get:
 *     summary: Export invoices summary as Excel
 *     description: Export a summary of all invoices as an Excel file.
 *     responses:
 *       200:
 *         description: Excel file containing invoices summary.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error.
 */
router.get('/invoices/export/excel', technicianController.exportInvoicesSummaryExcel);

/**
 * @swagger
 * /api/technicians/invoices/filter/status:
 *   get:
 *     summary: Filter invoices by status (debtor/creditor)
 *     description: Retrieve invoices filtered by debtor or creditor status.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [debtor, creditor]
 *         required: true
 *         description: Status to filter by (debtor or creditor).
 *     responses:
 *       200:
 *         description: List of invoices filtered by status.
 *       400:
 *         description: Invalid query parameter.
 */
router.get('/invoices/filter/status', technicianController.filterInvoicesByStatus);

/**
 * @swagger
 * /api/technicians/invoices/notifications:
 *   get:
 *     summary: Send late invoices notifications
 *     description: Send email notifications for late invoices.
 *     responses:
 *       200:
 *         description: Notifications sent successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/invoices/notifications', technicianController.sendLateInvoicesNotifications);

/**
 * @swagger
 * /api/technicians/statistics:
 *   get:
 *     summary: Get general statistics
 *     description: Retrieve general statistics about technicians and invoices.
 *     responses:
 *       200:
 *         description: General statistics.
 *       500:
 *         description: Internal server error.
 */
router.get('/statistics', technicianController.getGeneralStatistics);

module.exports = router;