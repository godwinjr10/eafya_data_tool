import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { mappingService } from '../../services/mappingService';
import './styles.css';

const mainSections = [
  { id: 'conditions', name: 'Conditions' },
  { id: 'commodities', name: 'Commodities' },
  { id: 'lab_tests', name: 'Lab Tests' }
];

const subSections = {
  conditions: [
    { id: 'epidemic_prone', name: 'Epidemic Prone' },
    { id: 'tb', name: 'TB' },
    { id: 'cancer', name: 'Cancer' }
  ],
  commodities: [
    { id: 'essential_medicines', name: 'Essential Medicines' },
    { id: 'general_medicines', name: 'General Medicines' }
  ],
  lab_tests: [
    { id: 'blood_tests', name: 'Blood Tests' },
    { id: 'imaging', name: 'Imaging' }
  ]
};

const hmisData = {
  epidemic_prone: [
    {
      hmis_code: '51',
      hmis_name: 'EP01. Malaria',
      mappings: [
        { id: '710', name: 'Plasmodium falciparum malaria' },
        { id: '713', name: 'Plasmodium falciparum malaria, unspecified' },
        { id: '714', name: 'Plasmodium vivax malaria' },
        { id: '718', name: 'Plasmodium malariae malaria' },
        { id: '722', name: 'Other parasitologically confirmed malaria' },
        { id: '726', name: 'Unspecified malaria' }
      ]
    },
    {
      hmis_code: '152',
      hmis_name: 'EP02. Acute Flaccid Paralysis',
      mappings: [
        { id: '3182', name: 'Flaccid paraplegia' },
        { id: '3185', name: 'Flaccid tetraplegia' },
        { id: '6130', name: 'Flaccid neuropathic bladder, not elsewhere classified' }
      ]
    },
    {
      hmis_code: '152',
      hmis_name: 'EP02. Acute Flaccid Paralysis',
      mappings: [
        { id: '3182', name: 'Flaccid paraplegia' },
        { id: '3185', name: 'Flaccid tetraplegia' },
        { id: '6130', name: 'Flaccid neuropathic bladder, not elsewhere classified' }
      ]
    },
    {
      hmis_code: '152',
      hmis_name: 'EP02. Acute Flaccid Paralysis',
      mappings: [
        { id: '3182', name: 'Flaccid paraplegia' },
        { id: '3185', name: 'Flaccid tetraplegia' },
        { id: '6130', name: 'Flaccid neuropathic bladder, not elsewhere classified' }
      ]
    }
  ],
  tb: [
    {
      hmis_code: '168',
      hmis_name: 'EP16. Presumptive MDRTB cases',
      mappings: [
        { id: '11440', name: 'Observation for suspected tuberculosis' },
        { id: '28501', name: 'Observation for suspected tuberculosis ruled out' }
      ]
    }
  ]
};

// All available eAFYA diseases for mapping
const eafyaDiseases = [
  { id: '710', name: 'Plasmodium falciparum malaria' },
  { id: '713', name: 'Plasmodium falciparum malaria, unspecified' },
  { id: '714', name: 'Plasmodium vivax malaria' },
  { id: '718', name: 'Plasmodium malariae malaria' },
  { id: '722', name: 'Other parasitologically confirmed malaria' },
  { id: '726', name: 'Unspecified malaria' },
  { id: '3182', name: 'Flaccid paraplegia' },
  { id: '3185', name: 'Flaccid tetraplegia' },
  { id: '6130', name: 'Flaccid neuropathic bladder, not elsewhere classified' },
  { id: '394', name: 'Rabies, unspecified' },
  { id: '391', name: 'Rabies' },
  { id: '392', name: 'Sylvatic rabies' }
  // Add more diseases as needed
];

