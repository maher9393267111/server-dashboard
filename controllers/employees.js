const Employee = require('../models/employee');
const Customer = require('../models/customer');
const tryCatch = require('./utils/tryCatch');

const getAllEmployees = tryCatch(async (req, res) => {
    const { search } = req.query;

    console.log(typeof search, 'QUERYYYY');

    if (search !== 'undefined') {
        console.log(search, 'searchh');
        let employees = await Employee.find({
            $or: [{ username: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { phoneNumber: search }],
        });

        res.status(200).json(employees);
    } else {
        console.log('NOT SEARCH');
        const employees = await Employee.find({});
        res.status(200).json(employees);
    }

    // );
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

const getEmployeeByRole = tryCatch(async (req, res) => {
    const { role } = req.params;
    const employee = await Employee.findOne().byRole(role);
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

const getCustomersCount = async (req, res) => {
    try {
        // const { id } = req.params;

        const result = await Customer.aggregate([{ $group: { _id: '$employe_id', count: { $sum: 1 } } }]);

        const totalAgents = await Employee.countDocuments();
        const totalCustomers = await Customer.countDocuments();

        const labels = result.map((entry) => entry._id);
        const data = result.map((entry) => entry.count);

        // find agents names from model

        let agentsNames = [];

        for (const item of result) {
            //    console.log(item.count);

            let agentsingle = await Employee.findById(item._id).select('fullName');

            agentsNames.push({ data: agentsingle, count: item.count });
        }

        //  console.log('array', agentsNames);

        if (!result || result.length === 0) {
            res.status(404).json({ message: 'error' });
            return;
        }

        res.status(200).json({
            agentsNames,
            totalAgents,
            totalCustomers,
        });
    } catch (err) {
        //   console.log(err);
        if (err instanceof TypeError) {
            res.status(400).json(err);
            return;
        }
        res.status(500).json(err);
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    getEmployeeByName,
    updateEmployee,
    deleteEmployee,
    getEmployeeByRole,
    getCustomersCount,
};
