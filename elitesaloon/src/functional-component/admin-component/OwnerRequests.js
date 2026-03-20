import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import OwnerRequestModal from "./OwnerRequestModal";
import Swal from "sweetalert2";
import axios from "axios";

const OwnerRequests = () => {

  const [showModal, setShowModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Owner Requests
  const fetchOwners = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/owner-requests");

      setOwners(res.data.data);

    } catch (error) {
      Swal.fire("Error", "Failed to fetch owner requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleView = (owner) => {
    setSelectedOwner(owner);
    setShowModal(true);
  };

  // ✅ APPROVE
  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/owner-requests/approve/${selectedOwner._id}`
      );

      Swal.fire("Approved!", "Owner request approved", "success");

      setShowModal(false);
      fetchOwners(); // refresh data

    } catch (error) {
      Swal.fire("Error", "Failed to approve request", "error");
    }
  };

  // ✅ REJECT
  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/owner-requests/reject/${selectedOwner._id}`
      );

      Swal.fire("Rejected!", "Owner request rejected", "error");

      setShowModal(false);
      fetchOwners(); // refresh data

    } catch (error) {
      Swal.fire("Error", "Failed to reject request", "error");
    }
  };

  return (
    <>
      <div className="ad-table-section">

        <div className="ad-section-header">
          <h2 className="ad-section-title">Owner Requests</h2>
        </div>

        <div className="ad-table-container">
          <div className="card-body ad-table-card-body p-0">

            {loading ? (
              <p className="text-center p-3">Loading...</p>
            ) : owners.length === 0 ? (
              <p className="text-center p-3">No owner requests found</p>
            ) : (

              <Table responsive className="ad-table mb-0">

                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Owner Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {owners.map((owner, index) => (
                    <tr key={owner._id}>

                      <td>{index + 1}</td>

                      <td>
                        <strong>{owner.ownerName}</strong>
                      </td>

                      <td>{owner.ownerEmail}</td>

                      <td>{owner.ownerMobile}</td>

                      <td>
                        <Button
                          className="btn-view"
                          onClick={() => handleView(owner)}
                        >
                          View
                        </Button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </Table>

            )}

          </div>
        </div>
      </div>

      <OwnerRequestModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        owner={selectedOwner}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
};

export default OwnerRequests;