const MappingDialog = ({ isOpen, onClose, onSave, hmisName }) => {
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isOpen) return null;

  const filteredDiseases = eafyaDiseases.filter(disease => 
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="mapping-dialog-overlay">
      <div className="mapping-dialog">
        <h3>Map Diseases to {hmisName}</h3>
        <div className="dialog-search">
          <input
            type="text"
            placeholder="Search diseases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="disease-list">
          {filteredDiseases.map(disease => (
            <label key={disease.id} className="disease-item">
              <input
                type="checkbox"
                checked={selectedDiseases.includes(disease.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDiseases([...selectedDiseases, disease.id]);
                  } else {
                    setSelectedDiseases(selectedDiseases.filter(id => id !== disease.id));
                  }
                }}
              />
              <span>{disease.id} - {disease.name}</span>
            </label>
          ))}
          {filteredDiseases.length === 0 && (
            <div className="no-results">No matching diseases found</div>
          )}
        </div>
        <div className="dialog-actions">
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
          <button 
            className="primary-btn" 
            onClick={() => {
              onSave(selectedDiseases);
              onClose();
            }}
          >
            Save Mapping
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportSections = () => {
  const [selectedMainSection, setSelectedMainSection] = useState('');
  const [selectedSubSection, setSelectedSubSection] = useState('');
  const [hmisSearch, setHmisSearch] = useState('');
  const [currentMappings, setCurrentMappings] = useState({});
  const [dialogState, setDialogState] = useState({ 
    isOpen: false, 
    hmisCode: '', 
    hmisName: '' 
  });

  // Get all HMIS data across all sections
  const allHmisData = Object.values(hmisData).flat();
  
  // Filter based on search term first
  const searchFilteredData = hmisSearch
    ? allHmisData.filter(hmis =>
        hmis.hmis_name.toLowerCase().includes(hmisSearch.toLowerCase())
      )
    : allHmisData;

  // Then filter by selected section if one is selected
  const filteredHmisData = selectedSubSection
    ? searchFilteredData.filter(hmis => hmisData[selectedSubSection]?.some(item => item.hmis_code === hmis.hmis_code))
    : searchFilteredData;

  const handleAddMapping = (hmisCode, hmisName) => {
    setDialogState({
      isOpen: true,
      hmisCode,
      hmisName
    });
  };

  // Load existing mappings when component mounts
  useEffect(() => {
    const loadMappings = async () => {
      try {
        const allMappings = await mappingService.getAllMappings();
        // Group mappings by HMIS code
        const mappingsByCode = allMappings.reduce((acc, mapping) => {
          if (!acc[mapping.hmis_code]) {
            acc[mapping.hmis_code] = [];
          }
          acc[mapping.hmis_code].push({
            id: mapping.eafya_disease_id,
            name: mapping.eafya_disease_name
          });
          return acc;
        }, {});
        setCurrentMappings(mappingsByCode);
      } catch (error) {
        console.error('Error loading mappings:', error);
        // TODO: Add proper error handling/notification
      }
    };

    loadMappings();
  }, []);

  const handleSaveMapping = async (selectedDiseases) => {
    try {
      const mappingsToCreate = selectedDiseases.map(diseaseId => {
        const disease = eafyaDiseases.find(d => d.id === diseaseId);
        return {
          hmis_code: dialogState.hmisCode,
          hmis_name: dialogState.hmisName,
          eafya_disease_id: disease.id,
          eafya_disease_name: disease.name
        };
      });

      await mappingService.createManyMappings(mappingsToCreate);

      // Update local state
      setCurrentMappings(prev => ({
        ...prev,
        [dialogState.hmisCode]: mappingsToCreate.map(m => ({
          id: m.eafya_disease_id,
          name: m.eafya_disease_name
        }))
      }));
    } catch (error) {
      console.error('Error saving mappings:', error);
      // TODO: Add proper error handling/notification
    }
  };

  const handleRemoveMapping = async (hmisCode, diseaseId) => {
    try {
      await mappingService.deleteMapping(hmisCode, diseaseId);

      // Update local state
      setCurrentMappings(prev => ({
        ...prev,
        [hmisCode]: prev[hmisCode].filter(d => d.id !== diseaseId)
      }));
    } catch (error) {
      console.error('Error removing mapping:', error);
      // TODO: Add proper error handling/notification
    }
  };


  return (
    <div className="report-sections">
      <h1 className="page-title">HMIS eAFYA Mapping</h1>
      <div className="section-selectors">
        <div className="select-group">
          <label>Main Section:</label>
          <select 
            value={selectedMainSection} 
            onChange={(e) => {
              setSelectedMainSection(e.target.value);
              setSelectedSubSection('');
              setHmisSearch('');
            }}
          >
            <option value="">Select Main Section</option>
            {mainSections.map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        {selectedMainSection && (
          <div className="select-group">
            <label>Sub Section:</label>
            <select
              value={selectedSubSection}
              onChange={(e) => {
                setSelectedSubSection(e.target.value);
                setHmisSearch('');
              }}
            >
              <option value="">Select Sub Section</option>
              {subSections[selectedMainSection]?.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="select-group">
          <label>Search HMIS:</label>
          <input
            type="text"
            placeholder="Search by HMIS name..."
            value={hmisSearch}
            onChange={(e) => setHmisSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {selectedSubSection && (
        <div className="mapping-table">
          <table>
            <thead>
              <tr>
                <th>HMIS Code</th>
                <th>HMIS Name</th>
                <th>eAFYA Disease Mappings</th>
              </tr>
            </thead>
            <tbody>
              {filteredHmisData.map(hmis => (
                <tr key={hmis.hmis_code} className="hmis-row">
                  <td>{hmis.hmis_code}</td>
                  <td>{hmis.hmis_name}</td>
                  <td>
                    <div className="disease-mappings">
                      {(currentMappings[hmis.hmis_code] || hmis.mappings)?.map(disease => (
                        <div key={disease.id} className="disease-tag">
                          <span>{disease.id} - {disease.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemoveMapping(hmis.hmis_code, disease.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button 
                        className="add-mapping-btn"
                        onClick={() => handleAddMapping(hmis.hmis_code, hmis.hmis_name)}
                      >
                        <FaPlus /> Add Mapping
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, hmisCode: '', hmisName: '' })}
        onSave={handleSaveMapping}
        hmisName={dialogState.hmisName}
      />
    </div>
  );
};

export default ReportSections;