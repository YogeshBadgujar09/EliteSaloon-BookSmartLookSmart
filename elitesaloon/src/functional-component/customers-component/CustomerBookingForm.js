import React, { useEffect, useState } from "react";
import "./CustomerDashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const CustomerBookingForm = () => {
  const [salons, setSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [prevSalonId, setPrevSalonId] = useState("");

  const [form, setForm] = useState({
    salonId: "",
    serviceId: [],
    staffId: "",
    date: "",
    time: "",
  });

  // 🔥 Customer pincode (fallback bhi diya)
  const customerPincode = "395010";
  //    const customerPincode = "";

  //serive
useEffect(() => {
  if (location.state?.selectedServices) {
    setSelectedServices(location.state.selectedServices);
  }

  if (location.state?.salonId) {
    setForm((prev) => ({ ...prev, salonId: location.state.salonId }));
    setPrevSalonId(location.state.salonId);
  }
}, [location.state?.selectedServices, location.state?.salonId]); // ✅ stable

  // ===============================
  // ✅ FETCH SALONS
  // ===============================
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/appointment/get-salon/${customerPincode}`,
        );

        const data = await res.json();

        console.log("Saloons Available :", data);

        if (data.success) {
          setSalons(data.data);
        } else {
          setSalons([]);
        }
      } catch (err) {
        console.log("Salon fetch error:", err);
        setSalons([]);
      }
    };

    fetchSalons();
  }, [customerPincode]);

  // ===============================
  // FETCH SERVICES + STAFF
  // ===============================

  useEffect(() => {
    // ✅ Run only when salon actually changes
    if (form.salonId) {
     // ✅ Reset only if salon really changed by user
if (prevSalonId && form.salonId !== prevSalonId && selectedServices.length === 0) {
  setServices([]);
  setStaff([]);
  setSelectedServices([]);
  setForm((prev) => ({
    ...prev,
    serviceId: [],
    staffId: "",
    time: "",
  }));
}

      console.log("Salon Id :", form.salonId);

      const fetchData = async () => {
        try {
          // 👉 Fetch Services
          const serviceResponse = await fetch(
            `http://localhost:5000/owner/allservices/${form.salonId}`,
          );
          const serviceData = await serviceResponse.json();

          console.log("Get Services:", serviceData);
          setServices(serviceData.services || []);

          // 👉 Fetch Staff (same pattern)
          const staffResponse = await fetch(
            `http://localhost:5000/owner/staff-list/${form.salonId}`,
          );
          const staffData = await staffResponse.json();

          //   console.log("Get Staff:", staffData);
          // console.log("Get Staff:", JSON.stringify(staffData, null, 2));
          //   setStaff(staffData || []);
          setStaff(staffData.staff || []);
        } catch (err) {
          console.log("Fetch error:", err);
          setServices([]);
          setStaff([]);
        }
      };

      fetchData();

      // ✅ Update previous salon
      setPrevSalonId(form.salonId);
    }
  }, [form.salonId]); // Dependency array mein prevSalonId hata diya loop se bachne ke liye

  //slote
  useEffect(() => {
    setTimeSlots([]);
  }, [selectedServices]);

  // ===============================
  // FETCH SLOTS
  // ===============================

  useEffect(() => {
    if (form.staffId && form.date && selectedServices.length > 0) {
      setTimeSlots([]);

      fetch("http://localhost:5000/appointment/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: form.staffId,
          date: form.date,
          serviceIds: selectedServices.map((s) => s._id), // multiple services
        }),
      })
        .then((res) => res.json())
        .then((data) => setTimeSlots(data.availableSlots || []))
        .catch(() => setTimeSlots([]));
    }
  }, [form.staffId, form.date, selectedServices]);
  // ===============================
  // INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //   const onPrint = () => {
  //     console.log("Enterd Data :", form);
  //   };

