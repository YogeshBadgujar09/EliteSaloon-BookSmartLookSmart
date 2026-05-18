const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },

    serviceName:{
        type:String,
        required:true,
        trim:true
    },

    serviceDescription:{
        type:String,
        required:true
    },
    serviceType: {
    type: String,
    enum: ["HAIRCUT","BEARD", "FACIAL","SKIN","HAIRWASH","HAIRSPA","HAIRCOLORING","CLEANUP","KERATINTREATMENT" ],
    required: true
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