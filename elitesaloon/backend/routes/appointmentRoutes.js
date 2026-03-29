const express = require("express");
const routes = express.Router();

const { getAvailableSlots, bookAppointment,
    appointmentResult
 } = require("../controllers/AppointmentController/appointmentController");

routes.post("/slots", getAvailableSlots);
routes.post("/book", bookAppointment);
routes.put("/appointment-result", appointmentResult);

module.exports = routes;