const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  sender: {
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  receiver: {
    type: Schema.ObjectId,
    ref: 'Employee'
  },


  notificationType: {
    type: String,
    // enum: ['follow', 'like', 'comment', 'mention'],
  },

  date: Date,
  notificationData: Object,
  read: {
    type: Boolean,
    default: false,
  },
});

const notificationModel = mongoose.model('notification', NotificationSchema);
module.exports = notificationModel;
