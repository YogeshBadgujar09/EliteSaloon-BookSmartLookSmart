const CustomerModel = require('../../models/CustomerModel');
const sendEmail = require('../../mail/emailSender');
const generateOTP = require('../../util/generateOTP');

const customerFindUsingEmail = async (customerEmail) => {
     
    try {
        const customer = await CustomerModel.findOne({ customerEmail });
        console.log("Customer Data For Finding Using Email :", customer);
        if(customer == null){
            return null;
        }
        return customer;
    
    } catch (error) {
        console.error("Error finding customer by email:", error);
        throw error;
    }
}



const emailSendOptimizeCode = async (email, subject, message) => {     

    try {
       const generatedOTP = await generateOTP();
       const emailSent =await sendEmail(email, subject, message, generatedOTP);
       
        // Send email to customer for OTP verification
        if (!emailSent) {
            return null; // Return null if email sending failed
        }else{
            console.log("Email sent successfully to :", email);
            return generatedOTP;
        }

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
    
}

module.exports = {
    customerFindUsingEmail,
    emailSendOptimizeCode
}   