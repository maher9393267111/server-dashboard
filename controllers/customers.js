const Customer = require('../models/customer');
const Notification = require('../models/notification');
const { count } = require('../models/notification');
const Employee = require('../models/employee');
const tryCatch = require('./utils/tryCatch');
const socketHandler = require('../helpers/socket');

const getAllCustomers = tryCatch(async (req, res) => {
    console.log('AUTH JWT DATA--->', req.user);

    const customers = await Customer.find().populate({
        path: 'employe_id',
    });
    res.status(200).json(customers);
});

// only for admin

const getAllAgentCustomers = tryCatch(async (req, res) => {
    console.log('AUTH JWT DATA--->', req.user);

    const { page, size } = req.query;
    console.log(page, size);
    const pageNum = Number(page);
    const pageSize = Number(size);

    const status = req.query.status || '';
    console.log(status, 'STAAAAAAAAAAA');
    //status=accepted
    // customer find  condition with status

    let filter = {};

    filter.employe_id = req.user._id;

    console.log('req.user', req.user._id, 'query admin owner', filter);

    const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const sortBy = !req.query.sortBy ? '_id' : req.query.sortBy;

    console.log('sortBy 🌙🌙🌙', sortBy);

    const sort = {};

    if (sortBy.toLowerCase() === 'email') {
        sort['email'] = sortDirection;
    } else if (sortBy.toLowerCase() === 'firstName') {
        sort['firstName'] = sortDirection;
    } else {
        sort['_id'] = sortDirection;
    }

    console.log('FILTERRRRR', filter);

    let customers = [];
    //employe_id: req.user._id
    const totalDocs = await Customer.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / pageSize);
    if (pageNum === 1) {
        customers = await Customer.find(filter).sort(sort).limit(pageSize);
    } else {
        const skips = pageSize * (pageNum - 1);
        customers = await Customer.find(filter).sort(sort).skip(skips).limit(pageSize);
    }

    console.log('customer___>>>', customers);
    const io = req.app.get('socketio');
    io.sockets.emit('fetch', 'added new customer');
    //    io.sockets.in(receiver).emit('newPost', post);

    res.status(200).json({ customers: customers, count: totalDocs });
});

// admin show all customers

const getAllCustomersPagination = tryCatch(async (req, res) => {
    const { page, size ,employeid } = req.query;
    console.log(page, size);
    const pageNum = Number(page);
    const pageSize = Number(size);

    // customer status query if exist

    const status = req.query.status || '';
    console.log(status, 'STAAAAAAAAAAA');
    //status=accepted
    // customer find  condition with status

    let filter = {};
    if (req.query.status === 'accepted') {
        filter.status = 'accepted';
    } else if (req.query.status === 'pending') {
        filter.status = 'pending';
    } else if (req.query.status === 'rejected') {
        filter.status = 'rejected';
    } else if (req.query.status === 'admincustomers') {
        filter.employe_id = req.user._id;
    }
 

    console.log("EMPLOY🌐🌐🌐🌐🌐🌐EID" , filter)


//&& req.query.status
     if (employeid !== 'undefined'    ) {
        console.log("SSSSSSSSSSSSSSSSSTTT" ,req.query.status)
        filter.employe_id = employeid;
    }


    console.log("FILTER 🔸️🔷️🔶️🔸️🔷️🔶️" ,filter)
   







    console.log('req.user', req.user._id, 'query admin owner', filter);

    const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const sortBy = !req.query.sortBy ? '_id' : req.query.sortBy;

    console.log('sortBy 🌙🌙🌙', sortBy);

    const sort = {};

    if (sortBy === 'date') {
        sort['date'] = sortDirection;
    }

    if (sortBy === 'name') {
        sort['name'] = sortDirection;
    } else if (sortBy === 'email') {
        sort['email'] = sortDirection;
    } else if (sortBy === 'firstName') {
        sort['firstName'] = sortDirection;
    } else {
        sort['_id'] = sortDirection;
    }

    let customers = [];
    const totalDocs = await Customer.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / pageSize);
    if (pageNum === 1) {
        customers = await Customer.find(filter).sort(sort).limit(pageSize).populate({
            path: 'employe_id',
            select: 'fullName username '
           
        });
    } else {
        const skips = pageSize * (pageNum - 1);
        customers = await Customer.find(filter).sort(sort).skip(skips).limit(pageSize).populate({
            path: 'employe_id',
            select: 'fullName username '
           
        });
    }

    const io = req.app.get('socketio');
    io.sockets.emit('fetch', 'added new customer');
    //    io.sockets.in(receiver).emit('newPost', post);

    res.status(200).json({ customers: customers, count: totalDocs });
});

