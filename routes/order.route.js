import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { allOrders, placeOrder,updateOrderStatus,userOrder,verifyPayment } from "../controllers/order.controller.js";


const orderRouter = Router()

// Order routes
orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/verify', authMiddleware, verifyPayment);
orderRouter.post('/get', authMiddleware, userOrder);
orderRouter.get('/all', allOrders);
orderRouter.post('/status', updateOrderStatus);

// User order route
export default orderRouter;