const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },

    staffName: {
        type: String,
        required: true
    },

    staffEmail: {
        type: String,
        required: true,
        unique: true
    },

    staffPhone: {
        type: String,
        required: true
    },

    staffAddress: {
        type: String
    },

    staffProfile: {
        type: String
    },

    staffOTP: {
        type: Number
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    staffCreatedAt :{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Staff", StaffSchema);