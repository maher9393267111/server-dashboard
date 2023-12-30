const Employee = require("../models/employee");
const tryCatch = require("./utils/tryCatch");

const getAllEmployees = tryCatch(async (req, res) => {
  const employees = await Employee.find();
  res.status(200).json(employees);
});

const getEmployeeById = tryCatch(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);
  res.status(200).json(employee);
});

const getEmployeeByName = tryCatch(async (req, res) => {
  const { name } = req.params;
  const employee = await Employee.find().byFullName(name);
  res.status(200).json(employee);
});

const updateEmployee = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await Employee.findByIdAndUpdate(id, data);
  res.status(200).json({ ok: true });
});

const deleteEmployee = tryCatch(async (req, res) => {
  const { id } = req.params;
  await Employee.findByIdAndDelete(id);
  res.status(200).json({ ok: true });
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByName,
  updateEmployee,
  deleteEmployee,
};
