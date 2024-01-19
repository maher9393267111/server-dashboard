const Customer = require('../models/customer');
const Notification = require('../models/notification');
const { count } = require('../models/notification');
const Employee = require('../models/employee');
const tryCatch = require('./utils/tryCatch');
const socketHandler = require('../helpers/socket');

const getAllNotifications = tryCatch(async (req, res) => {
    // console.log('AUTH JWT DATA--->', req.user);

    const receiver = req.query.receiver;

    const userNotifications = await Notification.find({ receiver: req.user._id, read: false }).sort({createdAt:'desc'});
    // .populate({
    //     path: 'sender',
    //     path: 'receiver',
    // });

    res.status(200).json(userNotifications);
});

const UpdateNotificationToRead = tryCatch(async (req, res) => {
    // console.log('AUTH JWT DATA--->', req.user);

    // const receiver = req.query.receiver;
    const user = req.user;
    const { receiver, notificationId } = req.body;

    console.log("req>BODY" , req.body.notificationId)

   // const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });


    //delete notify -->
  const  notification = await Notification.findByIdAndDelete(notificationId);


    res.status(200).json(notification);
});

const DeleteNotification = tryCatch(async (req, res) => {
    // console.log('AUTH JWT DATA--->', req.user);

    // const receiver = req.query.receiver;
    const user = req.user;
    const { receiver, notificationId } = req.body;

    const notification = await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: 'Notification Deleted successfully' });
});

module.exports = {
    getAllNotifications,
    UpdateNotificationToRead,
    DeleteNotification,
};
