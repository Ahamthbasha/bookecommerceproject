const User=require('../models/userModel')
const isLogin=async(req,res,next)=>{
    try{
        if(!req.session.user){
            res.redirect("/login")
        }else{
            next()
        }
    }
    catch(error){
        console.log(error)
    }
}
const isLogout=async(req,res,next)=>{
    try {
        if(req.session.user){
            res.redirect("/")
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports={isLogin,isLogout}