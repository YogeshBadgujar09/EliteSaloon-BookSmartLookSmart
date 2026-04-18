import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import OwnerAppointmentDetails from "./OwnerAppointmentDetails";
import Swal from "sweetalert2";
import axios from "axios";

const OwnerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const ownerId = localStorage.getItem("ownerId");

  //
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  /* ================= FETCH APPOINTMENTS ================= */
  const fetchAppointments = async () => {
    if (!ownerId) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/appointment/get-appointment/${ownerId}`,
      );

      console.log("Owner Appointments API:", res.data);

      // 👇 Handle different response formats safely
      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else if (res.data.appointments) {
        setAppointments(res.data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Failed to load appointments", "error");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const handleStatusUpdate = async (appointmentId, status) => {
    const actionText = status === "CONFIRMED" ? "Confirm" : "Cancel";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} this appointment?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "CONFIRMED" ? "#2ecc71" : "#e74c3c",
      confirmButtonText: `Yes, ${actionText} it!`,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.put(
        "http://localhost:5000/appointment/appointment-result",
        {
          appointmentId,
          status,
        },
      );

      console.log("Status Update Response:", res.data);

      if (res.data) {
        Swal.fire("Updated!", res.data.message, "success");

        // 🔥 refresh list after update
        fetchAppointments();
      }
    } catch (error) {
      console.log("Status Update Error:", error);

      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  /* ================= VIEW ================= */
  const handleView = (id) => {
    const selected = appointments.find((a) => a._id === id);
    setSelectedAppointment(selected);
  };
  /* ================= LOADING ================= */
  if (loading) {
    return <div style={{ padding: "20px" }}>Loading Appointments...</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="od-content">
      <div className="od-section-header">
        <h2 className="od-section-title">Customer Requests</h2>
        <p style={{ color: "#888", marginLeft: "20px", fontSize: "14px" }}>
          Manage your salon appointments here
        </p>
      </div>

      <div className="appointment-list-wrapper">
        {appointments.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
            No appointments found.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Client Name</th>
                <th>Services</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((apt, index) => (
                <tr key={apt._id} className="table-row">
                  {/* SR NO */}
                  <td style={{ color: "#d4af37", fontWeight: "bold" }}>
                    {index + 1}
                  </td>

                  {/* NAME */}
                  <td>
                    <strong style={{ fontSize: "15px" }}>
                      {apt.customerId?.customerName || "Guest"}
                    </strong>
                  </td>

                  {/* SERVICES */}
                  <td>
                    {apt.services?.map((s, i) => (
                      <span key={i} className="tag">
                        {s.serviceName}
                        {i < apt.services.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>

                  {/* DATE TIME */}
                  <td>
                    <span style={{ fontSize: "13px", color: "#666" }}>
                      {apt.appointmentDate} | {apt.startTime}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`status-pill ${apt.appointmentStatus.toLowerCase()}`}
                    >
                      {apt.appointmentStatus}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td style={{ textAlign: "center" }}>
                    {apt.appointmentStatus === "PENDING" ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="btn-action-view"
                          onClick={() =>
                            handleStatusUpdate(apt._id, "CONFIRMED")
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="btn-action-view"
                          style={{ color: "#e74c3c" }}
                          onClick={() =>
                            handleStatusUpdate(apt._id, "CANCELLED")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-action-view"
                        onClick={() => handleView(apt._id)}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedAppointment && (
        <div className="od-modal-overlay active">
          <div className="od-modal">
            {/* CLOSE BUTTON */}
            <div className="od-modal-header">
              <h3>Appointment Details</h3>
              <button
                className="od-modal-close"
                onClick={() => setSelectedAppointment(null)}
              >
                ✕
              </button>
            </div>

            {/* CHILD COMPONENT */}
            <div className="od-modal-body">
              <OwnerAppointmentDetails data={selectedAppointment} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerAppointments;
