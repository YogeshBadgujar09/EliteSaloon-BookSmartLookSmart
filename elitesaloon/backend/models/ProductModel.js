const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true,
        trim: true
    },

    productType:{
        type:String,
        enum:["HAIRGEL","FACEWASH","SUNSCREAM"],
        required:true
    },

    productDescription: {
        type: String,
        required: true
    },

    productPrice: {
        type: Number,
        required: true
    },

    productPreferredGender: {
        type: String,
        enum: ["MALE", "FEMALE", "BOTH"],
        default: "BOTH"
    },

    productImages: [{
        type: String
    }],

    createdDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Product", ProductSchema);