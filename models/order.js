const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: String,
        address: { type: String, required: true },
        birthday: Date,

        shippedDate: { type: Date },
        status: { type: String, default: 'waiting' },
        description: { type: String },
        shippingAddress: { type: String, required: true },
        paymentType: { type: String, default: 'CASH' },
        orderDetails: [
            {
                image: { type: String },
                name: { type: String },
                price: { type: Number },
                productId: { type: Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number },
                size: { type: String },
                _id: false,
            },
        ],
    },
    { timestamps: { updatedAt: false } },
);

const Order = model('Order', orderSchema);
module.exports = Order;
