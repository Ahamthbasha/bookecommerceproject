const express=require("express")
const router=express.Router()
const adminController=require("../controllers/admin/adminController")

router.get("/",adminController.loadLogIn)
router.post('/login' , adminController.adminLogin)
router.get('/home' , adminController.adminDashboard)

module.exports=router