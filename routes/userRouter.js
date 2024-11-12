const express=require("express")
const router=express.Router()
const auth=require("../middlewares/userAuth")
const userController=require("../controllers/user/userController")
const passport=require('passport')
require('../middlewares/googleAuth')

const {isLogin,isLogout}=auth

router.get("/",userController.loadHomePage)
router.get("/pageNotFound",userController.pageNotFound)

//signup page
router.get("/signup", isLogout ,   userController.loadSignUp)
router.post("/signup", isLogout , userController.doSignUp)

//login page
router.get("/login", isLogout ,  userController.loadLogIn)
router.post("/login", isLogout ,  userController.doLogin)

router.get("/login",isLogout,userController.userLogin)

router.get("/logout",userController.doLogout)

//otp page
router.get("/get_otp",isLogout, userController.getOtp)
router.post("/submit_otp", isLogout ,  userController.submitOtp)
router.get("/resend_otp",isLogout,userController.resendOtp)

//google authentication
router.get('/auth/google',  passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.googleCallback)


module.exports=router