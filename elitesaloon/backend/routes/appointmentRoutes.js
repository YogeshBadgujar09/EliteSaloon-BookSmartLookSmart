const express = require("express");
const router = express.Router();

const appointmentController  = require("../controllers/AppointmentController/appointmentController");

router.post("/book-appointment", appointmentController.bookAppointment );

module.exports = router;