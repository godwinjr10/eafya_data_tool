import React, { useState, useEffect, useCallback } from "react";
import API from "../../../helpers/api";

const CustomizationMappingDialog = ({
  isOpen,
  onClose,
  onSave,
  hmisName,
  category,
  searchEndpoint,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(searchEndpoint);
      const fetchedItems = response.data || [];
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [searchEndpoint]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedItems([]);
      setItems([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  // Fetch items when dialog opens
  useEffect(() => {
    if (isOpen && searchEndpoint) {
      fetchItems();
    }
  }, [isOpen, searchEndpoint, fetchItems]);

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSave = () => {
    // Get the full item objects for selected items
    const selectedItemObjects = items.filter(item => selectedItems.includes(item.id));
    onSave(selectedItemObjects);
    onClose();
  };

  if (!isOpen) return null;

  const getCategoryLabel = (category) => {
    switch(category?.toLowerCase()) {
      case 'wards': return 'ward';
      case 'clinics': return 'clinic';
      case 'vaccines': return 'vaccine';
      case 'stores': return 'store';
      default: return 'item';
    }
  };

  const dialogTitle = `Map ${hmisName} to Data tool ${getCategoryLabel(category)}`;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 9999 }}
    >
      <div
        className="bg-white rounded-4 shadow-lg d-flex flex-column"
        style={{
          width: "1000px",
          maxWidth: "95vw",
          maxHeight: "85vh",
          minHeight: "600px",
        }}
      >
        {/* Header */}
        <div 
          className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div>
            <h5 className="mb-1 fw-bold text-dark" style={{ fontSize: "16px" }}>{dialogTitle}</h5>
            <small className="text-muted" style={{ fontSize: "12px" }}>Select the items you want to map</small>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-circle"
            onClick={onClose}
            style={{ width: "28px", height: "28px", fontSize: "12px" }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2 border-bottom">
          <div className="position-relative">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0" style={{ fontSize: "12px", padding: "4px 8px" }}>
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                placeholder={`Search ${category?.toLowerCase() || 'items'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control border-start-0 border-end-0"
                style={{ fontSize: "13px", padding: "4px 8px" }}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  onClick={() => setSearchTerm("")}
                  type="button"
                  style={{ fontSize: "12px", padding: "4px 8px" }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow-1 overflow-auto px-3 py-2">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading {category?.toLowerCase() || 'items'}...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div>
              {/* Header with count and select all */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0 text-dark" style={{ fontSize: "14px" }}>
                    Available {category?.toLowerCase() || 'items'}
                  </h6>
                  <span className="badge bg-primary rounded-pill" style={{ fontSize: "11px", padding: "2px 6px" }}>
                    {filteredItems.length}
                  </span>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAll"
                    style={{ transform: 'scale(0.9)' }}
                    checked={
                      filteredItems.length > 0 &&
                      filteredItems.every(item => selectedItems.includes(item.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="selectAll" style={{ fontSize: "13px" }}>
                    Select All Visible
                  </label>
                </div>
              </div>

              {/* Items Grid - 3 columns */}
              <div className="row g-2">
                {filteredItems.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                    <div 
                      className={`card h-100 border-0 shadow-sm transition-all ${
                        selectedItems.includes(item.id) 
                          ? 'border-primary bg-primary bg-opacity-10' 
                          : 'border-light hover-shadow'
                      }`}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        minHeight: '40px',
                        borderRadius: '4px'
                      }}
                      onClick={() => {
                        const isSelected = selectedItems.includes(item.id);
                        handleItemSelection(item.id, !isSelected);
                      }}
                    >
                      <div className="card-body d-flex align-items-center p-1">
                        <div className="form-check me-2 mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`item-${item.id}`}
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleItemSelection(item.id, e.target.checked);
                            }}
                            style={{ transform: 'scale(1.0)' }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="text-dark fw-medium" style={{ fontSize: "12px" }}>
                            {item.name}
                          </div>
                        </div>
                        {selectedItems.includes(item.id) && (
                          <div className="text-primary" style={{ fontSize: "10px" }}>
                            <i className="fas fa-check-circle"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fas fa-search text-muted" style={{ fontSize: "4rem" }}></i>
              </div>
              <h5 className="text-muted mb-2">
                {searchTerm ? 'No matching items found' : 'No items available'}
              </h5>
              <p className="text-muted">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : `No ${category?.toLowerCase() || 'items'} available for mapping`
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="d-flex justify-content-between align-items-center px-3 py-2 border-top"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="text-muted" style={{ fontSize: "12px" }}>
            {selectedItems.length > 0 && (
              <span>
                <i className="fas fa-info-circle me-1"></i>
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-dark px-3"
              onClick={onClose}
              style={{ fontSize: "13px", padding: "6px 16px" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={handleSave}
              disabled={selectedItems.length === 0}
              style={{ fontSize: "13px", padding: "6px 16px" }}
            >
              <i className="fas fa-save me-1"></i>
              Save ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationMappingDialog;