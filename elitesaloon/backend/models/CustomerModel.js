const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({   

    customerName : {
                    type: String, required: true
    },
    customerEmail : {
                     type: String, required: true
    },
    customerMobile : {
                     type: String, required: true, unique: true
    },
    customerGender : {
                        type: String, required: true        
    },
    customerDOB : {
                    type: Date, required: true
    },
    customerStreet : {
                    type: String
    },
    customerPincode : {
                    type: String, required: true
    },
    customerCity : {
                    type: String, required: true
    },  
    customerBlock : {
                    type: String, required: true
    },
    customerDistrict : {
                    type: String, required: true
    },
    customerState : {
                    type: String, required: true
    },
     customerUsername : {
                    type: String, required: true, unique: true
    },
    customerPassword : {
                    type: String, required: true
    },
    customerProfileImage : {
                    type: String, required: true
    },
    customerCreatedAt : {  
                    type: Date, default: Date.now
    },
    customerUpdatedAt : {  
                    type: Date, default: Date.now
    }, 
    customerOTP : {
                    type: String, default: null
    },
    customerVerified : {
                    type: Boolean, default: false
    },
    customerStatus : {
                    type: String, default: "deactive"
    }
}); 

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;

 

