import { Router } from "express";
import { addToCart, removeFromCart, fetchCart } from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const cartRouter = Router()

cartRouter.route('/add').post(authMiddleware,addToCart)
cartRouter.route('/remove').post(authMiddleware,removeFromCart)
cartRouter.route('/fetch').post(authMiddleware,fetchCart)

export default cartRouter;
