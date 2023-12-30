const Customer = require("../models/customer");
const tryCatch = require("./utils/tryCatch");

const getAllCustomers = tryCatch(async (req, res) => {
  const customers = await Customer.find();
  res.status(200).json(customers);
});

const getCustomerById = tryCatch(async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  res.status(200).json(customer);
});

const getCustomerByName = tryCatch(async (req, res) => {
  const { name } = req.params;
  const customer = await Customer.find().byFirstName(name);
  res.status(200).json(customer);
});

const createCustomer = tryCatch(async (req, res) => {
  const data = req.body;
  const customer = new Customer(data);
  await customer.save();
  res.status(200).json(customer);
});

const updateCustomer = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json(customer);
});

const deleteCustomer = tryCatch(async (req, res) => {
  const { id } = req.params;
  await Customer.findByIdAndDelete(id);
  res.status(200).json({ ok: true });
});

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByName,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
