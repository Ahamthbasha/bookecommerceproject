const mongoose=require("mongoose")
const env=require("dotenv").config()

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("db is connected")
    }
    catch(error){
        console.log("error message",error)
        process.exit(1)
    }
}
module.exports=connectDB