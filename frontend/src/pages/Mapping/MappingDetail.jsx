import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { FaArrowLeft, FaHistory, FaInfoCircle } from "react-icons/fa";
import API from "../../helpers/api";

const MappingDetail = () => {
  const { mappingType, id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const [mappingData, setMappingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mappingHistory, setMappingHistory] = useState([]);

  // Mapping type configurations
  const MAPPING_CONFIGS = {
    commodities: {
      title: "Commodities Mapping",
      endpoint: "/eafya/commodities",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    labtests: {
      title: "Lab Tests Mapping",
      endpoint: "/eafya/labtests",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    conditions: {
      title: "Conditions Mapping",
      endpoint: "/eafya/conditions",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    familyplanning: {
      title: "Family Planning Mapping",
      endpoint: "/eafya/familyplanning",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    vaccines: {
      title: "Vaccines Mapping",
      endpoint: "/eafya/vaccines",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this mapping?")) {
      try {
        // Since we don't have IDs, we'll need to delete by HMIS code and other identifying fields
        // For now, redirect back to mapping list
        console.log(
          "Delete functionality needs to be implemented for HMIS code based deletion"
        );
        alert("Delete functionality will be implemented in the next update");
        history.push("/mapping");
      } catch (error) {
        console.error("Error deleting mapping:", error);
        alert("Failed to delete mapping");
      }
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!mappingData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          <h4>Mapping Not Found</h4>
          <p>The requested mapping could not be found.</p>
          <button
            className="btn btn-primary"
            onClick={() => history.push("/mapping")}
          >
            Back to Mappings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <button
            className="btn btn-outline-secondary btn-sm mb-2"
            onClick={() => history.push("/mapping")}
          >
            <FaArrowLeft className="me-2" />
            Back to Mappings
          </button>
          <h1 className="h3 mb-1 text-primary fw-bold">
            {config.title} - Detail View
          </h1>
          <p className="text-muted mb-0">
            HMIS Code: {mappingData.hmis_code} | {mappingData.hmis_name}
          </p>
        </div>
        <div className="col-md-4 text-end">
          {/* <div className="btn-group" role="group">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleEdit}
            >
              <FaEdit className="me-2" />
              Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
            >
              <FaTrash className="me-2" />
              Delete
            </button>
          </div> */}
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaInfoCircle className="me-2 text-primary" />
                Mapping Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {config.fields.map((field) => (
                  <div key={field.key} className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted small">
                      {field.label}
                    </label>
                    <div className="form-control-plaintext">
                      {mappingData[field.key] || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Data Section */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaInfoCircle className="me-2 text-primary" />
                Mappings (
                {mappingData.mappings ? mappingData.mappings.length : 0})
              </h5>
            </div>
            <div className="card-body">
              {mappingData.mappings && mappingData.mappings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Eafya Id</th>
                        <th>AAFYA Item</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappingData.mappings.map((mapping, index) => (
                        <tr
                          key={`${mapping.hmis_code}-${mapping.section_id}-${index}`}
                        >
                          <td>{mapping.eafya_product_id || mapping.eafya_labtest_id || "NULL"}</td>
                          <td>{mapping.eafya_product_name || mapping.eafya_labtest_name|| "NULL"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">
                  No mappings found for this HMIS code.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          {/* Mapping History */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaHistory className="me-2 text-primary" />
                Mapping History
              </h5>
            </div>
            <div className="card-body">
              {mappingHistory.length > 0 ? (
                <div className="timeline">
                  {mappingHistory.map((event) => (
                    <div key={event.id} className="timeline-item mb-3">
                      <div className="d-flex align-items-start">
                        <div
                          className="timeline-marker bg-primary rounded-circle me-3"
                          style={{
                            width: "8px",
                            height: "8px",
                            marginTop: "6px",
                          }}
                        ></div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">
                            {event.action}
                          </div>
                          <div className="text-muted small">{event.user}</div>
                          <div className="text-muted small">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </div>
                          {event.details && (
                            <div className="text-muted small mt-1">
                              {event.details}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No history available.</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => history.push("/mapping")}
              >
                View All Mappings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingDetail;
