const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({

    serviceName:{
        type:String,
        required:true,
        trim:true
    },

    serviceDescription:{
        type:String,
        required:true
    },

    serviceType:{
        type:String,
        enum:["HAIRCUT","BEARD","FACIAL","MAKEUP","SKIN"],
        required:true
    },

    serviceImages:[
        {
            type:String,
            required:true
        }
    ],

    servicePreferredGender:{
        type:String,
        enum:["MALE","FEMALE","BOTH"],
        required:true
    },

    servicePrice:{
        type:Number,
        required:true
    },

    serviceDuration:{
        type:Number,   // duration in minutes
        required:true
    },

    serviceCreatedDate:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("Service",ServiceSchema);