import { Food } from "../models/food.model.js";
import fs from 'fs'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//add food item
const addFood = asyncHandler (async (req,res) => {
    
    const {name, description, price, category} = req.body

    const foodImage = req.file.filename;

    if (!foodImage) {
        throw new ApiError(400, 'Food Image is required')
    }

    const food = await Food.create({
        name,
        description,
        price,
        category,
        image: foodImage
    })

    try {
        await food.save();
        res.status(200).json(
            new ApiResponse(200, food, "Food added succesfully")
        )
    } catch (error) {
        throw new ApiError(500,"Failed to add food item")   
    }

})

//get food list
const foodList = asyncHandler (async (req,res) => {
    try {
        const foods = await Food.find({})
        res.status(200).json(new ApiResponse(200,foods,"All food item  fetched successfully"))
    } catch (error) {
        throw new ApiError(500,"Food item can't be fetched")
    }
})

//remove food item
const removeFood = asyncHandler (async (req,res) => {
    try {
        const food = await Food.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`,()=>{})

        await Food.findByIdAndDelete(req.body.id)
        res.status(200).json(new ApiResponse(200,{},'Food Item Removed'))
    } catch (error) {
        throw new ApiError(500,`Item Removal Failed ${error}`)
    }
})


export {addFood, foodList, removeFood}