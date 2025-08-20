import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import API from '../../helpers/api';
import './styles.css';

// Dataset code to display name mapping
const datasetDisplayNames = {
  'HMIS1052': 'Maternal & Child Health',
  'HMIS1051': 'Outpatient Diagnosis',
  'HMIS1055': 'Laboratory Tests',
  'HMIS1053': 'HIV/AIDS Testing Services',
  'HMIS1054': 'Essential Medicines',
  'HMIS108': 'IPD Monthly Report'
};

// Section ID to display name mapping
const sectionDisplayNames = {
  '1.3.1': 'Epidemic Prone Diseases',
  '1.3.2': 'Communicable Diseases',
  '1.3.3': 'Neonatal Diseases',
  '1.3.4': 'Non-Communicable Diseases',
  '1.3.5': 'Oral Diseases',
  '1.3.6': 'ENT Diseases',
  '1.3.7': 'Eye Conditions',
  '1.3.8': 'Mental Health',
  '1.3.9': 'Neurological Disorders',
  '1.3.10': 'Chronic Respiratory',
  '1.3.11': 'Cancers',
  '1.3.12': 'Palliative',
  '1.3.14': 'Disability',
  '1.3.15': 'Cardiovascular Diseases',
  '1.3.16': 'Renal Diseases',
  '1.3.17': 'Liver Diseases',
  '1.3.18': 'Endocrine & Metabolic Disorders',
  '1.3.19': 'Injuries',
  '1.3.20': 'Minor Operations in OPD',
  '1.3.21': 'Neglected Tropical Diseases',
  '1.3.22': 'Maternal Conditions',
  '1.3.23': 'Other OPD Conditions',
  '1.3.24': 'Deaths in OPD',
  '1.3.25': 'Emergency Medical Services',
  '1.3.26': 'TB Screening',
  '1.3.28': 'Nutrition Services',
  '1.3.29': 'Gender Based Violence'
};

const MappingDialog = ({ isOpen, onClose, onSave, hmisName, section, eafyaItems, onEafyaItemsLoaded }) => {
  // Determine which array to use based on section
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDiseases([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  // Fetch eAFYA items when dialog opens
  useEffect(() => {
    if (isOpen && section) {
      fetchEafyaItems();
    }
  }, [isOpen, section]);

  const fetchEafyaItems = async () => {
    setLoading(true);
    try {
      // Fetch diseases from the backend API endpoint
      const response = await API.get('/mapping/diseases');
      const items = response.data || [];
      onEafyaItemsLoaded(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  const filteredItems = eafyaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.icd_code && item.icd_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="mapping-dialog-overlay">
      <div className="mapping-dialog">
        <h3>Map eAFYA Items to {hmisName}</h3>
        <div className="dialog-search">
          <input
            type="text"
            placeholder="Search by disease name, ID, or ICD code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="disease-list">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <table className="disease-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={filteredItems.length > 0 && selectedDiseases.length === filteredItems.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDiseases(filteredItems.map(item => item.id));
                            } else {
                              setSelectedDiseases([]);
                            }
                          }}
                        />
                      </th>
                      <th>ID</th>
                      <th>ICD Code</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      <tr key={item.id} className="disease-row">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedDiseases.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDiseases([...selectedDiseases, item.id]);
                              } else {
                                setSelectedDiseases(selectedDiseases.filter(id => id !== item.id));
                              }
                            }}
                          />
                        </td>
                        <td>{item.id}</td>
                        <td>{item.icd_code || '-'}</td>
                        <td>{item.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-results">No matching items found</div>
              )}
            </>
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

