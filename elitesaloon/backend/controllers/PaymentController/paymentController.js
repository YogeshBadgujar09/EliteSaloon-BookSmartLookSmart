const razorpay = require("../config/razorpay");
const Appointment = require("../models/Appointment");

//created by yogesh deore

exports.createOrder = async (req, res) => {

    try {

        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);

        const order = await razorpay.orders.create({
            amount: appointment.totalPrice * 100,
            currency: "INR"
        });

        appointment.orderId = order.id;
        await appointment.save();

        res.json(order);

    } catch (error) {
        console.log(error);
        res.status(500).send("Order error");
    }

};

exports.verifyPayment = async (req, res) => {

    try {

        const { appointmentId, paymentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);

        appointment.paymentId = paymentId;
        appointment.paymentStatus = "SUCCESS";
        appointment.appointmentStatus = "CONFIRMED";

        await appointment.save();

        res.json({ message: "Payment Success & Appointment Confirmed" });

    } catch (error) {
        console.log(error);
        res.status(500).send("Verification error");
    }

};