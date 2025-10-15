import React, { useState, useEffect } from 'react';
import API from '../../../../helpers/api';

const MappingModal = ({ isOpen, onClose, onSubmit, hmisCode, hmisName }) => {
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
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
          <div className="modal-header bg-white border-0 pb-0 pt-3 px-4">
            <div>
              <h5 className="modal-title mb-1" style={{ fontWeight: 600 }}>
                Add New Mapping - {hmisName}
              </h5>
              <small className="text-muted">Select diseases to map to <strong>{hmisCode}</strong></small>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 pt-2 pb-3">

              {/* Search */}
              <div className="mb-3">
                {/* <label htmlFor="searchDiseases" className="form-label small text-muted">Search Diseases</label> */}
                <input
                  type="text"
                  className="form-control"
                  id="searchDiseases"
                  placeholder="Search by disease name, ID, or ICD code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '0.375rem' }}
                />
              </div>

              {/* Diseases Grid */}
              <div className="mb-3">
                <label className="form-label small text-muted">Available Diseases</label>
                <div 
                  className="border rounded p-3 bg-white"
                  style={{ 
                    maxHeight: '420px', 
                    overflowY: 'auto',
                    minHeight: '220px'
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
                              className={`card h-100 ${isSelected ? 'border-2 border-primary' : 'border-0'}`}
                              style={{ cursor: 'pointer', borderRadius: '0.6rem', boxShadow: isSelected ? '0 6px 12px rgba(20,115,255,0.06)' : 'none' }}
                              onClick={() => handleDiseaseToggle(disease)}
                            >
                              <div className="card-body py-1">
                                <div className="d-flex align-items-start">
                                  <div className="form-check me-2 mt-1">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}} // click handled on card
                                      readOnly
                                      style={{ width: '16px', height: '16px' }}
                                    />
                                  </div>
                                  <div className="flex-grow-1">
                                      <div className="text-wrap text-truncate" title={disease.disease_name} style={{ fontSize: '0.85rem' }}>
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

            <div className="modal-footer border-0 pt-0 pb-4 px-4">
              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading || selectedDiseases.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  `Save Mapping`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MappingModal;