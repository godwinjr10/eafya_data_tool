import React, { useState, useEffect } from 'react'

const LabTests = () => {
  const [mappings, setMappings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data for lab tests
  useEffect(() => {
    const mockMappings = [
      {
        id: 1,
        hmisCode: 'LAB_001',
        hmisName: 'Malaria RDT',
        eafyaId: 'EAF_LAB_001',
        eafyaName: 'Malaria Rapid Diagnostic Test',
        status: 'mapped',
        lastUpdated: '2024-01-15'
      },
      {
        id: 2,
        hmisCode: 'LAB_002',
        hmisName: 'HIV Test',
        eafyaId: 'EAF_LAB_002',
        eafyaName: 'HIV Rapid Test',
        status: 'mapped',
        lastUpdated: '2024-01-14'
      },
      {
        id: 3,
        hmisCode: 'LAB_003',
        hmisName: 'Blood Sugar',
        eafyaId: null,
        eafyaName: null,
        status: 'unmapped',
        lastUpdated: null
      },
      {
        id: 4,
        hmisCode: 'LAB_004',
        hmisName: 'Hemoglobin',
        eafyaId: 'EAF_LAB_004',
        eafyaName: 'Hemoglobin Level',
        status: 'mapped',
        lastUpdated: '2024-01-13'
      }
    ]
    
    setTimeout(() => {
      setMappings(mockMappings)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredMappings = mappings.filter(mapping => {
    const matchesSearch = mapping.hmisName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mapping.eafyaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mapping.hmisCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || mapping.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const handleMapLabTest = (mappingId) => {
    console.log('Mapping lab test:', mappingId)
  }

  const handleUnmapLabTest = (mappingId) => {
    console.log('Unmapping lab test:', mappingId)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading lab test mappings...</p>
      </div>
    )
  }

  return (
    <div className="mapping-table-compact">
      {/* Search and Filter Header */}
      <div className="card-header bg-light border-0">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="d-flex gap-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search lab tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="mapped">Mapped</option>
                <option value="unmapped">Unmapped</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <span className="text-muted small">
                Showing {filteredMappings.length} of {mappings.length} lab tests
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mappings Table */}
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>HMIS Code</th>
              <th>HMIS Lab Test</th>
              <th>eAFYA ID</th>
              <th>eAFYA Lab Test</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-body-cards">
            {filteredMappings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No lab tests found</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No lab test mappings available'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="table-row-card">
                  <td>
                    <div className="card-white-shadow">
                      <span className="badge bg-primary">{mapping.hmisCode}</span>
                    </div>
                  </td>
                  <td>
                    <div className="card-white-shadow">
                      <span className="fw-semibold">{mapping.hmisName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="card-white-shadow">
                      {mapping.eafyaId ? (
                        <span className="badge bg-primary">{mapping.eafyaId}</span>
                      ) : (
                        <span className="text-muted">Not mapped</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="card-white-shadow">
                      <span className="fw-semibold">
                        {mapping.eafyaName || 'Not mapped'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="card-white-shadow">
                      <span className={`badge ${mapping.status === 'mapped' ? 'bg-success' : 'bg-warning'}`}>
                        {mapping.status === 'mapped' ? 'Mapped' : 'Unmapped'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="card-white-shadow">
                      <span className="text-muted small">
                        {mapping.lastUpdated || 'Never'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="card-white-shadow">
                      {mapping.status === 'mapped' ? (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleUnmapLabTest(mapping.id)}
                          title="Remove mapping"
                        >
                          <i className="fas fa-unlink me-1"></i>
                          Unmap
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMapLabTest(mapping.id)}
                          title="Create mapping"
                        >
                          <i className="fas fa-link me-1"></i>
                          Map
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with summary */}
      <div className="card-footer bg-light border-0">
        <div className="row align-items-center">
          <div className="col-md-6">
            <small className="text-muted">
              Total: {mappings.length} | Mapped: {mappings.filter(m => m.status === 'mapped').length} | 
              Unmapped: {mappings.filter(m => m.status === 'unmapped').length}
            </small>
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-outline-primary btn-sm">
              <i className="fas fa-download me-1"></i>
              Export Mappings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabTests