const mongoose = require('mongoose');
const Flight = require('./models/flight');
// is file me hum flight details ko database me save karne ke liye function banayenge
// yeh function flight details ko Flight model me save karega
// iske liye humein mongoose ka use karna padega jo MongoDB ke saath interact karta hai
// yeh hum api call se pehle normally khud test karne ke liye use karenge.
async function createFlight(){
    try{
        await mongoose.connect('mongodb://localhost:27017/celebalFly',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        const newFlight=new Flight({
            origin:'Dehradun',
            destination:'Jaipur',
            airline:'Indigo',
            departure_time: new Date('2025-07-20T09:00:00Z'),
            arrival_time: new Date('2025-07-20T11:30:00Z'),
            price:4500.0,
        });
        await newFlight.save();
        console.log("flight save successfully."); //pata karne ke liye it is work or not?
        mongoose.connection.close();
    }
    catch(err){
        console.error("save flight me error hai bhai.",err);
    }
}
createFlight();