const mongoose= require('mongoose');
const { getMaxListeners } = require('./User');
// ish naam se mongodb me collection banana hai,
// flights me origin, destination, airline, departure_time, arrival_time aur price define karenge
// origin, destination aur airline string type honge,
// departure_time aur arrival_time date type honge,
// price number type hoga.
// sabhi fields required hain aur unki maximum length define karenge.
// timestamps ko false set karenge kyunki hume timestamps ki zarurat nahi hai.
// collection ka naam 'celebalFly' hoga.
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