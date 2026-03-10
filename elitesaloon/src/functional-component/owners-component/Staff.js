import React from "react";
import { FiUser, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const Staff = ({
  staff,
  setShowStaffModal,
  openEditStaff,
  deleteStaff,
}) => {
  return (
    <div className="od-section">
      <div className="od-section-header">
        <h2 className="od-section-title">Staff Management</h2>

        <button className="od-btn-add" onClick={() => setShowStaffModal(true)}>
          <FiPlus /> Add Staff
        </button>
      </div>

      <div className="od-card-grid">
        {staff.map((member) => (
          <div key={member._id} className="od-staff-card">
            <div className="od-staff-image">
              <FiUser />
            </div>

            <div className="od-staff-info">
              <h3 className="od-staff-name">{member.staffName}</h3>

              <p className="od-staff-role">{member.staffRole}</p>

              <div className="od-staff-specialization">
                {member.staffSpecialization.map((spec, i) => (
                  <span key={i} className="od-staff-tag">
                    {spec}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="od-btn od-btn-edit"
                  onClick={() => openEditStaff(member)}
                >
                  <FiEdit2 />
                </button>

                <button
                  className="od-btn od-btn-delete"
                  onClick={() => deleteStaff(member._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staff;