const sendEmail = require('../mail/emailSender');
const generateOTP = require('../utils/generateOTP');

const emailSendOptimizeCode = async (email, subject, message) => {     

    const SUCCESS = 1 ;
    try {
       const emailSent =await sendEmail(email, subject, message);
       
        // Send email to customer for OTP verification
        if (!emailSent) {
            return null; // Return null if email sending failed
        }else{
            console.log("Email sent successfully to :", email);
            return SUCCESS;
        }

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
    
}

module.exports = emailSendOptimizeCode;