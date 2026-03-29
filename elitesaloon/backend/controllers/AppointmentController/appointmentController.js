const AppointmentModel = require("../../models/AppointmentModel");
const StaffModel = require("../../models/StaffModel");
const ServiceModel = require("../../models/ServiceModel");
const { generateSlots } = require("../../utils/timeUtils");


exports.bookAppointment = async (req, res) => {
    try {
        const {
            customerId,
            ownerId,
            staffId,
            serviceIds,
            date,
            startTime
        } = req.body;

        const services = await ServiceModel.find({ _id: { $in: serviceIds } });

        const totalDuration = services.reduce((sum, s) => sum + s.serviceDuration, 0);
        const totalPrice = services.reduce((sum, s) => sum + s.servicePrice, 0);

        const { toMinutes, toTime } = require("../../utils/timeUtils");

        const endTime = toTime(toMinutes(startTime) + totalDuration);

        // conflict check
        const existing = await AppointmentModel.findOne({
            staffId,
            appointmentDate: date,
            appointmentStatus: { $in: ["PENDING", "CONFIRMED"] },
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        });

        if (existing) {
            return res.status(400).json({ message: "Slot already booked" });
        }

        const appointment = await AppointmentModel.create({
            customerId,
            ownerId,
            staffId,
            services: services.map(s => ({
                serviceId: s._id,
                serviceName: s.serviceName,
                duration: s.serviceDuration,
                price: s.servicePrice
            })),
            appointmentDate: date,
            startTime,
            endTime,
            totalDuration,
            totalPrice
        });

        res.json({ message: "Booking successful", appointment });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAvailableSlots = async (req, res) => {
    try {
        const { staffId, date, serviceIds } = req.body;

        // 1. get services
        const services = await ServiceModel.find({ _id: { $in: serviceIds } });

        const totalDuration = services.reduce((sum, s) => sum + s.serviceDuration, 0);

        // 2. get staff working hours (for now static)
        const start = "10:00";
        const end = "20:00";

        // 3. generate all possible slots
        const allSlots = generateSlots(start, end, totalDuration);

        // 4. get existing bookings
        const bookings = await AppointmentModel.find({
            staffId,
            appointmentDate: date,
            appointmentStatus: { $in: ["PENDING", "CONFIRMED"] }
        });

        // 5. filter slots
        const availableSlots = allSlots.filter(slot => {
            return !bookings.some(b => {
                return (
                    slot.startTime < b.endTime &&
                    slot.endTime > b.startTime
                );
            });
        });

        res.json({ availableSlots });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.appointmentResult = async (req,res) => {

      const subject = "Mail for Appointment Status";
      let message = "Please enter OTP for Owner registration in Elite Saloon\n\n Your OTP is :";

       try {
        const { appointmentId, status } = req.body;

        // Validate status
        if (!["CONFIRMED", "CANCELLED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Only CONFIRMED or CANCELLED allowed"
            });
        }

        // Find appointment
        const appointment = await AppointmentModel.findById(appointmentId)
                            .populate("customerId", "customerEmail");

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        //  Optional: prevent updating completed appointment
        if (appointment.appointmentStatus === "COMPLETED") {
            return res.status(400).json({
                message: "Cannot update completed appointment"
            });
        }

        
        const email = appointment.customerId.customerEmail;
        console.log(email);

        if(status === "CONFIRMED"){
            console.log("Procede to send Mail for confirm");
        }else{
             console.log("Procede to send Mail for cancel");
        }

        appointment.appointmentStatus = status;
        await appointment.save();

        res.json({
            message: `Appointment ${status.toLowerCase()} successfully`,
            appointment
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    

}

}

