import React, { useState } from 'react';
import Select from 'react-select';

// Import existing components
import Conditions from './Conditions';
import LabTests from './LabTests';
import Commodities from './Commodities';
import FamilyPlanning from './FamilyPlanning';
import Vaccines from './Vaccines';

const EafyaMapping = () => {
  // State management
  // Mapping type selector - for future component switching (each component manages its own endpoints)
  const [selectedMappingType, setSelectedMappingType] = useState('commodities');



  // Mapping type options - Each component will manage its own API endpoints
  const MAPPING_TYPE_OPTIONS = [
    { value: 'commodities', label: 'Commodities' },
    { value: 'labtests', label: 'Latest Lab Tests' },
    { value: 'familyplanning', label: 'Family Planning' },
    { value: 'vaccines', label: 'Vaccines' },
    { value: 'conditions', label: 'Conditions' }
  ];



  // // Render functions
  // const renderPageTitle = () => (
  //   <div className="page-header">
  //     <div className="mapping-type-selector">
  //       <label>Mapping Type:</label>
  //       <Select
  //         value={MAPPING_TYPE_OPTIONS.find(option => option.value === selectedMappingType)}
  //         onChange={(selectedOption) => setSelectedMappingType(selectedOption.value)}
  //         options={MAPPING_TYPE_OPTIONS}
  //         placeholder="Select mapping type..."
  //         isSearchable={false}
  //         className="mapping-type-select"
  //         classNamePrefix="react-select"
  //       />
  //     </div>
  //     <h1 className="page-title">
  //       eAFYA Mapping Management - {MAPPING_TYPE_OPTIONS.find(option => option.value === selectedMappingType)?.label}
  //     </h1>
  //   </div>
  // );



  const renderPageTitle = () => (
    <div className="container-fluid py-3 mb-4">
      <div className="row align-items-center">
        <div className="col-md-8">
          <h1 className="h3 mb-1 text-primary fw-bold">
            eAFYA Mapping Management
          </h1>
          <p className="text-muted mb-0">
            {MAPPING_TYPE_OPTIONS.find(option => option.value === selectedMappingType)?.label || 'Select a mapping type'}
          </p>
        </div>
        <div className="col-md-4">
          <div className="d-flex flex-column">
            <label className="form-label fw-semibold mb-2">Mapping Type:</label>
            <Select
              value={MAPPING_TYPE_OPTIONS.find(option => option.value === selectedMappingType)}
              onChange={(selectedOption) => setSelectedMappingType(selectedOption.value)}
              options={MAPPING_TYPE_OPTIONS}
              placeholder="Select mapping type..."
              isSearchable={false}
              className="mapping-type-select"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>
    </div>
  );
  // Render different components based on selected mapping type
  const renderSelectedComponent = () => {
    switch (selectedMappingType) {
      case 'commodities':
        return <Commodities />;
      case 'labtests':
        return <LabTests />;
      case 'familyplanning':
        return <FamilyPlanning />;
      case 'vaccines':
        return <Vaccines />;
      case 'conditions':
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
