import React, { useState, useEffect } from 'react';
import API from '../../../../helpers/api';

const CommoditiesModal = ({ isOpen, onClose, onSubmit, hmisCode, hmisName }) => {
  const [products, setDiseases] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    if (!isOpen) return;
    
    const timeoutId = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen]);

  const fetchProducts = async (searchTerm = '') => {
    setLoadingDiseases(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('limit', '100');
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await API.get(`/mapping/commodities/items?${params.toString()}`);
      setDiseases(response.data || []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoadingDiseases(false);
    }
  };

  const handleCommoditiesToggle = (product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(selected => selected.id === product.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // No need for frontend filtering since backend handles search
  const filteredDiseases = products;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      setError('Please select at least one product');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        hmis_code: hmisCode,
        hmis_name: hmisName,
        products: selectedProducts.map(product => ({
          product_id: product.id,
          product_name: product.name,
        }))
      };

      console.log('Submitting payload:', payload);
      
      await API.post('/mapping/commodities', payload);
      onSubmit();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating mapping');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedProducts([]);
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
              <small className="text-muted">Select products to map to <strong>{hmisCode}</strong></small>
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
                  placeholder="Search by product name ..."
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
                        <span className="visually-hidden">Loading products...</span>
                      </div>
                      <div className="mt-2">Loading products...</div>
                    </div>
                  ) : filteredDiseases.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                      {products.length === 0 ? 'No products available' : 'No products match your search'}
                    </div>
                  ) : (
                    <div className="row g-2">
                      {filteredDiseases.map((product) => {
                        const isSelected = selectedProducts.some(selected => selected.id === product.id);
                        return (
                          <div className="col-12 col-md-4" key={product.id}>
                            <div
                              className={`card h-100 ${isSelected ? 'border-2 border-primary' : 'border-0'}`}
                              style={{ cursor: 'pointer', borderRadius: '0.6rem', boxShadow: isSelected ? '0 6px 12px rgba(20,115,255,0.06)' : 'none' }}
                              onClick={() => handleCommoditiesToggle(product)}
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
                                      <div className="text-wrap text-truncate" title={product.name} style={{ fontSize: '0.85rem' }}>
                                      {product.name}
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
                disabled={loading || selectedProducts.length === 0}
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

export default CommoditiesModal;