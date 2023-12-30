const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getSoldOrderByDay,
    getSoldOrderByWeek,
    getSoldOrderByMonth,
    getStaticsByMonth
} = require('../controllers/orders');
const allowRoles = require('../middleware/allowRoles');

const auth = passport.authenticate('jwt', { session: false });

// Get all orders sold in year  by each category
router.get('/statics/:category', auth, allowRoles('admin', 'staff'), getStaticsByMonth);

router.get('/', auth, allowRoles('admin', 'staff'), getAllOrders);
router.get('/:id', auth, allowRoles('admin', 'staff'), getOrderById);
router.post('/', auth, allowRoles('admin'), createOrder);
router.post('/v1', createOrder);
router.put('/:id', auth, allowRoles('admin'), updateOrder);
router.delete('/:id', auth, allowRoles('admin'), deleteOrder);

//Hiển thị tất cả các mặt hàng được bán trong hôm nay
router.get('/sold/today', auth, allowRoles('admin', 'staff'), getSoldOrderByDay);

//Hiển thị tất cả các mặt hàng được bán trong tuần nay
router.get('/sold/week', auth, allowRoles('admin', 'staff'), getSoldOrderByWeek);

//Hiển thị tất cả các mặt hàng được bán trong tuần nay
router.get('/sold/month', auth, allowRoles('admin', 'staff'), getSoldOrderByMonth);


module.exports = router;
