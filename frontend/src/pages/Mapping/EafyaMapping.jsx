import React, { useState } from 'react';
import Select from 'react-select';
import './styles.css';

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



  // Render functions
  const renderPageTitle = () => (
    <div className="page-header">
      <div className="mapping-type-selector">
        <label>Mapping Type:</label>
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
      <h1 className="page-title">
        eAFYA Mapping Management - {MAPPING_TYPE_OPTIONS.find(option => option.value === selectedMappingType)?.label}
      </h1>
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
    <div className="report-sections">
      {renderPageTitle()}
      {renderSelectedComponent()}
    </div>
  );
};

export default EafyaMapping;
