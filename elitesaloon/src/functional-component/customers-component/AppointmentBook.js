import React, { useState, useEffect } from "react";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";
import Swal from "sweetalert2";
import { FaConciergeBell } from "react-icons/fa";

const AppointmentBook = () => {
  const { loading, startLoading, stopLoading } = useLoader();
  const customerId = localStorage.getItem("customerId");

  const [form, setForm] = useState({
    serviceId: "",
    appointmentDate: "",
    startTime: "",
  });

  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  /* ================= FETCH SERVICES ================= */
  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/service/getservices");
      const data = await res.json();

      console.log("Services API:", data);

      if (res.ok) {
        setServices(data.services || []);
      }
    } catch (error) {
      console.log("Service Fetch Error:", error);
    }
  };

  /* ================= FETCH APPOINTMENTS ================= */
  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/appointment/customer/${customerId}`
      );
      const data = await res.json();

      console.log("Appointments API:", data);

      if (res.ok) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.log("Appointment Fetch Error:", error);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= BOOK APPOINTMENT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.serviceId || !form.appointmentDate || !form.startTime) {
      setErrors({ message: "All fields are required" });
      return;
    }

    startLoading();

    try {
      const response = await fetch(
        "http://localhost:5000/appointment/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customerId,
            serviceId: form.serviceId,
            appointmentDate: form.appointmentDate,
            startTime: form.startTime,
          }),
        }
      );

      const data = await response.json();

      console.log("Booking Response:", data);

      if (response.ok) {
        Swal.fire("Success", "Appointment Booked!", "success");

        // refresh list
        fetchAppointments();

        setForm({
          serviceId: "",
          appointmentDate: "",
          startTime: "",
        });
      } else {
        Swal.fire("Error", data.message || "Booking failed", "error");
      }
    } catch (error) {
      console.log("Booking Error:", error);
      Swal.fire("Server Error", "Try again later", "error");
    } finally {
      stopLoading();
    }
  };

  /* ================= TIME SLOTS ================= */
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 20; i++) {
      slots.push(`${i < 10 ? "0" + i : i}:00`);
    }
    return slots;
  };

  return (
    <div className="dashboard-content">
      <CommonLoader loading={loading} />

      <div className="content-header">
        <h2>Book New Appointment</h2>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h3>
            <FaConciergeBell /> Appointment Details
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            {/* SERVICE */}
            <div className="form-group">
              <label>Select Service</label>
              <select
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
              >
                <option value="">-- Choose Service --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.serviceName}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* TIME */}
            <div className="form-group">
              <label>Time</label>
              <select
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
              >
                <option value="">-- Select Time --</option>
                {generateTimeSlots().map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {errors.message && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {errors.message}
            </p>
          )}

          <button type="submit" className="btn-primary">
            Confirm Booking
          </button>
        </form>
      </div>

      {/* ================= MY APPOINTMENTS ================= */}
      {appointments.length > 0 && (
        <div className="section-card" style={{ marginTop: "20px" }}>
          <div className="section-header">
            <h3>My Appointments</h3>
          </div>

          <ul>
            {appointments.map((a) => (
              <li key={a._id}>
                {a.serviceName} on {a.appointmentDate} at {a.startTime} —{" "}
                <b>{a.appointmentStatus}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AppointmentBook;