const Mapping = () => {
  const [datasetCodes, setDatasetCodes] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [datasetElements, setDatasetElements] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [hmisSearch, setHmisSearch] = useState('');
  const [currentMappings, setCurrentMappings] = useState({});
  const [eafyaItems, setEafyaItems] = useState([]);
  const [dialogState, setDialogState] = useState({ 
    isOpen: false, 
    hmisCode: '', 
    hmisName: '',
    dataelementId: null // Added dataelementId to dialogState
  });
  const [loading, setLoading] = useState(false);

  // Fetch dataset codes on component mount
  useEffect(() => {
    fetchDatasetCodes();
  }, []);

  // Fetch dataset elements when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      fetchDatasetElements(selectedDataset);
      fetchDatasetMappings(selectedDataset);
    } else {
      setDatasetElements([]);
      setSelectedSection('');
      setCurrentMappings({});
    }
  }, [selectedDataset]);

  const fetchDatasetCodes = async () => {
    try {
      const response = await API.get('/mapping/datasets/codes');
      setDatasetCodes(response.data || []);
    } catch (error) {
      console.error('Error fetching dataset codes:', error);
      setDatasetCodes([]);
    }
  };

  const fetchDatasetElements = async (datasetCode) => {
    setLoading(true);
    try {
      const response = await API.get(`/mapping/datasets/${datasetCode}/elements`);
      setDatasetElements(response.data || []);
    } catch (error) {
      console.error('Error fetching dataset elements:', error);
      setDatasetElements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasetMappings = async (datasetCode) => {
    try {
      const response = await API.get(`/mapping/dataset/${datasetCode}/mappings`);
      setCurrentMappings(response.data || {});
    } catch (error) {
      console.error('Error fetching dataset mappings:', error);
      setCurrentMappings({});
    }
  };

  // Get unique section IDs from dataset elements
  const getUniqueSections = () => {
    const sections = [...new Set(datasetElements.map(el => el.section_id).filter(Boolean))];
    return sections.sort((a, b) => {
      const nameA = sectionDisplayNames[a] || a;
      const nameB = sectionDisplayNames[b] || b;
      return nameA.localeCompare(nameB);
    }).map(sectionId => ({
      id: sectionId,
      name: sectionDisplayNames[sectionId] || sectionId
    }));
  };

  // Get data for selected section
  const getSectionData = () => {
    if (!selectedSection) return [];
    return datasetElements.filter(el => el.section_id === selectedSection);
  };

  // Filter based on search term - search across all data elements when searching
  const filteredDataElements = hmisSearch
    ? datasetElements.filter(element =>
        element.dataelement_name.toLowerCase().includes(hmisSearch.toLowerCase()) ||
        element.dataelement_code.toLowerCase().includes(hmisSearch.toLowerCase())
      )
    : getSectionData();

  const handleAddMapping = (dataelementCode, dataelementName, dataelementId) => {
    setDialogState({
      isOpen: true,
      hmisCode: dataelementCode,
      hmisName: dataelementName,
      dataelementId: dataelementId
    });
  };

  const handleSaveMapping = async (selectedItems) => {
    try {
      // Get the eAFYA item details for the selected IDs
      const selectedEafyaItems = selectedItems.map(itemId => {
        // Find the item in the eafyaItems array from the dialog
        const item = eafyaItems.find(eafyaItem => eafyaItem.id === itemId);
        return {
          id: itemId,
          name: item ? item.name : `Item ${itemId}`
        };
      });

      // Prepare the mapping data
      const mappingData = {
        hmis_dataelement_code: dialogState.hmisCode,
        hmis_dataelement_name: dialogState.hmisName,
        dataelement_id: dialogState.dataelementId,
        dataset_code: selectedDataset,
        section_id: selectedSection,
        mappings: selectedEafyaItems
      };

      // Save to database via API
      const response = await API.post('/mapping/mappings', mappingData);
      
      if (response.status === 200) {
        // Update local state
        const newMappings = {
          ...currentMappings,
          [dialogState.hmisCode]: selectedEafyaItems
        };
        
        setCurrentMappings(newMappings);
        
        // Show success message (you can add a toast notification here)
        console.log('Mappings saved successfully:', response.data);
      }
    } catch (error) {
      console.error('Error saving mappings:', error);
      // Show error message to user
      alert('Error saving mappings. Please try again.');
    }
  };

  const handleRemoveMapping = async (dataelementCode, itemId) => {
    try {
      // Delete from database via API
      const response = await API.delete(`/mapping/mappings/${dataelementCode}/${itemId}`);
      
      if (response.status === 200) {
        // Update local state
        const newMappings = {
          ...currentMappings,
          [dataelementCode]: (currentMappings[dataelementCode] || []).filter(d => d.id !== itemId)
        };

        // If no mappings left for this data element, remove the key
        if (newMappings[dataelementCode].length === 0) {
          delete newMappings[dataelementCode];
        }

        setCurrentMappings(newMappings);
        
        console.log('Mapping deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting mapping:', error);
      alert('Error deleting mapping. Please try again.');
    }
  };

  const handleEafyaItemsLoaded = (items) => {
    setEafyaItems(items);
  };

  return (
    <div className="report-sections">
      <h1 className="page-title">
        HMIS eAFYA Mapping
        {selectedDataset && (
          <span className="selected-dataset">
            {' '}- {datasetDisplayNames[selectedDataset] || selectedDataset}
          </span>
        )}
        {selectedSection && (
          <span className="selected-section">
            {' '}- {sectionDisplayNames[selectedSection] || selectedSection}
          </span>
        )}
      </h1>
      <div className="section-selectors">
        <div className="select-group">
          <label>Dataset:</label>
          <select 
            value={selectedDataset} 
            onChange={(e) => {
              setSelectedDataset(e.target.value);
              setSelectedSection('');
              setHmisSearch('');
            }}
          >
            <option value="">Select Dataset</option>
            {datasetCodes.map(datasetCode => (
              <option key={datasetCode} value={datasetCode}>
                {datasetDisplayNames[datasetCode] || datasetCode}
              </option>
            ))}
          </select>
        </div>

        {selectedDataset && (
          <div className="select-group">
            <label>Section:</label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setHmisSearch('');
              }}
            >
              <option value="">Select Section</option>
              {getUniqueSections().map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        )}

                 <div className="select-group">
           <label>Search Data Elements:</label>
           <input
             type="text"
             placeholder="Search across all data elements..."
             value={hmisSearch}
             onChange={(e) => setHmisSearch(e.target.value)}
             className="search-input"
           />
         </div>
      </div>

      {loading && (
        <div className="loading-message">Loading dataset elements...</div>
      )}

      {selectedSection && !loading && (
        <div className="mapping-table">
          <table>
            <thead>
              <tr>
                <th>Data Element Code</th>
                <th>Data Element Name</th>
                <th>eAFYA Mappings</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataElements.map(element => (
                <tr key={element.id} className="hmis-row">
                  <td>{element.dataelement_code}</td>
                  <td>{element.dataelement_name}</td>
                  <td>
                    <div className="disease-mappings">
                      {(currentMappings[element.dataelement_code] || [])?.map(item => (
                        <div key={item.id} className="disease-tag">
                          <span>{item.id} - {item.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemoveMapping(element.dataelement_code, item.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button 
                        className="add-mapping-btn"
                        onClick={() => handleAddMapping(element.dataelement_code, element.dataelement_name, element.id)}
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
        onClose={() => setDialogState({ isOpen: false, hmisCode: '', hmisName: '', dataelementId: null })}
        onSave={handleSaveMapping}
        hmisName={dialogState.hmisName}
        section={selectedDataset}
        eafyaItems={eafyaItems}
        onEafyaItemsLoaded={handleEafyaItemsLoaded}
      />
    </div>
  );
};

export default Mapping;