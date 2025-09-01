import React, { useState } from "react";
import Select from "react-select";

// Import existing components
import Conditions from "./Conditions";
import LabTests from "./LabTests";
import Commodities from "./Commodities";
import FamilyPlanning from "./FamilyPlanning";
import Vaccines from "./Vaccines";

const EafyaMapping = () => {
  // State management
  // Mapping type selector - for future component switching (each component manages its own endpoints)
  const [selectedMappingType, setSelectedMappingType] = useState("conditions");

  // Mapping type options - Each component will manage its own API endpoints
  const MAPPING_TYPE_OPTIONS = [
    { value: "conditions", label: "Conditions" },
    { value: "commodities", label: "Commodities" },
    { value: "labtests", label: "Latest Lab Tests" },
    { value: "familyplanning", label: "Family Planning" },
    { value: "vaccines", label: "Vaccines" },
  ];

  const renderPageTitle = () => (
    <div className="bg-primary bg-opacity-10 text-primary p-4 mb-4 rounded-bottom ">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item text-primary-50">Mapping</li>
                <li
                  className="breadcrumb-item active text-primary"
                  aria-current="page"
                >
                  eAFYA HMIS
                </li>
              </ol>
            </nav>
            <h1 className=" text-primary fw-bold mb-2" style={{fontSize: "1.3rem"}}>eAFYA HMIS Mapping</h1>
            <p className=" mb-0 text-primary-75">
              {MAPPING_TYPE_OPTIONS.find(
                (option) => option.value === selectedMappingType
              )?.label || "Select a mapping type to get started"}
            </p>
          </div>
          <div className="col-lg-4 mt-3 mt-lg-0">
            <div className="d-flex flex-column">
              <label className="form-label text-primary fw-semibold mb-2 text-uppercase small">
                Mapping Type
              </label>
              <Select
                value={MAPPING_TYPE_OPTIONS.find(
                  (option) => option.value === selectedMappingType
                )}
                onChange={(selectedOption) =>
                  setSelectedMappingType(selectedOption.value)
                }
                options={MAPPING_TYPE_OPTIONS}
                placeholder="Choose mapping type..."
                isSearchable={true}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Render different components based on selected mapping type
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
      default:
        return <Commodities />;
    }
  };

  return (
    <div className="">
      {renderPageTitle()}
      {renderSelectedComponent()}
    </div>
  );
};

export default EafyaMapping;
