import React, { useState, useEffect } from "react";
import API from "../helpers/api";

// Constants for endpoint mappings
const ENDPOINT_MAPPINGS = {
  HMIS1054: "/eafya/products",
  HMIS1055: "/eafya/lab",
  HMIS1052: "/eafya/vaccines",
  HMIS1052_FP: "/eafya/familyplanning-items",
  HMIS1052_VACCINE: "/eafya/vaccine-items",
  HMIS1052_CONDITIONS: "/eafya/disease-items",
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
  };
  return typeMap[datasetCode] || "disease";
};

const MappingDialog = ({
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
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const itemType = getItemTypeForDataset(datasetCode);
  const isSpecialDataset = [
    "HMIS1054",
    "HMIS1055",
    "HMIS1052",
    "HMIS1052_FP",
    "HMIS1052_VACCINE",
    "HMIS1052_CONDITIONS",
  ].includes(datasetCode);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDiseases([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  // Fetch eAFYA items when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchEafyaItems();
    }
  }, [isOpen]);

  const fetchEafyaItems = async () => {
    setLoading(true);
    try {
      // Use searchEndpoint if provided, otherwise fall back to datasetCode mapping
      const endpoint = searchEndpoint || getEndpointForDataset(datasetCode);
      const response = await API.get(endpoint);
      const items = response.data || [];
      onEafyaItemsLoaded(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDiseases(filteredItems.map((item) => item.id));
    } else {
      setSelectedDiseases([]);
    }
  };

  const handleItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedDiseases([...selectedDiseases, itemId]);
    } else {
      setSelectedDiseases(selectedDiseases.filter((id) => id !== itemId));
    }
  };

  const handleSave = () => {
    onSave(selectedDiseases);
    onClose();
  };

  if (!isOpen) return null;

  const filteredItems = eafyaItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.icd_code &&
        item.icd_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const searchPlaceholder = `Search by ${itemType} name or ID${
    !isSpecialDataset ? ", or ICD code" : ""
  }...`;
  const dialogTitle = `Map eAFYA ${
    itemType.charAt(0).toUpperCase() + itemType.slice(1)
  }s to ${hmisName}`;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 9999 }}
    >
      <div
        className="bg-white rounded-3 shadow-lg p-4 d-flex flex-column"
        style={{
          width: "850px",
          maxWidth: "95vw",
          maxHeight: "90vh",
          gap: "20px",
        }}
      >
        <div className="mb-3">
          <label className="form-label fw-semibold text-dark small mb-2">
            Search Items
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control border-start-0"
            />
          </div>
        </div>

        <div
          className="border rounded-3 shadow-sm overflow-auto"
          style={{ maxHeight: "450px" }}
        >
          {loading ? (
            <div className="p-4 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading items...</p>
            </div>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <table
                  className="table table-hover mb-0"
                  style={{ fontSize: "14px" }}
                >
                  <thead className="table-primary sticky-top">
                    <tr>
                      <th
                        className="text-center fw-semibold"
                        style={{ width: "50px" }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            filteredItems.length > 0 &&
                            selectedDiseases.length === filteredItems.length
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="form-check-input"
                        />
                      </th>
                      <th className="fw-semibold" style={{ width: "90px" }}>
                        ID
                      </th>
                      {!isSpecialDataset && (
                        <th className="fw-semibold" style={{ width: "130px" }}>
                          ICD Code
                        </th>
                      )}
                      <th className="fw-semibold" style={{ minWidth: "220px" }}>
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={selectedDiseases.includes(item.id)}
                            onChange={(e) =>
                              handleItemSelection(item.id, e.target.checked)
                            }
                            className="form-check-input"
                          />
                        </td>
                        <td className="text-muted">{item.id}</td>
                        {!isSpecialDataset && (
                          <td>
                            <code className="text-info small">
                              {item.icd_code || "-"}
                            </code>
                          </td>
                        )}
                        <td className="fw-medium">{item.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center">
                  <div className="text-muted">
                    <i className="bi bi-search display-6 mb-3"></i>
                    <p className="mb-0">No matching items found</p>
                    <small>Try adjusting your search criteria</small>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <div className="text-muted small">
            {filteredItems.length > 0 &&
              `${selectedDiseases.length} of ${filteredItems.length} items selected`}
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-secondary px-4"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary px-4"
              onClick={handleSave}
              disabled={selectedDiseases.length === 0}
            >
              <i className="bi bi-check2 me-1"></i>
              Save Mapping ({selectedDiseases.length})
            </button>
          </div>
        </div>
      </div>
    </div>
    // <div className="mapping-dialog-overlay">
    //   <div className="mapping-dialog">
    //     <h3>{dialogTitle}</h3>

    //     <div className="dialog-search">
    //       <input
    //         type="text"
    //         placeholder={searchPlaceholder}
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //         className="search-input"
    //       />
    //     </div>

    //     <div className="item-list">
    //       {loading ? (
    //         <div className="loading">Loading...</div>
    //       ) : (
    //         <>
    //           {filteredItems.length > 0 ? (
    //             <table className="item-table">
    //               <thead>
    //                 <tr>
    //                   <th>
    //                     <input
    //                       type="checkbox"
    //                       checked={filteredItems.length > 0 && selectedDiseases.length === filteredItems.length}
    //                       onChange={(e) => handleSelectAll(e.target.checked)}
    //                     />
    //                   </th>
    //                   <th>ID</th>
    //                   {!isSpecialDataset && <th>ICD Code</th>}
    //                   <th>Name</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {filteredItems.map(item => (
    //                   <tr key={item.id} className="item-row">
    //                     <td>
    //                       <input
    //                         type="checkbox"
    //                         checked={selectedDiseases.includes(item.id)}
    //                         onChange={(e) => handleItemSelection(item.id, e.target.checked)}
    //                       />
    //                     </td>
    //                     <td>{item.id}</td>
    //                     {!isSpecialDataset && <td>{item.icd_code || '-'}</td>}
    //                     <td>{item.name}</td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           ) : (
    //             <div className="no-results">No matching items found</div>
    //           )}
    //         </>
    //       )}
    //     </div>

    //     <div className="dialog-actions">
    //       <button className="secondary-btn" onClick={onClose}>Cancel</button>
    //       <button className="primary-btn" onClick={handleSave}>
    //         Save Mapping
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default MappingDialog;
