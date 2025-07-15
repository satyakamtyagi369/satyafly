const express= require('express');
const router = express.Router();
const Flight = require('../models/flight');
router.post('/flights',async (req,res)=>{
    try{
        const {origin,destination,airline,departure_time,arrival_time, price}=req.body;
        const newFlight= new Flight({
            origin,destination, airline, departure_time, arrival_time,price
        });
        await newFlight.save();
        res.status(201).json({message:'Flight saved successfully.',flight:newFlight});
    }
    catch(err){
        res.status(500).json({error:'Failed to saved flight', details:err.message});
    }
});
module.exports = router;