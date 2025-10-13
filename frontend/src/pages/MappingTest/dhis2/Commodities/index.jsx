import React, { useState, useEffect, useCallback, useRef } from 'react'
import API from '../../../../helpers/api'
import { useHistory } from 'react-router-dom'

const Commodities = () => {
  const [mappings, setMappings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(25)
  const [searchTerm, setSearchTerm] = useState('')
  const searchTermRef = useRef(searchTerm)
  const [selectedSection, setSelectedSection] = useState('')
  const [sections, setSections] = useState([])
  const history = useHistory()

  // Fetch mappings from backend
  const fetchMappings = useCallback(async (pageNum = 1, search = '', section = '') => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page: pageNum,
        limit: limit
      }
      
      if (search.trim()) {
        params.search = search.trim()
      }
      
      if (section) {
        params.sectionName = section
      }
      
      const response = await API.get('/mapping/commodities', { params })
      
      if (response.data) {
        setMappings(response.data.data || [])
        setTotal(response.data.total || 0)
        setTotalPages(response.data.totalPages || 1)
        setPage(response.data.page || 1)
      }
    } catch (err) {
      console.error('Error fetching conditions mappings:', err)
      setError(err.response?.data?.message || 'Failed to fetch conditions mappings')
      setMappings([])
    } finally {
      setLoading(false)
    }
  }, [limit])

  // Fetch sections for filter
  const fetchSections = useCallback(async () => {
    try {
      const response = await API.get('/mapping/commodities/sections')
      if (response.data) {
        setSections(response.data)
      }
    } catch (err) {
      console.error('Error fetching sections:', err)
    }
  }, [])

  // Fetch mappings when page or section changes. We deliberately do NOT
  // include `searchTerm` here so typing in the search box doesn't trigger
  // an immediate fetch on every keystroke — the debounced effect below
  // handles search-triggered fetching.
  useEffect(() => {
    // Use current values captured via refs to avoid eslint hook warnings
    fetchMappings(page, searchTermRef.current, selectedSection)
  }, [page, selectedSection, fetchMappings])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page !== 1) {
        setPage(1) // Reset to first page when searching
      } else {
        fetchMappings(1, searchTerm, selectedSection)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedSection, page, fetchMappings])

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handleSearch = (e) => {
    const val = e.target.value
    setSearchTerm(val)
    searchTermRef.current = val
  }

  const handleSectionFilter = (e) => {
    setSelectedSection(e.target.value)
  }

  if (loading && mappings.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading condition mappings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <strong>Error:</strong> {error}
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => fetchMappings(page, searchTerm, selectedSection)}
        >
          <i className="fas fa-retry me-1"></i>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by HMIS name..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedSection}
            onChange={handleSectionFilter}
          >
            <option value="">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <small className="text-muted d-block">
            {mappings.length} of {total} conditions
          </small>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover" style={{ backgroundColor: '#fafafa' }}>
          <thead style={{ backgroundColor: '#e8f4fd' }}>
            <tr>
              <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>
                Section ID
              </th>
              <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>
                Section Name
              </th>
              <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>
                HMIS Code
              </th>
              <th className="border-0 py-3 px-3" style={{ color: '#2c3e50', fontWeight: '600' }}>
                HMIS Name
              </th>
            </tr>
          </thead>
          <tbody>
            {mappings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-5" style={{ backgroundColor: '#ffffff' }}>
                  <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                  <p className="text-muted mb-0">No conditions found</p>
                </td>
              </tr>
            ) : (
              mappings.map((item, index) => (
                <tr 
                  key={`${item.section_id}-${item.hmis_code}-${index}`}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={() => history.push(`/mapping/commodities/${item.hmis_code}`, {
                    section_id: item.section_id,
                    section_name: item.section_name,
                    hmis_code: item.hmis_code,
                    hmis_name: item.hmis_name
                  })}
                  role="button"
                  onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#e3f2fd'}
                  onMouseLeave={(e) => {
                    const row = e.target.closest('tr')
                    row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                  }}
                >
                  <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>
                    <span className="badge bg-light text-dark" style={{ fontSize: '0.8rem' }}>
                      {item.section_id}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>
                    {item.section_name}
                  </td>
                  <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>
                    {/* Use a neutral badge for HMIS code (no primary/blue styling) */}
                    <span className="badge bg-light text-dark" style={{ fontSize: '0.8rem' }}>
                      {item.hmis_code}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-0" style={{ color: '#495057', fontWeight: '500' }}>
                    {item.hmis_name}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing page {page} of {totalPages} | Total: {total} conditions
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </li>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const startPage = Math.max(1, page - 2)
                const pageNum = startPage + i
                if (pageNum > totalPages) return null
                
                return (
                  <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                )
              })}
              
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Commodities