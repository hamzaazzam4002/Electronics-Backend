const Accessory = require('../models/Accessory');

// إضافة إكسسوار جديد
exports.addAccessory = async (req, res) => {
  const { name, quantity, price } = req.body;
  try {
    const accessory = new Accessory({ name, quantity, price });
    await accessory.save();
    res.status(201).json(accessory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// جلب جميع الإكسسوارات
exports.getAccessories = async (req, res) => {
  try {
    const accessories = await Accessory.find();
    res.status(200).json({
      success: true,
      count: accessories.length,
      data: accessories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// تصفية الإكسسوارات حسب الاسم
exports.filterAccessoriesByName = async (req, res) => {
  const { name } = req.query;
  try {
    const accessories = await Accessory.find({ name: new RegExp(name, 'i') });
    res.status(200).json({
      success: true,
      count: accessories.length,
      data: accessories,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// تصفية الإكسسوارات حسب الكمية
exports.filterAccessoriesByQuantity = async (req, res) => {
  const { minQuantity, maxQuantity } = req.query;
  try {
    const accessories = await Accessory.find({
      quantity: { $gte: minQuantity, $lte: maxQuantity },
    });
    res.status(200).json({
      success: true,
      count: accessories.length,
      data: accessories,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// تصفية الإكسسوارات حسب السعر
exports.filterAccessoriesByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    const accessories = await Accessory.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
    res.status(200).json({
      success: true,
      count: accessories.length,
      data: accessories,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};