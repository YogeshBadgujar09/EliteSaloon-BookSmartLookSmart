

import React, { useState, useEffect } from "react";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const CustomerAppointments = () => {
  const [myAppointments, setMyAppointments] = useState([]);

  // ✅ Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const customerId = localStorage.getItem("customerId");

      const res = await axios.get(
        `http://localhost:5000/appointment/customer-appointments/${customerId}`,
      );

      console.log("My Appointments:", res.data);

      setMyAppointments(res.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

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
      borderRadius: "15px",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
              // yogesh deore 
          const res = await axios.put("http://localhost:5000/customer/cancel-appointment", {
            appointmentId: id,
            status: "CANCELLED",
          });

          Swal.fire("Cancelled!", res.data.message, "success");

          // 🔥 Refresh from DB
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
                        <button
                          className="cancel-action-btn"
                          onClick={() => handleCancel(apt._id)}
                        >
                          CANCEL
                        </button>
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
    </div>
  );
};

export default CustomerAppointments;
