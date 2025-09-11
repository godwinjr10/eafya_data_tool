import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { FaSync, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import API from "../helpers/api";

const UpdateButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [versionInfo, setVersionInfo] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      const response = await API.get("/version");
      setVersionInfo(response.data);
      setLastChecked(new Date().toLocaleString());
      setUpdateStatus("success");
    } catch (error) {
      console.error("Error checking for updates:", error);
      setUpdateStatus("error");
    } finally {
      setIsChecking(false);
    }
  };

  const triggerUpdate = async () => {
    setIsUpdating(true);
    setUpdateStatus("updating");
    setUpdateProgress(0);
    setCurrentStep("Starting update...");

    // Fast update progress steps (backend only)
    const progressSteps = [
      { step: "Fetching latest changes...", progress: 20 },
      { step: "Pulling changes from GitHub...", progress: 40 },
      { step: "Installing backend dependencies...", progress: 60 },
      { step: "Preparing to restart server...", progress: 100 },
    ];

    // Animate progress with faster updates
    let currentStepIndex = 0;
    const progressInterval = setInterval(() => {
      if (currentStepIndex < progressSteps.length) {
        setCurrentStep(progressSteps[currentStepIndex].step);
        setUpdateProgress(progressSteps[currentStepIndex].progress);
        currentStepIndex++;
      }
    }, 1000);

    try {
      const response = await API.post("/update", {
        skipFrontendBuild: true,
      });

      clearInterval(progressInterval);
      setUpdateProgress(100);
      setCurrentStep("Update completed!");

      if (response.data.message === "Already up to date") {
        setUpdateStatus("up-to-date");
        setIsUpdating(false);
        // Refresh version info
        setTimeout(() => {
          checkForUpdates();
        }, 1000);
        return;
      }

      if (response.data.restartRequired) {
        setUpdateStatus("updated");
        setIsUpdating(false);

        // Show success message with version info
        setTimeout(() => {
          alert(
            `Update completed successfully!\n\nPrevious: ${response.data.previousVersion}\nNew: ${response.data.newVersion}\n\nServer will restart automatically.`
          );
          window.location.reload();
        }, 2000);
      } else {
        setUpdateStatus("updated");
        setIsUpdating(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error triggering update:", error);
      setUpdateStatus("error");
      setIsUpdating(false);
      setUpdateProgress(0);
      setCurrentStep("");
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    checkForUpdates();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateStatus(null);
    setUpdateProgress(0);
    setCurrentStep("");
  };

  return (
    <>
      <Button
        variant="outline-light"
        onClick={handleShowModal}
        className="d-flex align-items-center gap-2"
        size="sm"
        style={{
          border: "1px solid rgba(255,255,255,0.5)",
          color: "white",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <FaSync size={14} />
        Updates
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>System Updates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isChecking && (
            <div className="text-center py-3">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Checking for updates...</p>
            </div>
          )}

          {updateStatus === "success" && versionInfo && (
            <div>
              <Alert variant="info">
                <h6>Current Version Information</h6>
                <p>
                  <strong>Version:</strong> {versionInfo.version}
                </p>
                <p>
                  <strong>Name:</strong> {versionInfo.name}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(versionInfo.lastUpdated).toLocaleString()}
                </p>
                <p>
                  <strong>Uptime:</strong>{" "}
                  {Math.floor(versionInfo.uptime / 3600)} hours
                </p>
                {versionInfo.git && !versionInfo.git.error && (
                  <>
                    <hr />
                    <h6>Git Information</h6>
                    <p>
                      <strong>Current Commit:</strong>{" "}
                      {versionInfo.git.currentCommit}
                    </p>
                    <p>
                      <strong>Remote Commit:</strong>{" "}
                      {versionInfo.git.remoteCommit}
                    </p>
                    <p>
                      <strong>Last Commit:</strong>{" "}
                      {versionInfo.git.lastCommitDate}
                    </p>
                    {versionInfo.git.hasUpdates ? (
                      <Alert variant="warning" className="mt-2">
                        <FaExclamationTriangle size={16} className="me-2" />
                        <strong>Updates Available!</strong> New commits are
                        available on GitHub.
                      </Alert>
                    ) : (
                      <Alert variant="success" className="mt-2">
                        <FaCheckCircle size={16} className="me-2" />
                        <strong>Up to Date!</strong> You have the latest
                        version.
                      </Alert>
                    )}
                  </>
                )}
              </Alert>

              <div className="text-center">
                <Button
                  variant={versionInfo.git?.hasUpdates ? "success" : "primary"}
                  onClick={() => triggerUpdate()}
                  disabled={isUpdating}
                  className="d-flex align-items-center gap-2"
                  size="lg"
                >
                  {isUpdating ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSync size={16} />
                      {versionInfo.git?.hasUpdates
                        ? "Update Now"
                        : "Check Again"}
                    </>
                  )}
                </Button>
                <small className="text-muted mt-2 d-block">
                  <strong>⚡ Fast Update:</strong> Backend only (~30 seconds)
                </small>
              </div>
            </div>
          )}

          {updateStatus === "updating" && (
            <div className="text-center py-3">
              <div className="mb-3">
                <ProgressBar
                  now={updateProgress}
                  label={`${updateProgress}%`}
                  variant="warning"
                  animated
                  style={{ height: "25px" }}
                />
              </div>
              <p className="mb-2">
                <Spinner
                  animation="border"
                  variant="warning"
                  size="sm"
                  className="me-2"
                />
                {currentStep}
              </p>
              <small className="text-muted">
                {isUpdating
                  ? "Please wait, this may take a few minutes..."
                  : ""}
              </small>
            </div>
          )}

          {updateStatus === "updated" && (
            <Alert variant="success" className="text-center">
              <FaCheckCircle size={24} className="mb-2" />
              <h6>Update Successful!</h6>
              <p>The system will reload automatically...</p>
            </Alert>
          )}

          {updateStatus === "up-to-date" && (
            <Alert variant="info" className="text-center">
              <FaCheckCircle size={24} className="mb-2" />
              <h6>Already Up to Date!</h6>
              <p>You have the latest version from GitHub.</p>
            </Alert>
          )}

          {updateStatus === "error" && (
            <Alert variant="danger">
              <FaExclamationTriangle size={20} className="mb-1" />
              <strong>Error:</strong> Failed to check for updates. Please try
              again later.
            </Alert>
          )}

          {lastChecked && (
            <small className="text-muted">Last checked: {lastChecked}</small>
          )}
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

export default UpdateButton;
