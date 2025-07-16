const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'flight',
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
