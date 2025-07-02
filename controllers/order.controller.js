import { createRazorpayInstance } from "../config/razorPay.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";



// Create an instance of Razorpay
const razorpayInstance = createRazorpayInstance();

//Place an order
const placeOrder = async (req, res) => {
    try {

        const { userId, items, amount, address } = req.body;

        const options = {
            amount: Math.round(amount * 100 * 80), // Convert to rupees
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
            payment_capture: 1,
        }

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Save to MongoDB only after successful Razorpay order creation
        const newOrder = await Order({
            userId,
            items,
            amount,
            address,
            razorpayOrderId: razorpayOrder.id,
        });

        await newOrder.save();
        await User.findByIdAndUpdate(userId, { cartData: {} });

        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            razorpayOrder,
            newOrder,
        });
       

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message,
        });
    }
}

const verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)

    hmac.update(order_id + '|' + payment_id)

    const generated_signature = hmac.digest('hex');

    if (generated_signature === signature) {
        const order = await Order.findOne({ razorpayOrderId: order_id });
        const finalOrder = await Order.findByIdAndUpdate(order._id, {payment:true});
        // Payment is verified
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            orderId: finalOrder._id,
        });
    } else {
        const order = await Order.findOne({ razorpayOrderId: order_id });
        const finalOrder = await Order.findByIdAndDelete(order._id);
        // Payment verification failed
        return res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });
    }
}

//user order for frontend
const userOrder = async (req, res) => {
    try {
        const order = await Order.find({ userId: req.body.userId });
        res.json({
            success: true,
            message: "User orders fetched successfully",
            data:order,  
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message,
        });
    }
}

//listing all orders
const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
        res.json({
            success: true,
            message: "All orders fetched successfully",
            data: orders,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({  
            success: false,
            message: "Failed to fetch all orders",
            error: error.message,
        }); 
    }
}

//api for updating order status
const updateOrderStatus = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({
            success: true,
            message: "Order status updated successfully",
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message,
        })
    }
}


export{
    placeOrder,
    verifyPayment,
    userOrder,
    allOrders,
    updateOrderStatus
}

