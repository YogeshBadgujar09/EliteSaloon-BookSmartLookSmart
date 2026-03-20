import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

const OwnerRequestModal = ({
  show,
  handleClose,
  owner,
  onApprove,
  onReject,
}) => {

  const [loading, setLoading] = useState(false);

  if (!owner) return null;

  // ✅ Approve with confirmation
  const handleApproveClick = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this owner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
    });

    if (result.isConfirmed) {
      setLoading(true);
      await onApprove();
      setLoading(false);
    }
  };

  // ✅ Reject with confirmation
  const handleRejectClick = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this owner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
    });

    if (result.isConfirmed) {
      setLoading(true);
      await onReject();
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={!loading ? handleClose : null} size="lg" centered>

      <Modal.Header closeButton>
        <Modal.Title>Owner Registration Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Row>

          <Col md={6}>
            <h6 className="text-primary mb-3">Personal Information</h6>

            <div className="mb-3">
              <label className="form-label fw-bold">Owner Name:</label>
              <p className="form-control-plaintext">{owner.ownerName}</p>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Email:</label>
              <p className="form-control-plaintext">{owner.ownerEmail}</p>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Mobile:</label>
              <p className="form-control-plaintext">{owner.ownerMobile}</p>
            </div>
          </Col>

          <Col md={6}>
            <h6 className="text-primary mb-3">Salon Information</h6>

            <div className="mb-3">
              <label className="form-label fw-bold">Salon Name:</label>
              <p className="form-control-plaintext">{owner.ownerShopName}</p>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Street:</label>
              <p className="form-control-plaintext">{owner.ownerShopStreet}</p>
            </div>

            <div className="mb-2">
              <label className="form-label fw-bold">
                City / District / State / Pincode:
              </label>

              <p className="form-control-plaintext">
                {owner.ownerShopCity}, {owner.ownerShopDistrict},{" "}
                {owner.ownerShopState} - {owner.ownerShopPincode}
              </p>
            </div>

            <div className="mt-3">
              <label className="form-label fw-bold">
                Shop Certificate:
              </label>

              <br />

              <img
                src={owner.ownerShopCertificate}
                alt="Shop Certificate"
                className="salon-image ms-3"
                width="150"
              />
            </div>
          </Col>

        </Row>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="success"
          onClick={handleApproveClick}
          disabled={loading}
        >
          {loading ? "Processing..." : "Approve"}
        </Button>

        <Button
          variant="danger"
          onClick={handleRejectClick}
          disabled={loading}
        >
          {loading ? "Processing..." : "Reject"}
        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default OwnerRequestModal;