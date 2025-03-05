const Accessory = require('../models/Accessory');

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

exports.filterAccessoriesByName = async (req, res) => {
  const { name } = req.query;
  try {
    const accessories = await Accessory.find({ name: new RegExp(name, 'i') });
    res.status(200).json(accessories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.filterAccessoriesByQuantity = async (req, res) => {
  const { minQuantity, maxQuantity } = req.query;
  try {
    const accessories = await Accessory.find({
      quantity: { $gte: minQuantity, $lte: maxQuantity },
    });
    res.status(200).json(accessories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.filterAccessoriesByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    const accessories = await Accessory.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
    res.status(200).json(accessories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};