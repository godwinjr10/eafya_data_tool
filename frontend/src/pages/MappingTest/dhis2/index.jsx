import React, { useState } from "react";

import Conditions from "./Conditions";
import LabTests from "./LabTests";
import Commodities from "./Commodities";
import FamilyPlanning from "./FamilyPlanning";
import Vaccines from "./Vaccines";
import Procedures from "./Procedures";
import Imaging from "./Imaging";

const Dhis2 = () => {
    const [selectedMappingType, setSelectedMappingType] = useState("conditions");

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
                                        className={`btn text-start ${selectedMappingType === option.value
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
                                                <div className={`fw-semibold ${selectedMappingType === option.value ? "text-white" : "text-dark"
                                                    }`}>
                                                    {option.label}
                                                </div>
                                                <small className={`d-block ${selectedMappingType === option.value ? "text-white-75" : "text-muted"
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
    )
}

export default Dhis2