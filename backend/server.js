const express= require("express");
const path = require("path");
const mongoose =require('mongoose');
const bodyparser = require('body-parser');
const User = require('./models/User');
const port = 3000;
const app = express();
mongoose.connect("mongodb://localhost:27017/celebalFly",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("MongoDB connected."))
.catch((err)=> console.log(err));

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'../frontend/public')));

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
        const{name,email,password}=req.body;
        if(!name||!email||!password){
            return res.redirect('/signup?error=missinng');
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
    res.redirect('/');
})
app.listen(port,()=>{
    console.log(`Server is listening on http://localhost:${port}`);
})