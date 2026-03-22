// const Appointment = require("../models/Appointment");
// const Service = require("../models/Service");
// const { convertToMinutes, calculateEndTime } = require("../utils/timeUtils");

// const bookAppointment = async (req, res) => {
//     try {
//         const {
//             customerId,
//             ownerId,
//             staffId,
//             services,
//             appointmentDate,
//             appointmentStartTime
//         } = req.body;

//         // ✅ 1. Get services from DB
//         const servicesData = await Service.find({
//             _id: { $in: services }
//         });

//         if (!servicesData.length) {
//             return res.status(404).json({ message: "Services not found" });
//         }

//         // ✅ 2. Calculate total duration & price
//         let totalDuration = 0;
//         let totalAmount = 0;

//         const serviceDetails = servicesData.map(service => {
//             totalDuration += service.serviceDuration;
//             totalAmount += service.servicePrice;

//             return {
//                 serviceId: service._id,
//                 serviceName: service.serviceName,
//                 servicePrice: service.servicePrice,
//                 serviceDuration: service.serviceDuration
//             };
//         });

//         // ✅ 3. Calculate end time
//         const endTime = calculateEndTime(appointmentStartTime, totalDuration);

//         // ✅ 4. Get existing bookings
//         const existingAppointments = await Appointment.find({
//             staffId,
//             appointmentDate,
//             appointmentStatus: { $in: ["PENDING", "CONFIRMED"] }
//         });

//         // ✅ 5. Check overlap
//         const isOverlapping = existingAppointments.some(app => {
//             return (
//                 convertToMinutes(appointmentStartTime) < convertToMinutes(app.appointmentEndTime) &&
//                 convertToMinutes(endTime) > convertToMinutes(app.appointmentStartTime)
//             );
//         });

//         if (isOverlapping) {
//             return res.status(400).json({
//                 message: "Time slot already booked"
//             });
//         }

//         // ✅ 6. Save appointment
//         const appointment = await Appointment.create({
//             customerId,
//             ownerId,
//             staffId,
//             services: serviceDetails,
//             totalDuration,
//             totalAmount,
//             appointmentDate,
//             appointmentStartTime,
//             appointmentEndTime: endTime
//         });

//         res.status(201).json({
//             message: "Appointment booked successfully",
//             appointment
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// module.exports = { bookAppointment };