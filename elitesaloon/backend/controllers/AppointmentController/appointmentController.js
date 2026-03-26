const AppointmentModel = require("../../models/AppointmentModel");
const ServiceModel = require("../../models/ServiceModel");
const { convertToMinutes, calculateEndTime } = require("../../utils/timeUtils");

exports.bookAppointment = async (req, res) => {
    try {

        console.log(req.body);
        const {
            customerId,
            ownerId,
            staffId,
            services,
            appointmentDate,
            appointmentStartTime
        } = req.body;

        // Get services from DB
        const servicesData = await ServiceModel.find({
            _id: { $in: services }
        });

        if (!servicesData.length) {
            return res.status(404).json({ message: "Services not found" });
        }

        // Calculate total duration & price
        let totalDuration = 0;
        let totalAmount = 0;

        const serviceDetails = servicesData.map(service => {
            totalDuration += service.serviceDuration;
            totalAmount += service.servicePrice;

            return {
                serviceId: service._id,
                serviceName: service.serviceName,
                servicePrice: service.servicePrice,
                serviceDuration: service.serviceDuration
            };
        });

        // Calculate end time
        const endTime = calculateEndTime(appointmentStartTime, totalDuration);

        // Get existing bookings
        const existingAppointments = await AppointmentModel.find({
            staffId,
            appointmentDate,
            appointmentStatus: { $in: ["PENDING", "CONFIRMED"] }
        });

        // Check overlap
        const isOverlapping = existingAppointments.some(app => {
            return (
                convertToMinutes(appointmentStartTime) < convertToMinutes(app.appointmentEndTime) &&
                convertToMinutes(endTime) > convertToMinutes(app.appointmentStartTime)
            );
        });

        if (isOverlapping) {
            return res.status(400).json({
                message: "Time slot already booked"
            });
        }

        //  Save appointment
        const appointment = await AppointmentModel.create({
            customerId,
            ownerId,
            staffId,
            services: serviceDetails,
            totalDuration,
            totalAmount,
            appointmentDate,
            appointmentStartTime,
            appointmentEndTime: endTime
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

