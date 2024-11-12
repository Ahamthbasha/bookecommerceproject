const argon2=require("argon2")
const nodemailer=require("nodemailer")
const env=require("dotenv").config()
const hashPassword=async(password)=>{
    try {
        const passwordHash=await argon2.hash(password)
        return passwordHash
    } catch (error) {
        console.log(error.message)
    }
}

const verifyEmail = async(email)=>{
    try {
        otp = generateOtp()

        console.log("Generated OTP:", otp);

       const trasporter =  nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: process.env.USER_EMAIL ,
                pass: process.env.USER_PASSWORD
            }
        })
        
        const mailoptions = {
                from: process.env.USER_EMAIL,
                to: email,
                subject: "For verify mail",
                text: otp
        }

        trasporter.sendMail(mailoptions, (error, info)=>{
          if(error){
            console.log(error);
          }else{
            console.log("Email has been sent");
          }
        })

        return otp
        
    } catch (error) {
        console.log(error);
    }
}


//gennerate otp

const generateOtp = ()=>{
     otp = `${Math.floor(1000 + Math.random() * 9000)}`
    return otp
}

module.exports={hashPassword,verifyEmail}