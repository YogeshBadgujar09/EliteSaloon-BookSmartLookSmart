const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const sendEmail = require('../backend/mail/emailSender');

// let generatedOTPforMatch;

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/elitesaloon')
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err, 'MongoDB connection error'));

// app.use('/customer', require('./routes/customerRoutes'));
app.use('/customer', require('./routes/customerRoutes'));

// app.post('/otpsend', async (req, res) => {

//     console.log("enter in otp send route");      
//     const {email, subject, message} = req.body;
//     generatedOTPforMatch = await sendEmail(email, subject, message);

//     console.log("verify :" + generatedOTPforMatch);

//     if(generatedOTPforMatch != null){
      
//         console.log("OTP send sucessfully ... You can redirect to OTP verification page");

//         res.status(200).json({
//             message: "OTP sent successfully",
//             redirect:"/otpverification"
//         });
      
//     }else{
//         console.log("Failed to send OTP");
//         res.status(500).json({message: "Failed to send OTP"});
//     }

// });

// app.post('/otpverification', (req, res) => {

//     console.log("Generated OTP in verification route :" + generatedOTPforMatch);
//     console.log("enter in otp verification route");
//     const {otp} = req.body; 
//     console.log("OTP received from client :" + otp);
//     if(otp === generatedOTPforMatch){
//         console.log("OTP verification successful");
//         res.status(200).json({message: "OTP verification successful"});
//     }else{  
//         console.log("OTP verification failed");
//         res.status(400).json({message: "OTP verification failed"});
//     }
// });
   
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});