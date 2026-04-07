const express = require("express");
const routes = express.Router();

const {
  getAvailableSlots,
  bookAppointment,
  appointmentResult,
  getSalons,
} = require("../controllers/AppointmentController/appointmentController");

routes.post("/slots", getAvailableSlots);
routes.post("/book", bookAppointment);
routes.put("/appointment-result", appointmentResult);
routes.get("/get-salon/:pincode", getSalons);

module.exports = routes;
