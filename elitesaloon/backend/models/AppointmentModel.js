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

    services: [
        {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
            serviceName: String,
            servicePrice: Number,
            serviceDuration: Number
        }
    ],

    totalDuration: Number,
    totalAmount: Number,

    appointmentDate: {
        type: String,
        required: true
    },

    appointmentStartTime: {
        type: String,
        required: true
    },

    appointmentEndTime: {
        type: String,
        required: true
    },

    appointmentStatus: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
        default: "PENDING"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Appointment", AppointmentSchema);