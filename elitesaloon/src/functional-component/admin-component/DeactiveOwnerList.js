import React, { useEffect, useState } from "react";
import axios from "axios";

const DeactiveOwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      // ✅ API CHANGE
      const res = await axios.get("http://localhost:5000/admin/get-deactive-owners-list");
      const data = res.data.data || res.data;
      setOwners(data);
    } catch (error) {
      console.log("Error fetching owners", error);
    }
  };

  const handleView = (owner) => {
    setSelectedOwner(owner);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOwner(null);
  };

  const handleToggleStatus = async () => {
    if (!selectedOwner) return;

    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/admin/owner-status",
        {
          ownerId: selectedOwner._id
        }
      );

      const updatedOwner = res.data.data;

      // ✅ SAME BEHAVIOR (NO REFRESH)
      setSelectedOwner(updatedOwner);

      setOwners((prev) =>
        prev.map((o) =>
          o._id === updatedOwner._id ? updatedOwner : o
        )
      );

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
          <h2 className="ad-section-title">Deactive Owner List</h2>
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

      {showModal && selectedOwner && (
        <div className="modal show d-block custom-modal">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Owner Details</h5>
                <button className="btn-close" onClick={handleClose}></button>
              </div>

              <div className="modal-body custom-body">

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
                  </div>

                </div>
              </div>

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

export default DeactiveOwnerList;