import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import API from "../../../helpers/api";

const Conditions = () => {
  const history = useHistory();
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (selectedSection) params.set("sectionName", selectedSection);
      const res = await API.get(`/mapping/conditions?${params.toString()}`);
      setMappings(res?.data?.data || []);
      setTotal(res?.data?.total || 0);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (e) {
      console.error("Error fetching condition mappings", e);
      setMappings([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, selectedSection]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const res = await API.get(`/mapping/conditions/sections`);
        setSections(res?.data || []);
      } catch (e) {
        console.error("Error loading sections", e);
        setSections([]);
      }
    };
    loadSections();
  }, []);


  const handleViewDetails = (row) => {
    const payload = {
      sectionId: row.section_id,
      sectionName: row.section_name,
      hmisCode: row.hmis_code,
      hmisName: row.hmis_name,
    };
    try {
      sessionStorage.setItem("mappingSelection", JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
    history.push(`/mapping/details`, payload);
  };

  return (
    <>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
          <div className="d-flex justify-content-between align-items-center p-2">
            <div>
              <span className="me-2">Section:</span>
              <select
                className="form-select form-select-sm d-inline-block"
                style={{ width: 260 }}
                value={selectedSection}
                onChange={(e) => { setPage(1); setSelectedSection(e.target.value); }}
              >
                <option value="">All sections</option>
                {sections.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Section Id</th>
                  <th>Section Name</th>
                  <th>HMIS Code</th>
                  <th>HMIS Name</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((item, index) => (
                  <tr 
                    key={item.id}
                    onClick={() => handleViewDetails(item)}
                    style={{ cursor: 'pointer' }}
                    className="table-row-hover"
                  >
                    <td>{item.section_id}</td>
                    <td>{item.section_name}</td>
                    <td>{item.hmis_code}</td>
                    <td>{item.hmis_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center p-2">
              <div>
                <span className="me-2">Rows per page:</span>
                <select
                  value={limit}
                  onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value, 10)); }}
                  className="form-select form-select-sm d-inline-block"
                  style={{ width: 90 }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="ms-3 text-muted">Total: {total}</span>
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(1)}>First</button>
                  </li>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">Page {page} of {totalPages}</span>
                  </li>
                  <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                  </li>
                  <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(totalPages)}>Last</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          </>
        )}
      </div>
    </>
  );
};

export default Conditions;
