const loadHomePage=async(req,res)=>{
    try{
        return res.render("user/home")
    }catch(error){
        console.log("home page is not found")
        res.status(500).send("server error")
    }
}

const pageNotFound=async(req,res)=>{
    try{
        return res.render("page-404")
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
module.exports={loadHomePage,pageNotFound,loadSignUp,loadLogIn}