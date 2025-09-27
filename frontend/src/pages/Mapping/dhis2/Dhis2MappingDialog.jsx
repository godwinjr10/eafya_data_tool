import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";

// Constants for endpoint mappings
const ENDPOINT_MAPPINGS = {
  HMIS1054: "/eafya/products",
  HMIS1055: "/eafya/labtests/items",
  HMIS1052: "/eafya/vaccines/items",
  HMIS1052_FP: "/eafya/familyplanning/items",
  HMIS1052_VACCINE: "/eafya/vaccines/items",
  HMIS1052_CONDITIONS: "/eafya/conditions/items",
  HMIS1052_PROCEDURES: "/eafya/procedures/items",
  HMIS1052_IMAGING: "/eafya/imaging/items",
  default: "/mapping/diseases",
};

// Utility functions
const getEndpointForDataset = (datasetCode) => {
  return ENDPOINT_MAPPINGS[datasetCode] || ENDPOINT_MAPPINGS.default;
};

const getItemTypeForDataset = (datasetCode) => {
  const typeMap = {
    HMIS1054: "commodity",
    HMIS1055: "lab test",
    HMIS1052: "vaccine",
    HMIS1052_FP: "family planning item",
    HMIS1052_VACCINE: "vaccine",
    HMIS1052_CONDITIONS: "disease",
    HMIS1052_PROCEDURES: "procedure",
    HMIS1052_IMAGING: "imaging",
  };
  return typeMap[datasetCode] || "disease";
};

const Dhis2MappingDialog = ({
  isOpen,
  onClose,
  onSave,
  hmisName,
  section,
  eafyaItems,
  onEafyaItemsLoaded,
  datasetCode,
  searchEndpoint,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const itemType = getItemTypeForDataset(datasetCode);
  const isSpecialDataset = [
    "HMIS1054",
    "HMIS1055",
    "HMIS1052",
    "HMIS1052_FP",
    "HMIS1052_VACCINE",
    "HMIS1052_CONDITIONS",
    "HMIS1052_PROCEDURES",
    "HMIS1052_IMAGING",
  ].includes(datasetCode);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedItems([]);
      setItems([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = searchEndpoint || getEndpointForDataset(datasetCode);
      const response = await API.get(endpoint);
      const fetchedItems = response.data || [];
      setItems(fetchedItems);
      onEafyaItemsLoaded(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [searchEndpoint, datasetCode, onEafyaItemsLoaded]);

  // Fetch items when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen, fetchItems]);

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.icd_code &&
        item.icd_code.toLowerCase().includes(searchTerm.toLowerCase()))
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
    if (selectedItems.length === 0) {
      toast.warning("Please select at least one item to map");
      return;
    }
    onSave(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  const dialogTitle = `Map eAFYA ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s to ${hmisName}`;

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
                placeholder={`Search ${itemType}s by name or ID${!isSpecialDataset ? ", or ICD code" : ""}...`}
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
              <p className="text-muted">Loading {itemType}s...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div>
              {/* Header with count and select all */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0 text-dark" style={{ fontSize: "14px" }}>
                    Available {itemType}s
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
                          {item.icd_code && (
                            <div className="text-muted" style={{ fontSize: "10px" }}>
                              ICD: {item.icd_code}
                            </div>
                          )}
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
                  : `No ${itemType}s available for mapping`
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

export default Dhis2MappingDialog;
