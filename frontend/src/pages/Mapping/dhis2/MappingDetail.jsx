import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import API from "../../../helpers/api";
import Dhis2MappingDialog from "./Dhis2MappingDialog";

const MappingDetail = () => {
  const history = useHistory();
  const location = useLocation();
  const { hmisName: stateHmisName, hmisCode: stateHmisCode } = location.state || {};

  const selection = useMemo(() => {
    if (stateHmisCode) {
      return {
        hmisCode: stateHmisCode,
        hmisName: stateHmisName || "",
      };
    }
    try {
      const raw = sessionStorage.getItem("mappingSelection");
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          hmisCode: parsed?.hmisCode || "",
          hmisName: parsed?.hmisName || "",
        };
      }
    } catch (_) {}
    return { hmisCode: "", hmisName: "" };
  }, [stateHmisCode, stateHmisName]);

  const [mappingData, setMappingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hmisCode = selection.hmisCode;
  const hmisName = selection.hmisName;

  const fetchMappingDetail = useCallback(async () => {
    try {
      const res = await API.get(`/mapping/conditions/${hmisCode}`);
      setMappingData(res.data);
    } catch (error) {
      console.error("Error fetching mapping detail:", error);
      setMappingData([]);
    }
  }, [hmisCode]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/mapping/conditions/${id}`);
      await fetchMappingDetail();
    } catch (error) {
      console.error("Error deleting mapping:", error);
    }
  };

  useEffect(() => {
    if (!hmisCode) {
      history.push("/mapping");
      return;
    }
    fetchMappingDetail();
  }, [hmisCode, fetchMappingDetail, history]);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    // Refresh the mapping data after successful submission
    fetchMappingDetail();
    setIsModalOpen(false);
  };

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
                  {hmisName}
                </h1>
                <div className="page-meta-simple">
                  <span className="meta-code">
                    <i className="fas fa-code me-2"></i>
                    {hmisCode}
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

      <div className="card mt-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Disease ID</th>
                  <th>Disease Name</th>
                  <th>ICD-4 Code</th>
                  <th>ICD-5 Code</th>
                   <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mappingData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-3 text-muted">No mappings found for this HMIS code.</td>
                  </tr>
                ) : (
                  mappingData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.disease_id}</td>
                      <td>{row.disease_name}</td>
                      <td>{row.four_character_icd_code}</td>
                      <td>{row.five_character_icd_code}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(row.id)}
                          title="Delete mapping"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <Dhis2MappingDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
          hmisCode={hmisCode}
          hmisName={hmisName}
        />
      )}

    </div>
  );
};

export default MappingDetail;
