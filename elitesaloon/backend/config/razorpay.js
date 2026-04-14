const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_SPZsgkIqFM9JER",
  key_secret: "L4TwG4VqWEzkVo4nfnmAAKaK"
});

module.exports = razorpay;