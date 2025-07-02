import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: [true, "Password id required"]
        },
        cartData:{
            type: Object,
            default:{}
        },
        refreshToken:{
            type: String
        }
    },{timestamps: true, minimize:false}
)

export const User = mongoose.model("User", userSchema)