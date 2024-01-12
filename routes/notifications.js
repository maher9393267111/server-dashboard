const express = require('express');
const router = express.Router();

const { getAllNotifications, UpdateNotificationToRead, DeleteNotification } = require('../controllers/notifications');
const allowRoles = require('../middleware/allowRoles');
const auth = require('../middleware/auth');

router.get('/', auth, allowRoles('admin', 'staff'), getAllNotifications);

router.post('/read', auth, allowRoles('admin', 'staff'), UpdateNotificationToRead);

router.delete('/delete', auth, allowRoles('admin', 'staff'), DeleteNotification);

module.exports = router;
