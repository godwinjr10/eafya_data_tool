import React, { useState } from "react";
import { Button, Modal, Spinner, Alert, ProgressBar } from "react-bootstrap";
import {
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import API from "../helpers/api";

const MaterializedViewsButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [isCreatingViews, setIsCreatingViews] = useState(false);
  const [viewsProgress, setViewsProgress] = useState(0);
  const [viewsStatus, setViewsStatus] = useState(null);
  const [viewsMessage, setViewsMessage] = useState("");

  const triggerMaterializedViews = async () => {
    setIsCreatingViews(true);
    setViewsStatus("creating");
    setViewsProgress(0);
    setViewsMessage("Starting materialized views setup...");

    try {
      // Use fetch directly with the API base URL for Server-Sent Events
      const baseURL = API.defaults.baseURL || "http://localhost:5000";
      const response = await fetch(`${baseURL}/materialized-views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.status === "starting") {
                setViewsMessage(data.message);
                setViewsProgress(data.progress);
              } else if (data.status === "progress") {
                setViewsMessage(data.message);
                setViewsProgress(data.progress);
              } else if (data.status === "success") {
                setViewsMessage(data.message);
              } else if (data.status === "error") {
                setViewsMessage(data.message);
                setViewsStatus("error");
                setIsCreatingViews(false);
                return;
              } else if (data.status === "completed") {
                setViewsMessage(data.message);
                setViewsProgress(100);
                setViewsStatus("completed");
                setIsCreatingViews(false);
                return;
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error creating materialized views:", error);
      setViewsStatus("error");
      setViewsMessage(
        `❌ Failed to create materialized views: ${error.message}`
      );
      setIsCreatingViews(false);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setViewsStatus(null);
    setViewsProgress(0);
    setViewsMessage("");
  };

  return (
    <>
      <button
        onClick={handleShowModal}
        className=" btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
      >
        <FaDatabase size={14} />
        Reload Views
      </button>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Materialized Views</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-4">
              <FaDatabase size={48} className="text-info mb-3" />
              <h5>Create All Views</h5>
              <p className="text-muted">
                This will create/update all views for reporting:
                <br />
                • 45 materialized views
                <br />
                • 15 regular views
                <br />
                <strong>
                  Estimated time: 1-3 minutes (DIRECT script mode)
                </strong>
              </p>
            </div>

            <Button
              variant="info"
              onClick={triggerMaterializedViews}
              disabled={isCreatingViews}
              className="d-flex align-items-center gap-2 mx-auto"
              size="lg"
            >
              {isCreatingViews ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Creating Views...
                </>
              ) : (
                <>
                  <FaDatabase size={16} />
                  Create All Views
                </>
              )}
            </Button>

            {/* Progress Section */}
            {viewsStatus === "creating" && (
              <div className="mt-4">
                <ProgressBar
                  now={viewsProgress}
                  label={`${viewsProgress}%`}
                  variant="info"
                  className="mb-3"
                />
                <div className="text-start">
                  <small className="text-muted">{viewsMessage}</small>
                </div>
              </div>
            )}

            {viewsStatus === "completed" && (
              <div className="mt-4">
                <Alert variant="success">
                  <FaCheckCircle className="me-2" />
                  {viewsMessage}
                </Alert>
              </div>
            )}

            {viewsStatus === "error" && (
              <div className="mt-4">
                <Alert variant="danger">
                  <FaExclamationTriangle className="me-2" />
                  {viewsMessage}
                </Alert>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MaterializedViewsButton;
