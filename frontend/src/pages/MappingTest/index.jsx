import React, { useState } from "react";
import Dhis2Tab from "./dhis2";
import CustomizationTab from "./customization";
import "./styles.css";

const MappingTest = () => {
    const [activeTab, setActiveTab] = useState("dhis2");

    return (
        <div className="min-vh-100 bg-light">
            {/* Header Navigation */}
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

            {/* Tab Navigation */}
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
                                Customization Set Mapping
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* page content */}
            <div className="tab-content">
                {activeTab === "dhis2" && <Dhis2Tab />}
                {activeTab === "customization" && <CustomizationTab />}
            </div>
        </div>
    );
};

export default MappingTest;
