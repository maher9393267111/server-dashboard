const Supplier = require("../models/supplier");
const tryCatch = require("./utils/tryCatch");

const getAllSuppliers = tryCatch(async (req, res) => {
  const suppliers = await Supplier.find();
  res.status(200).json(suppliers);
});

const getSupplierById = tryCatch(async (req, res) => {
  const { id } = req.params;
  const supplier = await Supplier.findById(id);
  res.status(200).json(supplier);
});

const getSupplierByName = tryCatch(async (req, res) => {
  const { name } = req.params;
  const supplier = await Supplier.find().byName(name);
  res.status(200).json(supplier);
});

const createSupplier = tryCatch(async (req, res) => {
  const data = req.body;
  const supplier = new Supplier(data);
  await supplier.save();
  res.status(200).json(supplier);
});

const updateSupplier = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json(supplier);
});

const deleteSupplier = tryCatch(async (req, res) => {
  const { id } = req.params;
  await Supplier.findByIdAndDelete(id);
  res.status(200).json({ ok: true });
});

module.exports = {
  getAllSuppliers,
  getSupplierById,
  getSupplierByName,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
