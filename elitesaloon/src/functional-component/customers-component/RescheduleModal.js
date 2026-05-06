import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RescheduleModal = ({ selectedAppointment, initialServices, onClose, fetchAppointments }) => {
  const [selectedServices, setSelectedServices] = useState(initialServices || []);
  const [newDate, setNewDate] = useState(selectedAppointment?.appointmentDate || "");
  const [newTime, setNewTime] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const navigate = useNavigate();

  // Nayi services aane par state update karein
  useEffect(() => {
    if (initialServices) setSelectedServices(initialServices);
  }, [initialServices]);

  // Fetch Slots
  const fetchSlots = async (date) => {
    try {
      if (!selectedAppointment || selectedServices.length === 0) return;
      const res = await axios.post("http://localhost:5000/appointment/slots", {
        staffId: selectedAppointment.staffId?._id || selectedAppointment.staffId,
        date: date,
        serviceIds: selectedServices.map((s) => s._id || s.serviceId),
      });
      setTimeSlots(res.data.availableSlots || []);
    } catch (err) {
      setTimeSlots([]);
    }
  };

  useEffect(() => {
    if (newDate && selectedServices.length > 0) fetchSlots(newDate);
  }, [newDate, selectedServices]);

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      Swal.fire("Warning", "Please select date and time", "warning");
      return;
    }
    try {
      const res = await axios.put("http://localhost:5000/appointment/reschedule-appointment", {
        appointmentId: selectedAppointment._id,
        newDate,
        newStartTime: newTime,
        serviceIds: selectedServices.map((s) => s._id || s.serviceId),
      });
      Swal.fire("Success", res.data.message, "success");
      onClose();
      fetchAppointments();
    } catch (error) {
      Swal.fire("Error", "Failed to reschedule", "error");
    }
  };

  return (
    <div className="booking-modal">
      <div className="booking-card">
        <div className="card-header"><h2>Reschedule Appointment</h2></div>
        
        <div className="form-group">
          <label>Services</label>
          <button
            type="button" className="btn-primary"
            onClick={() => navigate("/selectservices", {
              state: {
                salonId: selectedAppointment?.ownerId,
                selectedServices,
                fromReschedule: true,
                appointmentData: selectedAppointment,
              },
            })}
          >
            Change Services ({selectedServices.length})
          </button>
          <div style={{ marginTop: "10px" }}>
            {selectedServices.map((s) => (
              <span key={s._id || s.serviceId} className="tag">{s.serviceName}</span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>New Date</label>
          <input type="date" className="custom-datepicker" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>New Time</label>
          <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
            <option value="">Select Time</option>
            {timeSlots.map((t, i) => (
              <option key={i} value={t.startTime}>{t.startTime} - {t.endTime}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleReschedule}>Confirm</button>
          <button className="btn-primary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;