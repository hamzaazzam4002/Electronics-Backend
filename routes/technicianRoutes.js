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

router.get('/', technicianController.getTechnicians);
/**
 * @swagger
 * /api/technicians/{id}/invoices:
 *   post:
 *     summary: Add an invoice for a technician
 *     description: Add an invoice for a specific technician.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the technician.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partName:
 *                 type: string
 *                 description: Name of the part.
 *               quantity:
 *                 type: number
 *                 description: Quantity of the part.
 *               price:
 *                 type: number
 *                 description: Price of the part.
 *               amountPaid:
 *                 type: number
 *                 description: Amount paid by the technician.
 *               remainingAmount:
 *                 type: number
 *                 description: Remaining amount to be paid.
 *               totalRemaining:
 *                 type: number
 *                 description: Total remaining amount.
 *               isDebtor:
 *                 type: boolean
 *                 description: Whether the technician is a debtor.
 *     responses:
 *       201:
 *         description: Invoice added successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Technician not found.
 */
// router.post('/:id/invoices', technicianController.addInvoice);
router.post('/:id/invoices', technicianController.addInvoiceToTechnician);
router.post('/:id/payment', technicianController.makePayment);
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