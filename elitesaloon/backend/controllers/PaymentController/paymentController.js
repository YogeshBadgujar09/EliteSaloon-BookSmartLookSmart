const Razorpay = require("razorpay");
const crypto = require("crypto");

const AppointmentModel = require("../../models/AppointmentModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// create order
exports.createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

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

          // verify payment

exports.verifyPayment = async (req, res) => {
  try {

    const {
      appointmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    appointment.paymentId = razorpay_payment_id;
    appointment.paymentStatus = "SUCCESS";
    appointment.appointmentStatus = "COMPLETED";

    await appointment.save();

    res.json({ message: "Payment verified & saved" });

  } catch (error) {
    console.log(error);
    res.status(500).send("Verification error");
  }
};