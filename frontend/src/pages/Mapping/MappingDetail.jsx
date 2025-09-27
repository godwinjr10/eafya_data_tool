import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import API from "../../helpers/api";
import MappingDialog from "../../components/MappingDialog";

const MappingDetail = () => {
  const { mappingType, id } = useParams();
  const history = useHistory();

  const [mappingData, setMappingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mappingHistory, setMappingHistory] = useState([]);
  const [dialogState, setDialogState] = useState({ isOpen: false, row: null });
  const [eafyaItems, setEafyaItems] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, mappingId: null, mappingName: "" });

  // Mapping type configurations
  const MAPPING_CONFIGS = {
    commodities: {
      title: "Commodities Mapping",
      endpoint: "/mapping/commodities",
      searchEndpoint: "/mapping/commodities/items",
      sectionField: "section_id",
      datasetCode: "HMIS1054",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    labtests: {
      title: "Lab Tests Mapping",
      endpoint: "/mapping/labtests",
      searchEndpoint: "/mapping/labtests/items",
      sectionField: "_section_id",
      datasetCode: "HMIS1055",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
    conditions: {
      title: "Conditions Mapping",
      endpoint: "/mapping/conditions",
      searchEndpoint: "/mapping/conditions/items",
      sectionField: "section_id",
      datasetCode: "HMIS1052_CONDITIONS",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    familyplanning: {
      title: "Family Planning Mapping",
      endpoint: "/mapping/familyplanning",
      searchEndpoint: "/mapping/familyplanning/items",
      sectionField: "_section_id",
      datasetCode: "HMIS1052_FP",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
    vaccines: {
      title: "Vaccines Mapping",
      endpoint: "/mapping/vaccines",
      searchEndpoint: "/mapping/vaccines/items",
      sectionField: "_section_id",
      datasetCode: "HMIS1052_VACCINE",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
    procedures: {
      title: "Procedures Mapping",
      endpoint: "/mapping/procedures",
      searchEndpoint: "/mapping/procedures/items",
      sectionField: "_section_id",
      datasetCode: "HMIS1052_VACCINE",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
    imaging: {
      title: "Imaging Mapping",
      endpoint: "/mapping/imaging",
      searchEndpoint: "/mapping/imaging/items",
      sectionField: "_section_id",
      datasetCode: "HMIS1052_VACCINE",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
  };

  const config = MAPPING_CONFIGS[mappingType] || MAPPING_CONFIGS.commodities;

  useEffect(() => {
    if (id) {
      fetchMappingDetail();
      fetchMappingHistory();
    }
  }, [id, mappingType]);

  const fetchMappingDetail = async () => {
    setLoading(true);
    try {
      // Use the new detail endpoint with HMIS code
      const res = await API.get(`/eafya-details/${mappingType}/${id}`);
      setMappingData(res.data);
    } catch (error) {
      console.error("Error fetching mapping detail:", error);
      setMappingData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMappingHistory = async () => {
    try {
      // This would fetch mapping history/audit trail
      // For now, we'll simulate it
      setMappingHistory([
        {
          id: 1,
          action: "Created",
          timestamp: new Date().toISOString(),
          user: "System Admin",
          details: "Initial mapping created",
        },
      ]);
    } catch (error) {
      console.error("Error fetching mapping history:", error);
    }
  };

  const handleDelete = (eafyaId, mappingName) => {
    setConfirmModal({
      isOpen: true,
      mappingId: eafyaId,
      mappingName: mappingName
    });
  };

  const confirmDelete = async () => {
    try {
      // Build the delete payload with the required fields
      const hmis_code = id; // The ID from URL params is the hmis_code

      // Get section value from the current mapping context
      let sectionValue;
      if (mappingData && mappingData[config.sectionField]) {
        sectionValue = mappingData[config.sectionField];
      } else if (mappingData && mappingData.section_id) {
        sectionValue = mappingData.section_id;
      } else if (mappingData && mappingData._section_id) {
        sectionValue = mappingData._section_id;
      } else {
        sectionValue = "6.1"; // Default section
      }

      // Simple payload - just send what we need
      const payload = {
        eafya_id: confirmModal.mappingId,
      };

      console.log("Deleting mapping with payload:", payload);

      // Call the delete endpoint
      const res = await API.delete(config.endpoint, { data: payload });

      if (res.status === 200 || res.status === 204) {
        // Refresh the mapping data to show updated list
        fetchMappingDetail();
        setConfirmModal({ isOpen: false, mappingId: null, mappingName: "" });
      }
    } catch (error) {
      console.error("Error deleting mapping:", error);
      alert("Failed to delete mapping. Please try again.");
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, mappingId: null, mappingName: "" });
  };
  const handleAdd = (row) => {
    setDialogState({ isOpen: true, row });
  };

  const onEafyaItemsLoaded = (items) => setEafyaItems(items);

  const onSave = async (mappingData) => {
    try {
      console.log("onSave received mappingData:", mappingData);
      console.log("Current mappingData from state:", mappingData);
      console.log("Current config:", config);

      // Get the required fields from the current mapping context
      const hmis_code = id; // The ID from URL params is the hmis_code
      const sectionField = config.sectionField;

      // mappingData is an array of selected item IDs, convert to proper mappings format
      const mappings = Array.isArray(mappingData)
        ? mappingData
            .map((id) => {
              const item = eafyaItems.find((i) => i.id === id);
              return item ? { id: item.id, name: item.name } : null;
            })
            .filter(Boolean)
        : [];

      // Get section value from the current mapping context (mappingData from state)
      let sectionValue;
      if (mappingData && mappingData[sectionField]) {
        sectionValue = mappingData[sectionField];
      } else if (mappingData && mappingData.section_id) {
        sectionValue = mappingData.section_id;
      } else if (mappingData && mappingData._section_id) {
        sectionValue = mappingData._section_id;
      } else {
        // If we can't find section value in mappingData, we need to get it from the current context
        // For now, let's use a default or get it from the URL/context
        sectionValue = "6.1"; // Default section for commodities - you may need to adjust this
      }

      console.log("Extracted values:", {
        hmis_code,
        sectionValue,
        sectionField,
        mappings,
      });

      if (!sectionValue || !hmis_code || !mappings || mappings.length === 0) {
        alert(
          `Missing required fields: ${sectionField}=${sectionValue}, hmis_code=${hmis_code} and non-empty mappings array (length: ${mappings.length})`
        );
        return;
      }

      // Build the payload with the correct section field name
      // For labtests, database uses _section_id but backend expects section_id
      const payload = {
        hmis_code,
        mappings: mappings,
        [mappingType === "labtests" ? "section_id" : sectionField]:
          sectionValue,
      };

      console.log("Sending payload:", payload);

      const res = await API.post(config.endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        // Refresh the mapping data
        fetchMappingDetail();
        setDialogState({ isOpen: false, row: null });
        alert("Mapping added successfully!");
      }
    } catch (error) {
      console.error("Error saving mapping:", error);
      alert("Failed to save mapping");
    }
  };

  const columns = [
    {
      accessor: "eafya_id",
      header: "ID",
      width: "80px",
      sortable: true,
    },
    {
      accessor: "eafya_name",
      header: "Name",
      sortable: true,
    },
    {
      accessor: "actions",
      header: "Actions",
      width: "100px",
      sortable: false,
      render: (row) => (
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.eafya_id);
            }}
            title="Delete mapping"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];
  console.log("mapping data==", mappingData);
  return (
    <div className="container-fluid py-3">
      {/* Modern Header */}
      <div className="page-header-modern">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb" className="breadcrumb-modern">
                <ol className="breadcrumb mb-3">
                  <li className="breadcrumb-item">
                    <button
                      className="btn btn-outline-secondary btn-sm breadcrumb-back-btn"
                      onClick={() => history.push("/mapping")}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      <span>Back to Mapping</span>
                    </button>
                  </li>
                </ol>
              </nav>
              <div className="header-content">
                <h1 className="page-title-modern">
                  {mappingData?.hmis_name}
                </h1>
                <div className="page-meta-simple">
                  <span className="meta-code">
                    <i className="fas fa-code me-2"></i>
                    {mappingData?.hmis_code}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="header-actions">
                <button
                  className="btn btn-primary btn-modern"
                  onClick={() => handleAdd(mappingData)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add New Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Content Section */}
      <div className="content-section-modern">
        <div className="container-fluid">
          {loading ? (
            <div className="loading-state-modern">
              <div className="spinner-modern">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <p className="loading-text">Loading mappings...</p>
            </div>
          ) : mappingData?.mappings && mappingData.mappings.length > 0 ? (
            <div className="mappings-grid-modern">
              <div className="mappings-header">
                <h3 className="mappings-title">
                  <i className="fas fa-list-ul me-2"></i>
                  Mappings ({mappingData.mappings.length})
                </h3>
                <p className="mappings-subtitle">Manage the eAFYA mappings for this condition</p>
              </div>
              <div className="mappings-list">
                {mappingData.mappings.map((mapping, index) => (
                  <div key={mapping.eafya_id || index} className="mapping-item-modern">
                    <div className="mapping-content">
                      <div className="mapping-id">
                        <span className="id-badge-simple">{mapping.eafya_id}</span>
                      </div>
                      <div className="mapping-details">
                        <h4 className="mapping-name">{mapping.eafya_name}</h4>
                      </div>
                    </div>
                    <div className="mapping-actions">
                        <button
                          className="btn btn-danger btn-sm btn-modern"
                          onClick={() => handleDelete(mapping.eafya_id, mapping.eafya_name)}
                          title="Remove mapping"
                        >
                          <i className="fas fa-trash"></i>
                          <span>Remove</span>
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state-modern">
              <div className="empty-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <h3 className="empty-title">No mappings found</h3>
              <p className="empty-description">
                This condition doesn't have any eAFYA mappings yet. Click "Add New Mapping" to create one.
              </p>
              <button
                className="btn btn-primary btn-modern"
                onClick={() => handleAdd(mappingData)}
              >
                <i className="fas fa-plus me-2"></i>
                Create First Mapping
              </button>
            </div>
          )}
        </div>
      </div>

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, row: null })}
        onSave={onSave}
        hmisName={dialogState.row?.hmis_name || ""}
        section={dialogState.row?.[config.sectionField] || ""}
        eafyaItems={eafyaItems}
        onEafyaItemsLoaded={onEafyaItemsLoaded}
        datasetCode={config.datasetCode}
        searchEndpoint={config.searchEndpoint}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 9999 }}
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded-3 shadow-lg p-4"
            style={{
              width: "450px",
              maxWidth: "95vw",
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3">
              <h5 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                Confirm Removal
              </h5>
            </div>
            
            <div className="mb-4">
              <p className="mb-3 text-muted">
                Are you sure you want to remove this mapping?
              </p>
              <div className="alert alert-light border rounded-3">
                <div className="d-flex align-items-center">
                  <span className="id-badge-simple me-3">{confirmModal.mappingId}</span>
                  <span className="text-dark">{confirmModal.mappingName}</span>
                </div>
              </div>
              <p className="text-muted small mb-0 mt-2">
                This action cannot be undone.
              </p>
            </div>
            
            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-secondary px-3"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger px-3"
                onClick={confirmDelete}
              >
                <i className="fas fa-trash me-2"></i>
                Remove Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingDetail;
