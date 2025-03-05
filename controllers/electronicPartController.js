const ElectronicPart = require('../models/ElectronicPart');

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

exports.updatePart = async (req, res) => {
  const { id } = req.params;
  try {
    const part = await ElectronicPart.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(part);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePart = async (req, res) => {
  const { id } = req.params;
  try {
    await ElectronicPart.findByIdAndDelete(id);
    res.status(200).json({ message: 'Part deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.filterParts = async (req, res) => {
  const { name } = req.query;
  try {
    const parts = await ElectronicPart.find({ name: new RegExp(name, 'i') });
    res.status(200).json(parts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const { generatePDF } = require('../services/pdfService');
const { generateExcel } = require('../services/excelService');

exports.exportPartsPDF = async (req, res) => {
  try {
    const parts = await ElectronicPart.find();
    generatePDF(parts, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportPartsExcel = async (req, res) => {
  try {
    const parts = await ElectronicPart.find();
    await generateExcel(parts, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};