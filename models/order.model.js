import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        default: 'Food Processing',
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    payment: {
        type: String,
        default: false
    },
    razorpayOrderId:{
        type:String,
        required: true,
    }
},{timestamps: true});

export const Order = mongoose.model('Order', orderSchema);