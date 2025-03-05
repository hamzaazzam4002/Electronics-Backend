const express = require('express');
const repairController = require('../controllers/repairController');

const router = express.Router();

/**
 * @swagger
 * /api/repairs:
 *   post:
 *     summary: Add a new repair request
 *     description: Add a new repair request with customer name, mobile, issue, and delivery date.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Name of the customer.
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the customer.
 *               issue:
 *                 type: string
 *                 description: Description of the issue.
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Expected delivery date (optional).
 *     responses:
 *       201:
 *         description: Repair request added successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post('/', repairController.addRepair);

module.exports = router;