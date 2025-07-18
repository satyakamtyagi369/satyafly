const mongoose = require('mongoose');
// mongodb ke liye booking schema define karenge
// booking schema me flightId, passengers, numberOfPeople, totalAmount aur status define karenge.
// passengers me name aur email define karenge.
const bookingSchema = new mongoose.Schema({
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    passengers: [
        {
            name: {
                type: String,
                required: true,
                maxlength: 100
            },
            email: {
                type: String,
                required: true,
                maxlength: 100
            }
        }
    ],
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, {
    collection: 'celebalFlyBookings',
    timestamps: true
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
