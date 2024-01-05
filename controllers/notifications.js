const Customer = require('../models/customer');
const Notification = require('../models/notification')
const { count } = require('../models/notification');
const Employee = require("../models/employee");
const tryCatch = require('./utils/tryCatch');
const socketHandler = require('../helpers/socket');

const getAllNotifications = tryCatch(async (req, res) => {
   // console.log('AUTH JWT DATA--->', req.user);

   const receiver = req.query.receiver


    const userNotifications = await Notification.find({receiver:receiver})
    .populate({
        path: 'sender',
         path:'receiver'
    });

    res.status(200).json(userNotifications);
});

const getAllCustomersPagination = tryCatch(async (req, res) => {
    const { page, size } = req.query;
    console.log(page, size);
    const pageNum = Number(page);
    const pageSize = Number(size);
    let customers = [];
    const totalDocs = await Customer.countDocuments();
    const totalPages = Math.ceil(totalDocs / pageSize);
    if (pageNum === 1) {
        customers = await Customer.find().limit(pageSize);
    } else {
        const skips = pageSize * (pageNum - 1);
        customers = await Customer.find().skip(skips).limit(pageSize);
    }
    res.status(200).json({ customers: customers, count: totalDocs });
});

const getCustomerById = tryCatch(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    res.status(200).json(customer);
});

const getCustomerByName = tryCatch(async (req, res) => {
    const { name } = req.params;
    // then add cutomer_id in params to create new  serch customer
    const customer = await Customer.find().byFirstName(name).populate({
        path: 'employe_id',
    });

    // get employe if exist if not exist  create it with pending it

    if (customer?.length === 0) {
        const data = {
            firstName: req.params.name,
            status: 'pending',
            email: `${req.params.name}@gmail.com`,
            employe_id: req.user._id,
        };
        const customernew = new Customer(data);

        await customernew.save();

        res.status(200).json({ message: 'pending customer created', customernew });
    } else {
        res.status(200).json(customer);
    }
});

const createCustomer = tryCatch(async (req, res) => {
    let data = req.body;

    //data.employe_id = parseInt(data.employe_id)
   // console.log('DATA', data);

    const customer = new Customer(data);
    await customer.save();






    // ----send notification to admin ---

//1-find admin id

const admin = await Employee.findOne().byRole("admin");
const sender = await Employee.findById(req.body.employe_id)
//admin _id 6598038926ffd999a2d66d85
console.log('AUTH AGENT sender'  ,sender ,req.body.employe_id );
    const notification = new Notification({
        sender: sender._id,
        receiver: admin._id,
        notificationType: 'add-customer',
        date: Date.now(),
        notificationData: {
          sender
         // image,
          ////filter: post.filter,
        },
      });

      await notification.save();
      socketHandler.sendNotification(req, {
        ...notification.toObject(),
        sender: {
          _id: sender._id,
          username: sender.username
          
        },
      });




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
    getAllNotifications
    // getAllCustomers,
    // getCustomerById,
    // getCustomerByName,
    // createCustomer,
    // updateCustomer,
    // deleteCustomer,
    // getAllCustomersPagination,
};
