const mongoose= require('mongoose');
const { getMaxListeners } = require('./User');
const flightschema= new mongoose.Schema({
    origin:{
        type:String,
        required:true,
        maxlength:50
    },
    destination:{
        type:String,
        required:true,
        maxlength:50
    },
    airline:{
        type:String,
        required:true,
        maxlength:50
    },
    departure_time:{
        type:Date,
        required:true
    },
    arrival_time:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},{
    collection:'celebalFly', // ish naam se mongodb me collection banana hai,
    timestamps:false
});
const Flight = mongoose.model('Flight',flightschema);
module.exports=Flight;