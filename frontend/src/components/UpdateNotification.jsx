import React from "react";
import { Alert, Button, Toast } from "react-bootstrap";
import { FaSync, FaTimes, FaCheckCircle } from "react-icons/fa";

const UpdateNotification = ({
  show,
  onUpdate,
  onDismiss,
  isUpdating = false,
}) => {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <Toast show={show} onClose={onDismiss} autohide={false}>
        <Toast.Header closeButton={false}>
          <FaSync size={16} className="me-2" />
          <strong className="me-auto">Update Available</strong>
          <Button
            variant="link"
            size="sm"
            onClick={onDismiss}
            className="p-0 ms-2"
          >
            <FaTimes size={16} />
          </Button>
        </Toast.Header>
        <Toast.Body>
          <p className="mb-2">A new version of the application is available.</p>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onUpdate}
              disabled={isUpdating}
              className="d-flex align-items-center gap-1"
            >
              {isUpdating ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Updating...</span>
                  </div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSync size={14} />
                  Update Now
                </>
              )}
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={onDismiss}>
              Later
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default UpdateNotification;
