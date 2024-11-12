const express=require("express")
const app=express()
const env=require("dotenv").config()
const path=require("path")
const session=require("express-session")
const nocache = require('nocache');


//routes
const userRouter=require("./routes/userRouter")
const adminRouter=require("./routes/adminRouter")

//database configuration
const db=require("./config/db")
db()

app.use(nocache());

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    secure:false,
    httpOnly:true,
    maxAge:72*60*60*1000
  }
}))

const handlebars = require('express-handlebars');
const hbs = require('hbs')

//configure handlebars
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'layout',
    partialsDir: __dirname + '/views/partials/'
  }));
  
hbs.registerPartials(path.join(__dirname,'/views/partials'))

  
//app middlewares

app.use("/",userRouter)
app.use("/admin",adminRouter)

//setting public folder 
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT,()=>{
    console.log("server is running")
})
