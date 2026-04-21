const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },

    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true
    },

    //yogesh Deore
        paymentId: String,
        orderId: String,

        paymentStatus: {
        type: String,
        default: "PENDING"
        },
    // --------------------------------------------

    services: [
        {
            serviceId: mongoose.Schema.Types.ObjectId,
            serviceName: String,
            duration: Number,
            price: Number
        }
    ],

    appointmentDate: {
        type: String, // "YYYY-MM-DD"
        required: true
    },

    startTime: String,
    endTime: String,

    totalDuration: Number,
    totalPrice: Number,

   

    appointmentStatus: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
        default: "PENDING"
    }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);

