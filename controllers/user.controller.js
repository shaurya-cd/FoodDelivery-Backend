import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Resgister user

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
} 

const registerUser = asyncHandler( async (req , res) => {

    const { name, email, password } = req.body

    try {
        const exists = await User.findOne({email});
        if (exists) {
            return res.status(409).json({success:false,message:"User already exists"})
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({success:false,message:"PLease enter valid email"})
        }
        if (password.length<8) {
            return res.status(40).json({success:false,message:"Please enter strong password"})
        }

        //hasshing password
        const salt = await bcrypt.genSalt(10)
        const hashedPasssword = await bcrypt.hash(password,salt)

        //creating new user
        const newUser = await User.create({
            name,
            email,
            password:hashedPasssword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.status(200).json(new ApiResponse(200,token,"User resgister successfully"))

    } catch (error) {
        console.log(error)
        res.status(400).json({success:false,message:"Failed to Register"})
    }
})

const loginUser = asyncHandler( async (req,res) => {

    const {email, password} = req.body

    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch) {
            return res.status(400).json({success:false,message:"Invalid Credentials"})
        }

        const token = createToken(user._id)
        
        return res.status(200).json(new ApiResponse(200,token,"Logged successfully"))

    } catch (error) {
        console.log(error)
        res.status(400).json({success:false,message:"Login Failed"})
    }
})


export{
    registerUser,loginUser
}