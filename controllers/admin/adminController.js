const ADMIN_EMAIL = "admin@gmail.com"
const ADMIN_PASSWORD = "123"

let adminData

const loadLogin=async(req,res)=>{
    try
    {
        return res.render("admin/login" , {layout : 'loginlayout'})
    }catch(error){
        console.log("login page not found",error)
        res.status(500).send("server error")
    }
}

const adminDoLogin = async (req, res) => {
    try {
      adminData = {
  
  
        email: process.env.ADMIN_EMAIL || ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD || ADMIN_PASSWORD
      };
      let adminEmail = req.body.email;
      let adminPassword = req.body.password;
  
  
      //adminData = await Admin.findOne({ email: adminEmail });
  
      if (adminData) {
        if (adminPassword === adminData.password) {
          req.session.aLoggedIn = true;
          req.session.admin = adminData;
          res.redirect("/admin/home");
        } else {
          res.render("admin/login", { message: "incorrect email or password", layout: 'loginlayout' });
        }
      } else {
        res.render("admin/login", { message: "incorrect email or password", layout: 'loginlayout' });
      }
    } catch (error) {
      console.log(error);
    }
  };

const loadHome=(req,res)=>{
    if(req.session.admin){
    try{
        res.render("admin/home",{layout:'adminlayout'})
    }
    catch(error) {
        console.log(error)
    }
}
}

const adminLogout=async(req,res)=>{
  try {
    req.session.destroy()
    adminData=null
    res.redirect("/admin/login")
  } catch (error) {
    console.log(error.message)
  }
}

module.exports={
    loadLogin ,
    adminDoLogin,
    loadHome,
    adminLogout
}