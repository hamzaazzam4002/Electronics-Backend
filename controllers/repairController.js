const Repair = require('../models/Repair');

exports.addRepair = async (req, res) => {
  const { customerName, mobile, issue, deliveryDate } = req.body;
  try {
    const repair = new Repair({ customerName, mobile, issue, deliveryDate });
    await repair.save();
    res.status(201).json(repair);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};