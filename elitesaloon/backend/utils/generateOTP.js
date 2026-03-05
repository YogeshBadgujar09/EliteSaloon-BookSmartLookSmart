const generateOTPfunction = async () => {
    console.log("Inside OTP Generation Function");
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = generateOTPfunction;