const ADMIN_EMAIL = "admin@gmail.com"
const ADMIN_PASSWORD = "123"

const loadLogIn=async(req,res)=>{
    try
    {
        return res.render("admin/login" , {layout : 'loginlayout'})
    }catch(error){
        console.log("login page not found",error)
        res.status(500).send("server error")
    }
}

const adminLogin = async (req , res) => {
    const {email , password} = req.body
    if(ADMIN_EMAIL === email && ADMIN_PASSWORD === password) {
        res.redirect('/admin/home')
    }else{
        res.render('admin/login' , {msg : 'Invalid credentials' , layout : 'loginlayout'})
    }
}

const adminDashboard =  async (req , res) => {
    try {
        res.render('admin/dashboard' , {layout : 'adminlayout'})
    } catch (error) {
        
    }
}

module.exports={
    loadLogIn ,
    adminLogin,
    adminDashboard
}