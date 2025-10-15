import React, { useState, useEffect, useRef, useCallback } from 'react'
import API from '../../../../helpers/api'
import { useHistory } from 'react-router-dom'

const FamilyPlanning = () => {
  const [mappings, setMappings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [total, setTotal] = useState(0)
  const history = useHistory()
  const searchRef = useRef(searchTerm)

  const fetchMappings = useCallback(async (pageNum = 1, search = '') => {
    try {
      setLoading(true)
      const params = { page: pageNum, limit }
      if (search && search.trim()) params.search = search.trim()
      const res = await API.get('/mapping/familyplanning', { params })
      if (res.data) {
        setMappings(res.data.data || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error('Error fetching family planning mappings:', err)
      setMappings([])
    } finally { setLoading(false) }
  }, [limit])

  useEffect(() => { fetchMappings(page, searchRef.current) }, [page, fetchMappings])

  useEffect(() => {
    const id = setTimeout(() => { setPage(1); fetchMappings(1, searchTerm); searchRef.current = searchTerm }, 400)
    return () => clearTimeout(id)
  }, [searchTerm, fetchMappings])

  if (loading && mappings.length === 0) return (<div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="mt-3 text-muted">Loading mappings...</p></div>)

  return (
    <div>
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-light"><i className="fas fa-search text-muted"></i></span>
            <input type="text" className="form-control" placeholder="Search by HMIS name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="col-md-4 text-end"><small className="text-muted d-block">Showing {mappings.length} of {total} items</small></div>
      </div>

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
                <td colSpan={3} className="text-center py-5">
                  <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                  <p className="text-muted mb-0">No lab tests found</p>
                </td>
              </tr>
            ) : (
              mappings.map((item, idx) => (
                <tr
                  key={`${item.hmis_code}-${idx}`}
                  role="button"
                  onClick={() => history.push(`/mapping/familyplanning/${item.hmis_code}`, {
                    hmis_code: item.hmis_code,
                    hmis_name: item.hmis_name
                  })}
                  onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#e3f2fd'}
                  onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f8f9fa'}
                  style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fa' }}
                >
                 <td className="py-3 px-3 border-0" style={{ color: '#495057' }}>
                    <span className="badge bg-light text-dark" style={{ fontSize: '0.8rem' }}>
                      {item.section_code}
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

      {total > limit && (<div className="d-flex justify-content-between align-items-center mt-3"><small className="text-muted">Total: {total}</small><div><button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button><button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => p + 1)}>Next</button></div></div>)}
    </div>
  )
}

export default FamilyPlanning