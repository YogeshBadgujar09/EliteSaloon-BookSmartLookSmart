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
    if (initialServices) {
      setSelectedServices(initialServices);
    }
  }, [initialServices]);

  // ✅ LOGIC FIX: Slots fetch karne ka dedicated function
  const fetchSlots = async (date, services) => {
    if (!selectedAppointment || services.length === 0 || !date) return;
    try {
      const res = await axios.post("http://localhost:5000/appointment/slots", {
        staffId: selectedAppointment.staffId?._id || selectedAppointment.staffId,
        date: date,
        serviceIds: services.map((s) => s.serviceId || s._id),
      });
      setTimeSlots(res.data.availableSlots || []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setTimeSlots([]);
    }
  };

  // Jab bhi Date ya Services badle (ya wapas aayein), slots fetch karo
  useEffect(() => {
    if (newDate && selectedServices.length > 0) {
      fetchSlots(newDate, selectedServices);
    }
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
        serviceIds: selectedServices.map((s) => s.serviceId || s._id),
      });
      Swal.fire("Success", res.data.message, "success");
      onClose();
      fetchAppointments();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to reschedule", "error");
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
            onClick={() => navigate("/rescheduleservice", {
              state: {
                salonId: selectedAppointment?.ownerId?._id || selectedAppointment?.ownerId,
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
          <input 
            type="date" 
            className="custom-datepicker" 
            value={newDate} 
            onChange={(e) => {
              setNewDate(e.target.value);
              setNewTime(""); // Date badalne par time clear
            }} 
          />
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