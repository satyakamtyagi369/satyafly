const express= require("express");
const path = require("path");
const mongoose =require('mongoose');
const bodyparser = require('body-parser');
const User = require('./models/User');
const session=require('express-session');
const port = 3000;
const app = express();
mongoose.connect("mongodb://localhost:27017/celebalFly",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("MongoDB connected."))
.catch((err)=> console.log(err));

app.use(bodyparser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'../frontend/public')));
app.use(session({
    secret:'celebalFlySecret',
    resave:false,
    saveUninitialized:false
}));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/public/index.html'));
})
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/public/signup.html'));
});
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
})

//signup page handle karna hai
app.post('/signup',async(req,res)=>{
    try{
        console.log(req.body);
        const{name,email,password}=req.body;
        if(!name || !email || !password){
            return res.redirect('/signup?error=missing');
        }
        await User.create({name,email,password});
        res.redirect('/login');
    }
    catch(err){
        console.log(err);
        res.redirect('/signup?error=exists');
    }
});
//login page ab handle karna hai.
app.post('/login',async(req,res)=>{
    const {name,password}=req.body;
    const user = await User.findOne({name,password});
    if(!user){
        //user nahi hai, toh pehle signup karo.
        return res.redirect('/signup?error=missing');
    }
    req.session.user=user;
    res.redirect('/dashboard');
})
app.get('/dashboard',(req,res)=>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname,'../frontend/public/dashboard.html'));
});
app.get('/user',(req,res)=>{
    if(!req.session.user){
        return res.status(401).json({error: 'Not logged in.'});
    }
    res.json(req.session.user);
})
app.get('/dashboard/chatbot/',(req,res)=>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, '../frontend/public/chatbot.html'));
});
app.listen(port,()=>{
    console.log(`Server is listening on http://localhost:${port}`);
})