import React, { useState, useRef } from "react";
import "./MappingInterface.css";

import Conditions from "./Conditions";
import LabTests from "./LabTests";
import Commodities from "./Commodities";
import FamilyPlanning from "./FamilyPlanning";
import Vaccines from "./Vaccines";
import Procedures from "./Procedures";
import Imaging from "./Imaging";
import MaterializedViewIds from "./MaterializedViewIds";
import MaterializedViewIdsList from "./MaterializedViewIdsList";
import MaterializedViewIdsDetail from "./MaterializedViewIdsDetail";
import MappingDialog from "../../components/MappingDialog";
import UpdateButton from "../../components/UpdateButton";

const EafyaMapping = () => {
  const [activeTab, setActiveTab] = useState("dhis2");
  const [selectedMappingType, setSelectedMappingType] = useState("conditions");
  const [selectedMaterializedViewId, setSelectedMaterializedViewId] = useState(null);
  const materializedViewDetailRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const DHIS2_MAPPING_OPTIONS = [
    { 
      value: "conditions", 
      label: "Conditions", 
      icon: <i className="fas fa-heartbeat me-2"></i>,
      description: "Map HMIS condition codes to eAFYA diseases"
    },
    { 
      value: "commodities", 
      label: "Essential Commodities", 
      icon: <i className="fas fa-boxes me-2"></i>,
      description: "Map HMIS commodity codes to eAFYA products"
    },
    { 
      value: "labtests", 
      label: "Lab Tests", 
      icon: <i className="fas fa-vial me-2"></i>,
      description: "Map HMIS lab test codes to eAFYA laboratory tests"
    },
    { 
      value: "familyplanning", 
      label: "Family Planning", 
      icon: <i className="fas fa-venus-mars me-2"></i>,
      description: "Map HMIS family planning codes to eAFYA items"
    },
    { 
      value: "vaccines", 
      label: "Vaccines", 
      icon: <i className="fas fa-syringe me-2"></i>,
      description: "Map HMIS vaccine codes to eAFYA vaccines"
    },
    { 
      value: "procedures", 
      label: "Surgical Procedures", 
      icon: <i className="fas fa-user-md me-2"></i>,
      description: "Map HMIS Surgical Procedures to eAFYA Procedures"
    },
    { 
      value: "imaging", 
      label: "Radiology and Imaging", 
      icon: <i className="fas fa-x-ray me-2"></i>,
      description: "Map HMIS Radiology and Imaging to eAFYA Ids"
    },
  ];

  const handleOpenDialog = (dialogData) => {
    setDialogData(dialogData);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  };

  const handleSaveDialog = (selectedIds) => {
    if (dialogData && dialogData.onSave) {
      dialogData.onSave(selectedIds);
    }
    handleCloseDialog();
  };

  const renderPageHeader = () => (
    <div className="bg-light border-bottom">
      <div className="container-fluid px-4 py-3">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="display-6 fw-bold mb-2 text-dark">
              <i className="fas fa-database me-3 text-primary"></i>
              eAFYA HMIS Mapping
            </h1>
            <p className="text-muted mb-0 fs-5">
              Manage and configure data mappings between HMIS and eAFYA EMR
            </p>
          </div>
          {/* <div className="col-lg-4 mt-2 mt-lg-0">
            <div className="d-flex justify-content-end">
              <UpdateButton />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );

  const renderTabNavigation = () => (
    <div className="border-bottom">
      <div className="container-fluid px-4 py-3">
        <ul className="nav nav-tabs nav-tabs-custom border-0" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "dhis2" ? "active" : ""}`}
              onClick={() => setActiveTab("dhis2")}
              type="button"
              role="tab"
            >
              <i className="fas fa-database me-2"></i>
              DHIS2 Mapping
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "customization" ? "active" : ""}`}
              onClick={() => setActiveTab("customization")}
              type="button"
              role="tab"
            >
              <i className="fas fa-cogs me-2"></i>
              Customization Sets
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderDHIS2TabContent = () => (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0">
              <h5 className="card-title mb-0 fw-semibold">
                <i className="fas fa-exchange-alt me-2 text-primary"></i>
                Mapping Type
              </h5>
              <p className="text-muted small mb-0 mt-1">
                Select the type of data mapping to configure
              </p>
            </div>
            <div className="card-body p-3">
              <div className="d-grid gap-2">
                {DHIS2_MAPPING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`btn text-start ${
                      selectedMappingType === option.value 
                        ? "btn-primary text-white" 
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedMappingType(option.value)}
                    style={{ minHeight: "55px" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className={selectedMappingType === option.value ? "text-white" : "text-primary"}>
                        {option.icon}
                      </span>
                      <div className="flex-grow-1">
                        <div className={`fw-semibold ${
                          selectedMappingType === option.value ? "text-white" : "text-dark"
                        }`}>
                          {option.label}
                        </div>
                        <small className={`d-block ${
                          selectedMappingType === option.value ? "text-white-75" : "text-muted"
                        }`}>
                          {option.description}
                        </small>
                      </div>
                      {selectedMappingType === option.value && (
                        <i className="fas fa-check-circle text-white ms-2"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title mb-0 fw-semibold">
                  {DHIS2_MAPPING_OPTIONS.find(opt => opt.value === selectedMappingType)?.icon}
                  <span className="ms-2">
                    {DHIS2_MAPPING_OPTIONS.find(opt => opt.value === selectedMappingType)?.label} Mapping
                  </span>
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  {DHIS2_MAPPING_OPTIONS.find(opt => opt.value === selectedMappingType)?.description}
                </p>
              </div>
              {/* <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Refresh
              </button> */}
            </div>
            <div className="card-body p-0">
              {renderSelectedComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomizationTabContent = () => (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0">
              <h5 className="card-title mb-0 fw-semibold">
                <i className="fas fa-database me-2 text-primary"></i>
                Materialized View IDs
              </h5>
              <p className="text-muted small mb-0 mt-1">
                Select a materialized view ID to manage its mappings
              </p>
            </div>
            <div className="card-body p-2" style={{ maxHeight: "600px", overflowY: "auto" }}>
              <MaterializedViewIdsList 
                onItemSelect={setSelectedMaterializedViewId}
                selectedItem={selectedMaterializedViewId}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title mb-0 fw-semibold">
                  {selectedMaterializedViewId ? `${selectedMaterializedViewId}` : "Select a Materialized View ID"}
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  {selectedMaterializedViewId 
                    ? `Manage details for ${selectedMaterializedViewId}` 
                    : "Choose a materialized view ID from the left to view and manage its details"
                  }
                </p>
              </div>
              {selectedMaterializedViewId && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => materializedViewDetailRef.current?.openAdd()}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Mapping
                </button>
              )}
            </div>
            <div className="card-body p-0">
              {selectedMaterializedViewId ? (
                <MaterializedViewIdsDetail 
                  ref={materializedViewDetailRef}
                  name={selectedMaterializedViewId}
                  onOpenDialog={handleOpenDialog}
                />
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-database fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No Materialized View ID Selected</h5>
                  <p className="text-muted">Please select a materialized view ID from the left panel to view its mappings.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSelectedComponent = () => {
    switch (selectedMappingType) {
      case "commodities":
        return <Commodities />;
      case "labtests":
        return <LabTests />;
      case "familyplanning":
        return <FamilyPlanning />;
      case "vaccines":
        return <Vaccines />;
      case "conditions":
        return <Conditions />;
      case "procedures":
        return <Procedures />;
      case "imaging":
        return <Imaging />;
      default:
        return <Conditions />;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {renderPageHeader()}
      {renderTabNavigation()}
      <div className="tab-content">
        {activeTab === "dhis2" && renderDHIS2TabContent()}
        {activeTab === "customization" && renderCustomizationTabContent()}
      </div>
      
      {dialogOpen && dialogData && (
        <MappingDialog
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveDialog}
          hmisName={dialogData.hmisName}
          section={dialogData.section}
          eafyaItems={dialogData.eafyaItems}
          onEafyaItemsLoaded={dialogData.onEafyaItemsLoaded}
          datasetCode={dialogData.datasetCode}
          searchEndpoint={dialogData.searchEndpoint}
        />
      )}
    </div>
  );
};

export default EafyaMapping;
