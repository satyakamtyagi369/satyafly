const mongoose=require('mongoose');
// ish naam se mongodb me collection banana hai,
// users me name, email aur password define karenge
// name aur email string type honge, aur password bhi string type hoga.
// sabhi fields required hain.
const userschema=new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
});
module.exports = mongoose.model('User',userschema);