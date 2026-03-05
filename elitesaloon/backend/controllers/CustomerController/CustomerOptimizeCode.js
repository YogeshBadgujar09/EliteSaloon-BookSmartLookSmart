const CustomerModel = require('../../models/CustomerModel');
const sendEmail = require('../../mail/emailSender');


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

    const YES = 1;
    try {
       const emailSent =await sendEmail(email, subject, message);
       
      
        if (!emailSent) {
            return null; // Return null if email sending failed
        }else{
            console.log("Email sent successfully to :", email);
            return YES;
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