import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  // ✅ FETCH OWNERS
  const fetchOwners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/owners");

      // handle both cases
      const data = res.data.data || res.data;
      setOwners(data);
    } catch (error) {
      console.log("Error fetching owners", error);
    }
  };

  // ✅ OPEN MODAL
  const handleView = (owner) => {
    setSelectedOwner(owner);
    setShowModal(true);
  };

  // ✅ CLOSE MODAL
  const handleClose = () => {
    setShowModal(false);
    setSelectedOwner(null);
  };

  // ✅ TOGGLE STATUS
  const handleToggleStatus = async () => {
    if (!selectedOwner) return;

    try {
      setLoading(true);

      const newStatus =
        selectedOwner.ownerAccountStatus === "ACTIVE"
          ? "DEACTIVE"
          : "ACTIVE";

      await axios.put(
        `http://localhost:5000/admin/owner-status/${selectedOwner._id}`,
        { status: newStatus }
      );

      // refresh data from backend (best practice)
      await fetchOwners();

      // update modal data
      setSelectedOwner((prev) => ({
        ...prev,
        ownerAccountStatus: newStatus,
      }));
    } catch (err) {
      console.log("Error updating owner status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-content">
      <div className="ad-table-section">
        <div className="ad-section-header">
          <h2 className="ad-section-title">Owner List</h2>
        </div>

        <div className="ad-table-container">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Owner Name</th>
                <th>Salon Name</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {owners.length > 0 ? (
                owners.map((owner) => (
                  <tr key={owner._id}>
                    <td>{owner.ownerName}</td>
                    <td>{owner.ownerShopName}</td>
                    <td>{owner.ownerEmail}</td>
                    <td>{owner.ownerMobile}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => handleView(owner)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Owners Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ MODAL */}
      {showModal && selectedOwner && (
        <div className="modal show d-block custom-modal">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

              {/* HEADER */}
              <div className="modal-header">
                <h5 className="modal-title">Owner Details</h5>
                <button className="btn-close" onClick={handleClose}></button>
              </div>

              {/* BODY */}
              <div className="modal-body custom-body">

                {/* PROFILE */}
                <div className="profile-section">
                  <img
                    src={
                      selectedOwner?.ownerProfileImage
                        ? `http://localhost:5000/uploads/ownerProfile/${selectedOwner.ownerProfileImage}`
                        : `http://localhost:5000/uploads/default/defaultProfile.png`
                    }
                    alt="profile"
                    className="owner-photo"
                  />
                  <h4>{selectedOwner.ownerName}</h4>
                  <p>{selectedOwner.ownerShopName}</p>
                </div>

                {/* DETAILS */}
                <div className="details-grid">

                  <div className="detail-card">
                    <h6>Contact</h6>
                    <p><span>Email:</span> {selectedOwner.ownerEmail}</p>
                    <p><span>Mobile:</span> {selectedOwner.ownerMobile}</p>
                  </div>

                  <div className="detail-card">
                    <h6>Shop Info</h6>
                    <p><span>Shop Name:</span> {selectedOwner.ownerShopName}</p>
                    <p><span>District:</span> {selectedOwner.ownerShopDistrict}</p>
                  </div>

                  <div className="detail-card full">
                    <h6>Address</h6>
                    <p>{selectedOwner.ownerShopStreet}</p>
                    <p>
                      {selectedOwner.ownerShopCity},{" "}
                      {selectedOwner.ownerShopDistrict}
                    </p>
                    <p>
                      {selectedOwner.ownerShopState} -{" "}
                      {selectedOwner.ownerShopPincode}
                    </p>
                  </div>

                  <div className="detail-card">
                    <h6>Status</h6>
                    <p>
                      <span>Account:</span>{" "}
                      <span
                        className={
                          selectedOwner.ownerAccountStatus === "ACTIVE"
                            ? "green"
                            : "red"
                        }
                      >
                        {selectedOwner.ownerAccountStatus === "ACTIVE"
                          ? "Active"
                          : "Deactivated"}
                      </span>
                    </p>
                    <p>
                      <span>Approved:</span>{" "}
                      {selectedOwner.ownerApprovedStatus}
                    </p>
                  </div>

                  <div className="detail-card">
                    <h6>System</h6>
                    <p>
                      <span>Created:</span>{" "}
                      {new Date(
                        selectedOwner.ownerCreatedAt
                      ).toLocaleString()}
                    </p>
                    <p>
                      <span>Updated:</span>{" "}
                      {new Date(
                        selectedOwner.ownerUpdatedAt
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer">

                <button
                  className={
                    selectedOwner.ownerAccountStatus === "ACTIVE"
                      ? "btn btn-danger"
                      : "btn btn-success"
                  }
                  onClick={handleToggleStatus}
                  disabled={loading}
                >
                  {loading
                    ? "Updating..."
                    : selectedOwner.ownerAccountStatus === "ACTIVE"
                    ? "Deactivate"
                    : "Activate"}
                </button>

                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerList;