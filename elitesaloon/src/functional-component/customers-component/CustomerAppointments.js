import React, { useState, useEffect } from "react";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const CustomerAppointments = () => {
  const [myAppointments, setMyAppointments] = useState([]);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [selectedServices, setSelectedServices] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const customerId = localStorage.getItem("customerId");

      const res = await axios.get(
        `http://localhost:5000/appointment/customer-appointments/${customerId}`,
      );

      setMyAppointments(res.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  //   useEffect(() => {
  //   const savedServices = localStorage.getItem("rescheduleServices");

  //   if (savedServices && selectedAppointment) {
  //     setSelectedServices(JSON.parse(savedServices));

  //     localStorage.removeItem("rescheduleServices"); // cleanup
  //   }
  // }, [selectedAppointment]);

  useEffect(() => {
    if (location.state?.fromReschedule) {
      setSelectedServices(location.state.selectedServices || []);
      setSelectedAppointment(location.state.appointmentData || null);
      setShowRescheduleModal(true);

      // 🔥 important: warna baar baar open hoga
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Cancel Appointment
  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.put(
            "http://localhost:5000/customer/cancel-appointment",
            {
              appointmentId: id,
              status: "CANCELLED",
            },
          );

          Swal.fire("Cancelled!", res.data.message, "success");
          fetchAppointments();
        } catch (error) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "Something went wrong",
            "error",
          );
        }
      }
    });
  };

  // ✅ Fetch Slots (NOW USE selectedServices)
  const fetchSlots = async (date) => {
    try {
      if (!selectedAppointment || selectedServices.length === 0) return;

      const res = await axios.post("http://localhost:5000/appointment/slots", {
        staffId:
          selectedAppointment.staffId?._id || selectedAppointment.staffId,
        date: date,
        serviceIds:
          selectedServices.length > 0
            ? selectedServices.map((s) => s._id || s.serviceId)
            : undefined,
      });

      setTimeSlots(res.data.availableSlots || []);
    } catch (err) {
      console.log("Slot Error:", err.response?.data || err);
      setTimeSlots([]);
    }
  };

  // ✅ Auto fetch slots
  useEffect(() => {
    if (showRescheduleModal && newDate && selectedServices.length > 0) {
      fetchSlots(newDate);
    }
  }, [newDate, selectedServices]);

  // ✅ Reschedule
  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      Swal.fire("Warning", "Please select date and time", "warning");
      return;
    }

    // 🔥 DEBUG (IMPORTANT)
    console.log("RESCHEDULE DATA:", {
      appointmentId: selectedAppointment?._id,
      newDate,
      newStartTime: newTime,
      serviceIds: selectedServices.map((s) => s._id || s.serviceId),
    });

    try {
      const res = await axios.put(
        "http://localhost:5000/appointment/reschedule-appointment",
        {
          appointmentId: selectedAppointment._id,
          newDate: newDate,
          newStartTime: newTime,
          serviceIds: selectedServices.map((s) => s._id || s.serviceId),
        },
      );

      Swal.fire("Success", res.data.message, "success");

      setShowRescheduleModal(false);
      fetchAppointments();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>My Booking History</h2>
      </div>

      <div className="section-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>SR NO</th>
                <th>APPOINTMENT DATE</th>
                <th>SERVICES</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th style={{ textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {myAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No appointments found
                  </td>
                </tr>
              ) : (
                myAppointments.map((apt, index) => (
                  <tr key={apt._id} className="table-row">
                    <td>{index + 1}</td>

                    <td>
                      <div className="td-info">
                        <span className="main-text">
                          <FaCalendarAlt className="info-icon" />{" "}
                          {apt.appointmentDate}
                        </span>
                        <span className="sub-text">
                          <FaClock className="info-icon" /> {apt.startTime}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="service-tags">
                        {apt.services?.map((s, i) => (
                          <span key={i} className="tag">
                            {s.serviceName}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="price-text">₹{apt.totalPrice}</td>

                    <td>
                      <span
                        className={`status-pill ${apt.appointmentStatus?.toLowerCase()}`}
                      >
                        {apt.appointmentStatus}
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {apt.appointmentStatus !== "CANCELLED" &&
                      apt.appointmentStatus !== "COMPLETED" ? (
                        <>
                          <button
                            className="cancel-action-btn"
                            onClick={() => handleCancel(apt._id)}
                          >
                            CANCEL
                          </button>

                          <button
                            className="cancel-action-btn"
                            style={{
                              marginLeft: "10px",
                              background: "#e6fcf5",
                              color: "#0ca678",
                              border: "1px solid #b2f2bb",
                            }}
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setShowRescheduleModal(true);
                              setNewDate(apt.appointmentDate);
                              setNewTime("");
                              setSelectedServices(apt.services || []);
                            }}
                          >
                            RESCHEDULE
                          </button>
                        </>
                      ) : (
                        <span className="cancelled-text">No Action</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showRescheduleModal && (
        <div className="booking-modal">
          <div className="booking-card">
            <div className="card-header">
              <h2>Reschedule Appointment</h2>
            </div>

            {/* ✅ SERVICES */}
            <div className="form-group">
              <label>Select Services</label>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (!selectedAppointment) {
                    Swal.fire("Error", "Appointment data missing", "error");
                    return;
                  }

                  navigate("/selectservices", {
                    state: {
                      salonId: selectedAppointment?.ownerId, 
                      selectedServices,
                      fromReschedule: true,
                      appointmentData: selectedAppointment, 
                    },
                  });
                }}
              >
                Choose Services ({selectedServices.length})
              </button>

              {selectedServices.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  {selectedServices.map((s) => (
                    <span key={s._id} className="tag">
                      {s.serviceName}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* DATE */}
            <div className="form-group">
              <label>Select New Date</label>
              <input
                type="date"
                className="custom-datepicker"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            {/* TIME */}
            <div className="form-group">
              <label>Select New Time</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              >
                <option value="">Select Time</option>
                {timeSlots.map((t, i) => (
                  <option key={i} value={t.startTime}>
                    {t.startTime} - {t.endTime}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTONS */}
            <div className="form-actions">
              <button className="btn-primary" onClick={handleReschedule}>
                Confirm Reschedule
              </button>

              <button
                className="btn-primary"
                onClick={() => setShowRescheduleModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAppointments;
