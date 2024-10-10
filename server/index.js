const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const bcrypt=require('bcrypt')
const User=require("./models/users")
const jwt=require('jsonwebtoken')
const Hotel=require('./models/hotels')
const HotelUser=require('./models/hotelUsers')
const OutletTask=require('./models/outletTask')
const multer = require('multer')

const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))


const SECRET_KEY="8392yrhuwebfiuew4iuy5r382658hf"

mongoose.connect("mongodb://localhost:27017/dev_db")
.then(()=>console.log("Database Connected..."))


const upload = multer({
    storage: multer.memoryStorage(),
});

app.post("/",async (req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne(({email}))
    if(user){
        try{
            //const correctPassword=await bcrypt.compare(password,user.password)
            const correctPassword2=password===user.password
            if(correctPassword2){
                const userId=user._id
                const token=jwt.sign({userId},SECRET_KEY)
                res.json({token})
            }
            else{
                console.log("Invalid password")
            }
        }
        catch(err){console.log(err)}        
    }
    else{
        console.log("user not existed")
    }
})

app.post("/hotel",async(req,res)=>{
    const {token}=req.body
    if(!token){
        return res.json({message:"No token provided"})
    }
    try{
        const user=jwt.verify(token,SECRET_KEY)
        const userId=user.userId
        const hotel=await Hotel.findOne({userId})
        const hotelId=hotel._id
        res.json(hotelId)
    }
    catch(err){
        res.json({message:"Invalid token"})
    }
})

app.post("/hotelusers",async(req,res)=>{
    const {token,hotelId}=req.body
    if(!token){
        return res.json({message:"No token provided"})
    }
    try{
        jwt.verify(token,SECRET_KEY)
        const hotelUsers=await HotelUser.find({hotelId})
        res.json({hotelUsers})
    }
    catch(err){
        res.json({message:"Invalid token"})
    }
})


app.post("/createtask", upload.fields([{name:'audio',maxCount:1},{name:'images',maxCount:3}]),async(req,res)=>{
    try {
        const { taskName,taskDescription,date,selectEmployees,hotelId}=req.body;
        const images=req.files['images'].map(file => file.buffer)
        const audioData=req.files['audio'][0].buffer
        const parsedSelectEmployees = JSON.parse(selectEmployees)

        const outlettask=new OutletTask({
            taskName,
            taskDescription,
            audioData,
            images,
            date: new Date(date),
            selectEmployees: parsedSelectEmployees,
            hotelId
        });

        await outlettask.save();
        res.json({message:'Task created successfully',task:outlettask});
    }catch(error){
        console.log(error);
        res.json({message:'Error creating task'});
    }
});

app.post("/fetchtasks",async(req,res)=>{
    const {token}=req.body
    if(!token){
        return res.json({message:"No token provided"})
    }
    try{
        jwt.verify(token,SECRET_KEY)
        const tasks=await OutletTask.find({})
        res.json(tasks)
    }
    catch(err){
        res.json({message:"Invalid token"})
    }
})

app.listen(3001,()=>console.log("Server Created..."))