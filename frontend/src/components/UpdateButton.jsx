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
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [upgradeStep, setUpgradeStep] = useState("");

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

  const triggerUpgrade = async () => {
    setIsUpgrading(true);
    setUpdateStatus("upgrading");
    setUpgradeProgress(0);
    setUpgradeStep("Starting full upgrade...");

    // Full upgrade progress steps
    const progressSteps = [
      { step: "Pulling report scripts...", progress: 12 },
      { step: "Pulling data tool...", progress: 25 },
      { step: "Running setup scripts...", progress: 37 },
      { step: "Running Pentaho ETL...", progress: 50 },
      { step: "Deploying frontend...", progress: 62 },
      { step: "Restarting backend service...", progress: 75 },
      { step: "Running materialized views...", progress: 87 },
      { step: "Upgrade completed!", progress: 100 },
    ];

    // Animate progress
    let currentStepIndex = 0;
    const progressInterval = setInterval(() => {
      if (currentStepIndex < progressSteps.length) {
        setUpgradeStep(progressSteps[currentStepIndex].step);
        setUpgradeProgress(progressSteps[currentStepIndex].progress);
        currentStepIndex++;
      }
    }, 3000);

    try {
      const response = await API.post("/upgrade", {
        dryRun: false,
      });

      clearInterval(progressInterval);
      setUpgradeProgress(100);
      setUpgradeStep("Upgrade completed!");

      setUpdateStatus("upgraded");
      setIsUpgrading(false);

      // Show success message
      setTimeout(() => {
        alert(
          `Full upgrade completed successfully!\n\nAll systems have been updated and restarted.`
        );
        window.location.reload();
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error triggering upgrade:", error);
      setUpdateStatus("error");
      setIsUpgrading(false);
      setUpgradeProgress(0);
      setUpgradeStep("");
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
    setUpgradeProgress(0);
    setUpgradeStep("");
  };

  return (
    <>
      <button
        onClick={handleShowModal}
        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
      >
        <FaSync size={14} />
        Refresh
      </button>

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
              <div className="text-center">
                <div className="d-flex gap-2 justify-content-center mb-3">
                  <Button
                    variant={
                      versionInfo.git?.hasUpdates ? "success" : "primary"
                    }
                    onClick={() => triggerUpdate()}
                    disabled={isUpdating || isUpgrading}
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
                </div>
                <div className="row text-center">
                  <div className="col-12">
                    <small className="text-muted">
                      <strong>⚡ Fast Update:</strong>
                      <br />
                      Backend only (~30 seconds)
                    </small>
                  </div>
            
                </div>
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

          {updateStatus === "upgrading" && (
            <div className="text-center py-3">
              <div className="mb-3">
                <ProgressBar
                  now={upgradeProgress}
                  label={`${upgradeProgress}%`}
                  variant="danger"
                  animated
                  style={{ height: "25px" }}
                />
              </div>
              <p className="mb-2">
                <Spinner
                  animation="border"
                  variant="danger"
                  size="sm"
                  className="me-2"
                />
                {upgradeStep}
              </p>
              <small className="text-muted">
                {isUpgrading
                  ? "Full system upgrade in progress... This may take 5-10 minutes..."
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

          {updateStatus === "upgraded" && (
            <Alert variant="success" className="text-center">
              <FaCheckCircle size={24} className="mb-2" />
              <h6>Full Upgrade Successful!</h6>
              <p>
                All systems have been updated and restarted. The page will
                reload automatically...
              </p>
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
