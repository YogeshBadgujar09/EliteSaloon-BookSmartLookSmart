import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import OwnerRequestModal from "./OwnerRequestModal";
import Swal from "sweetalert2";
import axios from "axios";

const OwnerRequests = () => {

  const [showModal, setShowModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [owners, setOwners] = useState([]);

  // Fetch Owner Requests
  const fetchOwners = async () => {
    try {

      const res = await axios.get("http://localhost:5000/api/owner-requests");

      setOwners(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleView = (owner) => {
    setSelectedOwner(owner);
    setShowModal(true);
  };

  const handleApprove = () => {
    Swal.fire({
      icon: "success",
      title: "Approved!",
      text: `Owner ${selectedOwner.ownerName}'s request approved`,
    });

    setShowModal(false);
  };

  const handleReject = () => {
    Swal.fire({
      icon: "error",
      title: "Rejected!",
      text: `Owner ${selectedOwner.ownerName}'s request rejected`,
    });

    setShowModal(false);
  };

  return (
    <>
      <div className="ad-table-section">

        <div className="ad-section-header">
          <h2 className="ad-section-title">Owner Requests</h2>
        </div>

        <div className="ad-table-container">

          <div className="card-body ad-table-card-body p-0">

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