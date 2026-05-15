const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  getRazorpayPayments
} = require("../controllers/PaymentController/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/razorpay-payments", getRazorpayPayments);

module.exports = router;