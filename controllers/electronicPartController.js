const ElectronicPart = require('../models/ElectronicPart');

// @desc    الحصول على جميع القطع الإلكترونية
// @route   GET /api/electronicParts
// @access  عام
exports.getElectronicParts = async (req, res) => {
    try {
        const parts = await ElectronicPart.find(); // جلب جميع القطع الإلكترونية
        res.status(200).json({
            success: true,
            count: parts.length,
            data: parts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب القطع الإلكترونية',
            error: err.message,
        });
    }
};

// @desc    إضافة قطعة إلكترونية جديدة
// @route   POST /api/electronicParts
// @access  خاص
exports.addPart = async (req, res) => {
    const { name, quantity, purchasePrice, sellingPrice } = req.body;
    try {
        const part = new ElectronicPart({ name, quantity, purchasePrice, sellingPrice });
        await part.save();
        res.status(201).json(part);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    تحديث قطعة إلكترونية
// @route   PUT /api/electronicParts/:id
// @access  خاص
exports.updatePart = async (req, res) => {
    const { id } = req.params;
    try {
        const part = await ElectronicPart.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(part);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    حذف قطعة إلكترونية
// @route   DELETE /api/electronicParts/:id
// @access  خاص
exports.deletePart = async (req, res) => {
    const { id } = req.params;
    try {
        await ElectronicPart.findByIdAndDelete(id);
        res.status(200).json({ message: 'Part deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    تصفية القطع الإلكترونية حسب الاسم
// @route   GET /api/electronicParts/filter
// @access  عام
exports.filterParts = async (req, res) => {
    const { name } = req.query;
    try {
        const parts = await ElectronicPart.find({ name: new RegExp(name, 'i') });
        res.status(200).json(parts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    تصدير القطع الإلكترونية كملف PDF
// @route   GET /api/electronicParts/export/pdf
// @access  خاص
exports.exportPartsPDF = async (req, res) => {
    try {
        const parts = await ElectronicPart.find();
        generatePDF(parts, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    تصدير القطع الإلكترونية كملف Excel
// @route   GET /api/electronicParts/export/excel
// @access  خاص
exports.exportPartsExcel = async (req, res) => {
    try {
        const parts = await ElectronicPart.find();
        await generateExcel(parts, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};