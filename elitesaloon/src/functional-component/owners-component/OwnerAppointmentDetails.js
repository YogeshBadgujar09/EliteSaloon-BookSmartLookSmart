import React from "react";
import axios from "axios";

const OwnerAppointmentDetails = ({ data }) => {
  if (!data) return null;
  

// Yogesh deore
const handlePayment = async () => {
  try {

    // Create Order
    const orderRes = await axios.post(
      "http://localhost:5000/payment/create-order",
      {
        appointmentId: data._id
      }
    );

    const order = orderRes.data;

    // Razorpay Popup
    const options = {
      key: "rzp_test_SPZsgkIqFM9JER",
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: data.ownerId?.ownerShopName || "Elite Saloon",

      handler: async function (response) {

        await axios.post(
          "http://localhost:5000/payment/verify-payment",
          {
            appointmentId: data._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }
        );

        alert("Payment Successful");
        window.location.reload();
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {

    console.log("Payment Error:", error);
    alert("Payment Failed!");

  }
};

// ---------------------------------------------------------------------------------------

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
          <button className="od-btn od-btn-add"  onClick={handlePayment}>Complete Appointment</button>
        </div>
      )}
    </div>
  );
};

export default OwnerAppointmentDetails;