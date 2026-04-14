const express = require("express");
const routes = express.Router();

const {
  getAvailableSlots,
  bookAppointment,
  appointmentResult,
  getSalons,
  createOrder, //added By Yogesh Deore
} = require("../controllers/AppointmentController/appointmentController");

routes.post("/slots", getAvailableSlots);
routes.post("/book", bookAppointment);
routes.put("/appointment-result", appointmentResult);
routes.get("/get-salon/:pincode", getSalons);

//added By Yogesh Deore
routes.post("/create-order", createOrder);


module.exports = routes;
