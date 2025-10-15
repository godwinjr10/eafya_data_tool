import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import API from '../../../../helpers/api';
import FamilyPlanningModal from './FamilyPlanningModal';

const FamilyPlanningDetail = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const { id: paramId } = params || {};

  const { hmis_code: stateHmisCode, hmis_name: stateHmisName } = location.state || {};
  const hmisCode = paramId || stateHmisCode;
  const hmisName = stateHmisName || '';

  const [mappingData, setMappingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMappingDetail = useCallback(async () => {
    if (!hmisCode) {
      setMappingData([])
      return
    }
    try {
      const res = await API.get(`/mapping/familyplanning/${hmisCode}`);
      setMappingData(res.data || []);
    } catch (error) {
      console.error('Error fetching family planning mapping detail:', error);
      setMappingData([]);
    }
  }, [hmisCode]);

  useEffect(() => { fetchMappingDetail() }, [fetchMappingDetail]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/mapping/familyplanning/${id}`);
      await fetchMappingDetail();
    } catch (error) {
      console.error('Error deleting mapping:', error);
    }
  };

  const handleAdd = () => { if (hmisCode) setIsModalOpen(true) };
  const handleModalClose = () => setIsModalOpen(false);
  const handleModalSubmit = async () => { setIsModalOpen(false); await fetchMappingDetail(); };

  return (
    <div className="container-fluid py-3">
      <div className="page-header-modern">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb" className="breadcrumb-modern">
                <ol className="breadcrumb mb-3">
                  <li className="breadcrumb-item">
                    <button className="btn btn-outline-secondary btn-sm breadcrumb-back-btn" onClick={() => history.push('/mapping')}>
                      <i className="fas fa-arrow-left me-2"></i> Back to Mapping
                    </button>
                  </li>
                </ol>
              </nav>
              <div className="header-content"><h1 className="page-title-modern">{hmisName}</h1>
                <div className="page-meta-simple"><span className="meta-code"><i className="fas fa-code me-2"></i>{hmisCode}</span></div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button className="btn btn-primary btn-modern" onClick={handleAdd}><i className="fas fa-plus me-2"></i>Add New Mapping</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover" style={{ backgroundColor: '#ffffff' }}>
              <thead style={{ backgroundColor: '#ffffff' }}>
                <tr>
                  <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Family Planning ID</th>
                  <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Family Planning Name</th>
                  {/* <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>ICD 11 Code</th>
                                    <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>ICD 10 Code</th> */}
                  <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mappingData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5" style={{ backgroundColor: '#ffffff' }}>
                      <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                      <p className="text-muted mb-0">No mappings found for this HMIS code.</p>
                    </td>
                  </tr>
                ) : (
                  mappingData.map((row, index) => (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#e3f2fd'}
                      onMouseLeave={(e) => {
                        const rowEl = e.target.closest('tr')
                        rowEl.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                      }}
                    >
                      <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>
                        <span className="badge bg-light text-dark" style={{ fontSize: '0.8rem' }}>{row.familyplanning_id}</span>
                      </td>
                      <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>{row.familyplanning_name}</td>
                      {/* <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>{row.four_character_icd_code}</td>
                                            <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>{row.five_character_icd_code}</td> */}
                      <td className="py-3 px-3 border-0">
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

      <FamilyPlanningModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} hmisCode={hmisCode} hmisName={hmisName} />
    </div>
  )
}

export default FamilyPlanningDetail;
