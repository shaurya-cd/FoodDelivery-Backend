import { Router } from "express";
import { addFood, foodList, removeFood } from '../controllers/food.controller.js'
import { upload } from "../middleware/multer.middleware.js";

const foodRouter = Router()

foodRouter.route('/add').post(upload.single('image'), addFood)
foodRouter.route('/list').get(foodList)
foodRouter.route('/remove').post(removeFood)

export default foodRouter;