const getCustomerById = tryCatch(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    res.status(200).json(customer);
});

const getCustomerByName = tryCatch(async (req, res) => {
    const { name } = req.params;
    const { searchtype } = req.query;

    const user = req.user;

    const filter = {};

    if (searchtype === 'name') {
        filter.firstName = name;
    } else if (searchtype === 'ssn') {
        filter.ssn = name;
    }

    console.log('filterOBJ❤️❤️❤️', filter, searchtype, req.query);

    let customer = await Customer.find(filter);

    console.log('Customer founded', customer);

    // get employe if exist if not exist  create it with pending it

    if (customer?.length === 0) {
        const data = {
            firstName: searchtype === 'ssn' ? 'anemous' : req.params.name,
            status: 'pending',
            email: searchtype === 'ssn' ? 'anemous@gmail.com' : `${req.params.name}@gmail.com`,
            employe_id: user._id,
            ssn: searchtype === 'ssn' ? name : 0,
            SearchedBy: name
        };

        const customernew = new Customer(data);

        // notifay admin with socketio

        const customerAgent = await Employee.findById(req.user._id);
        const admin = await Employee.findOne({ roles:"admin" })
        //.byRole('admin');

        const notification = new Notification({
            sender: req.user_id,
            receiver: admin._id,
            notificationType: 'search_customer',
            date: Date.now(),
            notificationData: {
                senderData: req.user.username,
                text: 'hello',
                title: 'Search Customer',
                customer: "new customer created by seach",
                searchType:searchtype,

                myRole: req.user?.roles,
            },
        });


        await notification.save();

        const io = req.app.get('socketio');
        io.sockets.emit('search_customer', notification);

        await customernew.save();

        res.status(200).json({ message: false, customernew });
    } else {
        res.status(200).json({ message: true });
    }
});

const createCustomer = tryCatch(async (req, res) => {
    let data = req.body;

    //data.employe_id = parseInt(data.employe_id)
    // console.log('DATA', data);

    data.SearchedBy = data?.ssn

    const customer = new Customer(data);
    await customer.save();

    // ----send notification to admin ---

    //1-find admin id

    const admin = await Employee.findOne({roles:'admin'})
    //.byRole('admin');
    //const sender = await Employee.findById(req.body.employe_id)
    //admin _id 6598038926ffd999a2d66d85
    console.log('AUTH AGENT✅☑✔✅☑✔ sender', admin);

    const notification = new Notification({
        sender: req.user._id,
        receiver: admin._id,
        notificationType: 'add-customer',
        date: Date.now(),
        notificationData: {
            senderData: req.user.username,
            text: 'hello',
            title: 'Add Customer',
            customer: "new customer created by Form",
            searchType:"add_customer",

            myRole: req.user?.roles,
        },
    });

    await notification.save();

    const io = req.app.get('socketio');
    //   io.sockets.emit('fetch', 'added new customer');
    io.sockets.emit('createcustomer', notification);

    //   socketHandler.sendNotification(req, {
    //     ...notification.toObject(),
    //     sender: {
    //       _id: sender._id,
    //       username: sender.username

    //     },
    //   });

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

// ----update customer status by admin---

const updateCustomerStatus = tryCatch(async (req, res) => {
    const { status, note, agentId ,process } = req.body;

    console.log('Body', req.body);

    const { id } = req.params;

    // if status is rejected delete customer

    // if (status === 'rejected') {
    //     await Customer.findByIdAndDelete(id);
    //     res.status(200).json({ message: 'Customer deleted successfully' });
    // }

    // else only update customer status
    // else {
    const data = {
        status: status,
        process:process,
        note:note
    };


    const customer = await Customer.findByIdAndUpdate(id, data, { new: true });

    const customerAgent = await Employee.findById(agentId);
    const admin = await Employee.findOne({roles:'admin'})
    //.byRole('admin');

    const notification = new Notification({
        sender: admin?._id,
        receiver: agentId,
        notificationType: 'change_status',
        date: Date.now(),
        notificationData: {
            senderData: 'admin',
            text: note,
            title: 'your customer Status is changed',
            status: status,
            customer: customer,
            myRole: customerAgent?.roles,

            // image,
            ////filter: post.filter,
        },
    });

    await notification.save();

    const io = req.app.get('socketio');
    io.sockets.emit('status', notification);

    res.status(200).json({ message: 'Customer status is accepted', customer });

    // then send to this customer maked Agent notification tell him new status  of customer and update agent nnotifications and customers table

    // }
});

module.exports = {
    getAllCustomers,
    getCustomerById,
    getCustomerByName,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getAllCustomersPagination,
    getAllAgentCustomers,
    updateCustomerStatus,
};
