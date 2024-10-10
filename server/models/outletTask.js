const mongoose=require('mongoose')

const outletTasSchema=new mongoose.Schema({
    taskName:{
        type:String,
        required:true,
    },
    taskDescription:{
        type:String,
    },
    audioData:{
        type:Buffer,
    },
    images:{
        type:[Buffer],
    },
    date:{
        type:Date,
        required:true,
    },
    selectEmployees:{
        type: [{ username: String, userId: mongoose.Schema.Types.ObjectId ,status:{
            type:String,
            default:"pending"
        }}],
        required:true,
    },
    hotelId:{
        type:String,
        required:true,
    }
})

const OutletTask=mongoose.model("outlettask",outletTasSchema)

module.exports=OutletTask