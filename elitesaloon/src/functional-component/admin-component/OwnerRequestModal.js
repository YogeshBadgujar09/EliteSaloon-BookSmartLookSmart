import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

const OwnerRequestModal = ({
  show,
  handleClose,
  owner,
  onApprove,
  onReject,
}) => {
  if (!owner) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>

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
          className="btn-ad-cancel"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="success"
          className="btn-ad-approve"
          onClick={onApprove}
        >
          Approve
        </Button>

        <Button
          variant="danger"
          className="btn-ad-reject"
          onClick={onReject}
        >
          Reject
        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default OwnerRequestModal;