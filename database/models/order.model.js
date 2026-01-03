import mongoose, { Types } from 'mongoose';

const schema = new mongoose.Schema({
    user: { type: Types.ObjectId, ref: 'User', },
    orderItems: [{
        product: { type: Types.ObjectId, ref: 'Product', },
        quantity: Number,
        price: Number
    }],
    totalOrderPrice: Number,
    shippingAddress: {
        street: String,
        city: String,
        phone: String,
    },
paymentType: {
    type: String,
    enum: ['CARD', 'CASH'],
    default: 'CASH'
},
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliverdAt: Date,
}, { timestamps: true }
)

export const Order = mongoose.model('Order', schema);