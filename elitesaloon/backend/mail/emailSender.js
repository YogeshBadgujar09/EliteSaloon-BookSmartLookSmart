const nodemailer = require('nodemailer');
const generateOTP = require('../util/generateOTP');

let generatedOTP; // Declare otp variable to store the generated OTP

const sendEmail = async (email, subject, message, generatedOTP) => {
    
    try {
        console.log("enter in email send function");

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'elitesaloon18@gmail.com',
                pass: 'ptjiscumbuicusbi' // App password for Gmail
            }
        });

        const info = await transporter.sendMail({
           
            from: 'Elite Saloon <elitesaloon18@gmail.com>',
            to: email,
            subject: subject,
            text: message + generatedOTP // Append generated OTP to the message
        });

        console.log("info :" + info);
        console.log("Email sent:", info.messageId);

        return true ; // Return the generated OTP for verification

    } catch (error) {
        console.error("Email sending failed:", error.message);
        return false;
    }
};

module.exports = sendEmail;

