const express = require('express');
const electronicPartController = require('../controllers/electronicPartController');
const authController = require('../controllers/authController');

const router = express.Router();

// حماية جميع المسارات باستخدام verifyToken
router.use(authController.verifyToken);

router.get('/', electronicPartController.getElectronicParts);

/**
 * @swagger
 * /api/parts:
 *   post:
 *     summary: Add a new electronic part
 *     description: Add a new electronic part with name, quantity, purchase price, and selling price.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the electronic part.
 *               quantity:
 *                 type: number
 *                 description: Quantity of the electronic part.
 *               purchasePrice:
 *                 type: number
 *                 description: Purchase price of the electronic part.
 *               sellingPrice:
 *                 type: number
 *                 description: Selling price of the electronic part.
 *     responses:
 *       201:
 *         description: Electronic part added successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized (missing or invalid token).
 */
router.post('/', electronicPartController.addPart);

/**
 * @swagger
 * /api/parts/{id}:
 *   put:
 *     summary: Update an electronic part
 *     description: Update an existing electronic part by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the electronic part to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the electronic part.
 *               quantity:
 *                 type: number
 *                 description: Updated quantity of the electronic part.
 *               purchasePrice:
 *                 type: number
 *                 description: Updated purchase price of the electronic part.
 *               sellingPrice:
 *                 type: number
 *                 description: Updated selling price of the electronic part.
 *     responses:
 *       200:
 *         description: Electronic part updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       404:
 *         description: Electronic part not found.
 */
router.put('/:id', electronicPartController.updatePart);

/**
 * @swagger
 * /api/parts/{id}:
 *   delete:
 *     summary: Delete an electronic part
 *     description: Delete an electronic part by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the electronic part to delete.
 *     responses:
 *       200:
 *         description: Electronic part deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       404:
 *         description: Electronic part not found.
 */
router.delete('/:id', electronicPartController.deletePart);

/**
 * @swagger
 * /api/parts/filter:
 *   get:
 *     summary: Filter electronic parts by name
 *     description: Retrieve electronic parts that match the provided name.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the electronic part to filter by.
 *     responses:
 *       200:
 *         description: List of electronic parts filtered by name.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ElectronicPart'
 *       400:
 *         description: Invalid query parameter.
 *       401:
 *         description: Unauthorized (missing or invalid token).
 */
router.get('/filter/name', electronicPartController.filterParts);

module.exports = router;