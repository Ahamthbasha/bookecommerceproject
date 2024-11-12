const User=require("../../models/userModel")
const userHelper=require("../../helpers/userHelper")
const Category=require("../../models/categoryModel")
const Product=require("../../models/productModel")
const argon2=require("argon2")
const mongoose=require("mongoose")

let message2
let userRegData
let userEmail
let otp
let userData

const loadHomePage=async(req,res)=>{
    try{
        const userData = req.session.user;
        const Products=await Product.aggregate([
            {$match:{isBlocked:false}},
            {
                $lookup:{
                    from:"categories",
                    localField:"category",
                    foreignField:"_id",
                    as:"category"
                }
            },{
                $unwind:"$category"
            }
        ])
        const category=await Category.find({isListed:true}).lean()
            res.render("user/home",{userData})
        }
    catch(error){
        console.log(error)
        res.status(500).send("server error")
    }
}

const pageNotFound=async(req,res)=>{
    try{
        return res.render("user/page-404")
    }catch(error){
        res.redirect("home")
    }
}

const loadSignUp=async(req,res)=>{
    try{
       return res.render("user/signup")
    }catch(error){
        console.log("sign up page not loading",error)
        res.status(500).send("server error")
    }
}

const loadLogIn=async(req,res)=>{
    try{
        return res.render("user/login")
    }catch(error){
        console.log("login page is not found",error.message)
        res.status(500).send("server error")
    }
}

//user login

const userLogin = (req, res) => {

    let regSuccessMsg = 'User registered sucessfully..!!'
    let blockMsg = 'Sorry something went wrong..!!'
    let mailErr = 'Incorrect email or password..!!'
    let newpasMsg = 'Your password reseted successfuly..!!'
    message2 = false


    if (req.session.mailErr) {
        res.render('user/login', { mailErr })
        req.session.mailErr = false
    }
    else if (req.session.regSuccessMsg) {
        res.render('user/login', { regSuccessMsg })
        req.session.regSuccessMsg = false
    }
    else if (req.session.userBlocked) {
        res.render('user/login', { blockMsg })
        req.session.userBlocked = false
    }
    else if (req.session.LoggedIn) {
        res.render('user/login')
        req.session.LoggedIn = false
    }
    else if (req.session.newPas) {
        res.render('user/login', { newpasMsg })
        req.session.newPas = false
    }
    else {
        res.render('user/login')
    }
}



const doSignUp = async (req, res) => {

    try {
        hashedPassword = await userHelper.hashPassword(req.body.password)
        userEmail = req.body.email
        userRegData = req.body


        const userExist = await User.findOne({ email: userEmail })
        if (!userExist) {
            otp = await userHelper.verifyEmail(userEmail)
            
            res.render('user/submitOtp')
        }
        else {
            message2 = true

            res.render('user/login', { message2 })

        }

    } catch (error) {
        console.log(error);
    }
}

//google authentication

const googleCallback = async (req, res) => {
    try {
        // Add the user's name to the database
        userData = await User.findOneAndUpdate(
            { email: req.user.email },
            { $set: { name: req.user.displayName, isVerified: true, isBlocked: false } },
            { upsert: true, new: true }
        );
        console.log(userData)

        // Set the user session
        req.session.LoggedIn = true
        req.session.user = userData
        // Redirect to the homepage
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
}

const getOtp=async(req,res)=>{
    try {
        res.render("user/submitotp")
    } catch (error) {
        console.log(error)
    }
}

//Submit otp and save user

const submitOtp = async (req, res) => {
    try {
        userOtp = req.body.otp;


        if (userOtp == otp) {
            const user = new User({
                name: userRegData.name,
                email: userRegData.email,
                mobile: userRegData.phone,
                password: hashedPassword,
                isVerified: true,
                isBlocked: false,
            });

            await user.save();

            req.session.regSuccessMsg = true;

            // Send JSON response with success message
            res.json({ success: true, redirectUrl: '/login' });
        } else {
            otpError = 'incorrect otp';

            // Send JSON response with error message
            res.json({ error: otpError });
        }
    } catch (error) {
        console.log(error);

        // Send JSON response with error message
        res.json({ error: 'An error occurred while submitting the OTP.' });
    }
};

//To resend otp

const resendOtp = async (req, res) => {
    try {
        res.redirect('/get_otp')
        otp = await userHelper.verifyEmail(userEmail)
    } catch (error) {
        console.log(error);
    }
}


//user login controller
const doLogin = async (req, res) => {

    try {
        let email = req.body.email
        let password = req.body.password

        userData = await User.findOne({ email: email });
        if (userData) {
            console.log(userData.password)
            console.log(email)
            console.log(password)

        }


        if (userData) {
            if (await argon2.verify(userData.password, password)) {

                const isBlocked = userData.isBlocked

                if (!isBlocked) {

                    req.session.LoggedIn = true
                    req.session.user = userData
                    console.log("user session => ", req.session.user)

                    res.redirect('/')
                } else {
                    userData = null
                    req.session.userBlocked = true
                    res.redirect('/login')
                }
            }
            else {
                req.session.mailErr = true
                res.redirect('/login')
            }
        } else {
            req.session.mailErr = true
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
    }
}

const doLogout=async(req,res)=>{
    try {
        req.session.destroy()
        userData=null
        res.redirect("/login")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={loadHomePage,pageNotFound,loadSignUp,loadLogIn,doSignUp,getOtp,submitOtp,resendOtp,googleCallback,doLogin,userLogin,doLogout}