// ===============================
// BOOK APPOINTMENT
// ===============================
const handleSubmit = async (e) => {
  e.preventDefault();

  //validation
  if (
    !form.salonId ||
    !form.staffId ||
    selectedServices.length === 0 ||
    !form.date ||
    !form.time
  ) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill all fields and select at least one service",
    });
    return;
  }

  // 🔥 Customer ID fetch and safety check
  const customerId = localStorage.getItem("customerId");

  if (!customerId || customerId === "null" || customerId === "undefined") {
    Swal.fire({
      icon: "error",
      title: "Login Required",
      text: "Booking ke liye kripya login karein ya apna account check karein.",
    });
    return;
  }

  // ✅ Updated: Only send serviceIds array to backend
  const appointmentDetails = {
    customerId: customerId,
    ownerId: form.salonId,
    staffId: form.staffId,
    serviceIds: selectedServices.map((s) => s._id), // only IDs, backend calculates duration & price
    date: form.date,
    startTime: form.time,
  };

  console.log("FINAL DATA TO SEND:", appointmentDetails);

  try {
    const res = await fetch("http://localhost:5000/appointment/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentDetails),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Appointment Booked 🎉",
        text: "Your appointment has been successfully booked!",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/customerdashboard", { state: { activeSection: "bookappointments" } });
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: data.message || "Something went wrong, please try again.",
        confirmButtonText: "OK",
      });
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  return (
    <div className="booking-modal">
      <div className="booking-card wide">
        <div className="card-header">
          <button className="back-arrow" onClick={() => navigate(-1)}>
            ← <span>Back</span>
          </button>
          <h2>Book Appointment</h2>
        </div>

        <form onSubmit={handleSubmit} className="profile-form grid-form"></form>

        <form onSubmit={handleSubmit} className="profile-form grid-form">
          {/* Salon */}
          <div className="form-group">
            <label>Select Salon</label>
            <select
              name="salonId"
              value={form.salonId}
              onChange={handleChange}
              required
            >
              <option value="">Select Salon</option>
              {salons.length > 0 ? (
                salons.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.ownerShopName} - {s.ownerName}
                  </option>
                ))
              ) : (
                <option disabled>No salons found</option>
              )}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Select Services</label>

            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                if (!form.salonId) {
                  Swal.fire({
                    icon: "warning",
                    title: "Select Salon First",
                    text: "Please select a salon before choosing services",
                  });
                  return;
                }

                navigate("/selectservices", {
                  state: {
                    salonId: form.salonId,
                    selectedServices,
                  },
                });
              }}
            >
              Choose Services ({selectedServices.length})
            </button>

            {/* ✅ Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div
                className="selected-services-summary"
                style={{ padding: "10px", gap: "8px" }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {selectedServices.map((s) => (
                    <div
                      key={s._id}
                      className="selected-item"
                      style={{ fontSize: "12px", padding: "4px 10px" }}
                    >
                      {s.serviceName}
                    </div>
                  ))}
                </div>
                <div
                  className="total"
                  style={{ fontSize: "14px", marginTop: "5px" }}
                >
                  Total: ₹
                  {selectedServices.reduce((sum, s) => sum + s.servicePrice, 0)}
                </div>
              </div>
            )}
          </div>

          {/* Staff */}
          <div className="form-group">
            <label>Select Staff</label>
            <select
              name="staffId"
              value={form.staffId}
              onChange={handleChange}
              required
              disabled={selectedServices.length === 0}
            >
              <option value="">Select Staff</option>
              {staff.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.staffName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
  if (!date) return;

  // Local date banate hain jo backend expect kar raha hai
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD

  setSelectedDate(date);
  setForm({ ...form, date: formattedDate, time: "" });
}}
              minDate={new Date()}
              placeholderText="Select Date"
              className="custom-datepicker"
              dateFormat="dd/MM/yyyy"
              withPortal // ✅ FIX jump issue
            />
          </div>

          {/* Time Slots */}
          <div className="form-group full-width">
            <label>Select Time Slot</label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            >
              <option value="">Select Time</option>
              {timeSlots.map((t, i) => (
                <option key={i} value={t.startTime}>
                  {t.startTime} - {t.endTime}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions full-width">
            {/* <button className="btn-primary" onClick={onPrint}>  */}
            <button className="btn-primary">Book Appointment</button>
            <button
              className="btn-primary"
              type="button"
              onClick={() => navigate("/customerdashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerBookingForm;
