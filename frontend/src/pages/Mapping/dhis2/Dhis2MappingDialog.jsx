import React, { useState, useEffect } from 'react';
import API from '../../../helpers/api';

const Dhis2MappingDialog = ({ isOpen, onClose, onSubmit, hmisCode, hmisName }) => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch diseases when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDiseases();
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    if (!isOpen) return;
    
    const timeoutId = setTimeout(() => {
      fetchDiseases(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen]);

  const fetchDiseases = async (searchTerm = '') => {
    setLoadingDiseases(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('limit', '100');
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await API.get(`/mapping/conditions/items?${params.toString()}`);
      setDiseases(response.data || []);
    } catch (err) {
      setError('Failed to load diseases');
      console.error('Error fetching diseases:', err);
    } finally {
      setLoadingDiseases(false);
    }
  };

  const handleDiseaseToggle = (disease) => {
    setSelectedDiseases(prev => {
      const isSelected = prev.some(selected => selected.disease_id === disease.disease_id);
      if (isSelected) {
        return prev.filter(selected => selected.disease_id !== disease.disease_id);
      } else {
        return [...prev, disease];
      }
    });
  };

  // No need for frontend filtering since backend handles search
  const filteredDiseases = diseases;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedDiseases.length === 0) {
      setError('Please select at least one disease');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        hmis_code: hmisCode,
        hmis_name: hmisName,
        diseases: selectedDiseases.map(disease => ({
          disease_id: disease.disease_id,
          disease_name: disease.disease_name,
          four_character_icd_code: disease.four_character_icd_code,
          five_character_icd_code: disease.five_character_icd_code
        }))
      };
      
      await API.post('/mapping/conditions', payload);
      onSubmit();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating mapping');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDiseases([]);
    setSearchTerm('');
    setError('');
    onClose();
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Prevent modal from showing if not open
  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      role="dialog"
      onClick={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Add New Mapping - {hmisName}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* HMIS Info */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="hmisCode" className="form-label">HMIS Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="hmisCode"
                    value={hmisCode}
                    disabled
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="hmisName" className="form-label">HMIS Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="hmisName"
                    value={hmisName}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Selected Count */}
              <div className="alert alert-info mb-3">
                <i className="fas fa-info-circle me-2"></i>
                Selected {selectedDiseases.length} disease{selectedDiseases.length !== 1 ? 's' : ''} for mapping
              </div>

              {/* Search */}
              <div className="mb-3">
                <label htmlFor="searchDiseases" className="form-label">Search Diseases</label>
                <input
                  type="text"
                  className="form-control"
                  id="searchDiseases"
                  placeholder="Search by disease name, ID, or ICD code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="form-text">
                  Showing first 100 results. Use search to find specific diseases.
                </div>
              </div>

              {/* Diseases Grid */}
              <div className="mb-3">
                <label className="form-label">Available Diseases</label>
                <div 
                  className="border rounded p-2" 
                  style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    minHeight: '200px'
                  }}
                >
                  {loadingDiseases ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading diseases...</span>
                      </div>
                      <div className="mt-2">Loading diseases...</div>
                    </div>
                  ) : filteredDiseases.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                      {diseases.length === 0 ? 'No diseases available' : 'No diseases match your search'}
                    </div>
                  ) : (
                    <div className="row g-2">
                      {filteredDiseases.map((disease) => {
                        const isSelected = selectedDiseases.some(selected => selected.disease_id === disease.disease_id);
                        return (
                          <div className="col-12 col-md-4" key={disease.disease_id}>
                            <div
                              className={`card h-100 ${isSelected ? 'border-primary' : ''}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDiseaseToggle(disease)}
                            >
                              <div className="card-body py-2">
                                <div className="d-flex align-items-start">
                                  <div className="form-check me-2 mt-1">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}} // click handled on card
                                      readOnly
                                    />
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="text-wrap" title={disease.disease_name}>
                                      {disease.disease_name}
                                    </div>
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || selectedDiseases.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  `Save Mapping (${selectedDiseases.length})`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dhis2MappingDialog;