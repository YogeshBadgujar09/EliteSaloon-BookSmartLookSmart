const express = require("express");
const router = express.Router();

// created by yogesh deore

const {
    createOrder,
    verifyPayment
} = require("../controllers/PaymentController/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;