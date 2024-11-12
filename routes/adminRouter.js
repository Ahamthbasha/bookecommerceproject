const express=require("express")
const router=express.Router()
const adminController=require("../controllers/admin/adminController")
const customerController=require("../controllers/admin/customerController")
const categoryController=require("../controllers/admin/categoryController")
const productController=require("../controllers/admin/productController")
const adminAuth=require("../middlewares/adminAuth")
const store=require("../middlewares/multer")

router.get("/login", adminAuth.isLogout,adminController.loadLogin)
router.post('/login' ,adminAuth.isLogout ,adminController.adminDoLogin)

router.get("/home",adminController.loadHome)
router.get("/logout",adminAuth.isLogin,adminController.adminLogout)

//user management
router.get("/manage_users",adminAuth.isLogin,customerController.loadUsersData)
router.get('/block_user/:id', adminAuth.isLogin, customerController.blockUser)

//category management
router.get("/category",adminAuth.isLogin,categoryController.getCategory)
router.get("/add_category",adminAuth.isLogin,categoryController.addCategory)
router.post("/add_category",adminAuth.isLogin,store.single('image'),categoryController.addNewCategory)
router.get("/edit_category/:id",adminAuth.isLogin,categoryController.editCategory)
router.post("/update_category/:id",adminAuth.isLogin,store.single('image'),categoryController.updateCategory)
router.post("/delete_category",adminAuth.isLogin,categoryController.deleteCategory)

//product management

router.get("/product",adminAuth.isLogin,productController.getProduct)
router.get("/new_Product",adminAuth.isLogin,productController.addProductPage)
router.post("/add_new_product",store.array('image',5),productController.addNewProduct)
router.get("/edit_product/:id",store.array('image',5),adminAuth.isLogin,productController.editProduct)
router.post("/update_product/:id",store.array('image',5),adminAuth.isLogin,productController.updateProduct)
router.post("/delete_product/:id",adminAuth.isLogin,productController.deleteProduct)
router.post("/block_product",adminAuth.isLogin,productController.blockProduct)

module.exports=router