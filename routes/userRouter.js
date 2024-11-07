const express=require("express")
const router=express.Router()
const userController=require("../controllers/user/userController")

router.get("/",userController.loadHomePage)
router.get("/pageNotFound",userController.pageNotFound)
router.get("/signup",userController.loadSignUp)
router.get("/login",userController.loadLogIn)
module.exports=router