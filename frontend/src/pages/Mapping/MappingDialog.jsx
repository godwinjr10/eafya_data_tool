import React, { useState, useEffect } from 'react';
import API from '../../helpers/api';

// Constants for endpoint mappings
const ENDPOINT_MAPPINGS = {
  'HMIS1054': '/mapping/commodities',
  'HMIS1055': '/mapping/labtests',
  'HMIS1052': '/mapping/vaccines',
  'default': '/mapping/diseases'
};

// Utility functions
const getEndpointForDataset = (datasetCode) => {
  return ENDPOINT_MAPPINGS[datasetCode] || ENDPOINT_MAPPINGS.default;
};

const getItemTypeForDataset = (datasetCode) => {
  const typeMap = {
    'HMIS1054': 'commodity',
    'HMIS1055': 'lab test',
    'HMIS1052': 'vaccine'
  };
  return typeMap[datasetCode] || 'disease';
};

const MappingDialog = ({ isOpen, onClose, onSave, hmisName, section, eafyaItems, onEafyaItemsLoaded, datasetCode }) => {
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const itemType = getItemTypeForDataset(datasetCode);
  const isSpecialDataset = ['HMIS1054', 'HMIS1055', 'HMIS1052'].includes(datasetCode);
  
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
      const endpoint = getEndpointForDataset(datasetCode);
      const response = await API.get(endpoint);
      const items = response.data || [];
      onEafyaItemsLoaded(items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDiseases(filteredItems.map(item => item.id));
    } else {
      setSelectedDiseases([]);
    }
  };

  const handleItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedDiseases([...selectedDiseases, itemId]);
    } else {
      setSelectedDiseases(selectedDiseases.filter(id => id !== itemId));
    }
  };

  const handleSave = () => {
    onSave(selectedDiseases);
    onClose();
  };

  if (!isOpen) return null;

  const filteredItems = eafyaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.icd_code && item.icd_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const searchPlaceholder = `Search by ${itemType} name or ID${!isSpecialDataset ? ', or ICD code' : ''}...`;
  const dialogTitle = `Map eAFYA ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s to ${hmisName}`;
  
  return (
    <div className="mapping-dialog-overlay">
      <div className="mapping-dialog">
        <h3>{dialogTitle}</h3>
        
        <div className="dialog-search">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="item-list">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <table className="item-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={filteredItems.length > 0 && selectedDiseases.length === filteredItems.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th>ID</th>
                      {!isSpecialDataset && <th>ICD Code</th>}
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      <tr key={item.id} className="item-row">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedDiseases.includes(item.id)}
                            onChange={(e) => handleItemSelection(item.id, e.target.checked)}
                          />
                        </td>
                        <td>{item.id}</td>
                        {!isSpecialDataset && <td>{item.icd_code || '-'}</td>}
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
          <button className="primary-btn" onClick={handleSave}>
            Save Mapping
          </button>
        </div>
      </div>
    </div>
  );
};

export default MappingDialog;
