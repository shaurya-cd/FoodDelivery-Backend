import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

//app config
const app = express()
const port = process.env.PORT || 4000
dotenv.config({
    path: './.env'
})

//middleware
app.use(express.json({limit: "16kb"})) 
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors())

//db connection
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error ", error)
        throw error
    })

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${port}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!! ", err)
})


//Routes import
import foodRouter from './routes/food.route.js'
import userRouter from './routes/user.routes.js'
import cartRouter from './routes/cart.route.js'
import orderRouter from './routes/order.route.js'


//api endpoints
app.use('/api/v1/food',foodRouter)
app.use('/images',express.static('uploads'))
app.use('/api/v1/user',userRouter)
app.use('/api/v1/cart',cartRouter)
app.use('/api/v1/order',orderRouter)



//api working check
app.get('/', ( req, res )=>{
    res.send('API WORKING')
})