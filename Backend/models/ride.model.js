const mongoose  = require("mongoose");

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    captain : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
    },
    pickupLocation: {
        type:String,
        required: true,
    },
    dropLocation: {
        type:String,
        required: true,
    },
    fare: {
        type:Number,
        required: true,
    },
    status: {
        type:String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    duration: {
        type: Number, // in seconds
    },
    distance: {
        type: Number, // in Meters
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp:{
        type: String,
        select: false,
    }
});

module.exports = mongoose.model("Ride", rideSchema);
