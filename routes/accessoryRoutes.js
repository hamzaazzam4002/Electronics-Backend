const express = require('express');
const accessoryController = require('../controllers/accessoryController');

const router = express.Router();
/**
 * @swagger
 * /api/accessories:
 *   post:
 *     summary: Add a new accessory
 *     description: Add a new accessory with name, quantity, and price.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the accessory.
 *               quantity:
 *                 type: number
 *                 description: Quantity of the accessory.
 *               price:
 *                 type: number
 *                 description: Price of the accessory.
 *     responses:
 *       201:
 *         description: Accessory added successfully.
 *       400:
 *         description: Invalid input data.
 */

router.post('/', accessoryController.addAccessory);
/**
 * @swagger
 * /api/accessories/filter/name:
 *   get:
 *     summary: Filter accessories by name
 *     description: Retrieve accessories that match the provided name.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the accessory to filter by.
 *     responses:
 *       200:
 *         description: List of accessories filtered by name.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Accessory'
 *       400:
 *         description: Invalid query parameter.
 */

router.get('/filter/name', accessoryController.filterAccessoriesByName);

/**
 * @swagger
 * /accessories:
 *   get:
 *     summary: استرجاع قائمة الإكسسوارات
 *     description: هذا الـ endpoint يُستخدم لجلب قائمة بجميع الإكسسوارات المتوفرة في النظام.
 *     tags:
 *       - Accessories
 *     responses:
 *       200:
 *         description: تم استرجاع قائمة الإكسسوارات بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: معرف الإكسسوار
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: اسم الإكسسوار
 *                     example: "سماعات لاسلكية"
 *                   price:
 *                     type: number
 *                     description: سعر الإكسسوار
 *                     example: 29.99
 *       500:
 *         description: خطأ في الخادم الداخلي
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "حدث خطأ أثناء استرجاع الإكسسوارات"
 */
router.get('/', accessoryController.getAccessories); // إضافة المسار لجلب جميع الإكسسوارات

/**
 * @swagger
 * /api/accessories/filter/quantity:
 *   get:
 *     summary: Filter accessories by quantity range
 *     description: Retrieve accessories within a specified quantity range.
 *     parameters:
 *       - in: query
 *         name: minQuantity
 *         schema:
 *           type: number
 *         required: true
 *         description: Minimum quantity of the accessory.
 *       - in: query
 *         name: maxQuantity
 *         schema:
 *           type: number
 *         required: true
 *         description: Maximum quantity of the accessory.
 *     responses:
 *       200:
 *         description: List of accessories filtered by quantity range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Accessory'
 *       400:
 *         description: Invalid query parameters.
 */
router.get('/filter/quantity', accessoryController.filterAccessoriesByQuantity);
/**
 * @swagger
 * /api/accessories/filter/price:
 *   get:
 *     summary: Filter accessories by price range
 *     description: Retrieve accessories within a specified price range.
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         required: true
 *         description: Minimum price of the accessory.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         required: true
 *         description: Maximum price of the accessory.
 *     responses:
 *       200:
 *         description: List of accessories filtered by price range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Accessory'
 *       400:
 *         description: Invalid query parameters.
 */
router.get('/filter/price', accessoryController.filterAccessoriesByPrice);

module.exports = router;