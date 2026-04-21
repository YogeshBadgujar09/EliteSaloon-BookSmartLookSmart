import React from "react";

const OwnerAppointmentDetails = ({ data }) => {
  if (!data) return null;
  

  return (
    <div className="od-appointment-wrapper">
      {/* HEADER */}
      <h2 className="od-appointment-title">Appointment Details</h2>

      {/* BASIC INFO */}
      <div className="od-appointment-info">
        <div className="od-info-box">
          <span className="od-label">Customer</span>
          <span className="od-value">
            {data.customerId?.customerName || "N/A"}
          </span>
        </div>

        <div className="od-info-box">
          <span className="od-label">Owner</span>
          <span className="od-value">{data.ownerId?.ownerName || "N/A"}</span>
        </div>

        <div className="od-info-box">
          <span className="od-label">Staff</span>
          <span className="od-value">{data.staffId?.staffName || "N/A"}</span>
        </div>
      </div>

      {/* SERVICES */}
      <div className="od-appointment-section">
        <h4>Services</h4>

        <div className="od-service-list">
          {data.services?.map((s, i) => (
            <div key={i} className="od-service-item">
              <span>{s.serviceName}</span>
              <span className="price">₹{s.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DATE & TIME */}
      <div className="od-appointment-info">
        <div className="od-info-box">
          <span className="od-label">Date</span>
          <span className="od-value">{data.appointmentDate}</span>
        </div>

        <div className="od-info-box">
          <span className="od-label">Time</span>
          <span className="od-value">
            {data.startTime} - {data.endTime}
          </span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="od-total-box">
        <span>Total Price</span>
        <span className="total">₹{data.totalPrice || 0}</span>
      </div>

      {/* BUTTON */}
      {data.appointmentStatus === "CONFIRMED" && (
        <div className="od-action">
          <button className="od-btn od-btn-add">Complete Appointment</button>
        </div>
      )}
    </div>
  );
};

export default OwnerAppointmentDetails;
