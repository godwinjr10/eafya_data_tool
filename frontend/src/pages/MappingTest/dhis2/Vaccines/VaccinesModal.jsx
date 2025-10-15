import React, { useState, useEffect } from 'react';
import API from '../../../../helpers/api';

const VaccinesModal = ({ isOpen, onClose, onSubmit, hmisCode, hmisName }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) fetchItems()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const id = setTimeout(() => fetchItems(searchTerm), 300)
    return () => clearTimeout(id)
  }, [searchTerm, isOpen])

  const fetchItems = async (search = '') => {
    setLoadingItems(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (search) params.append('search', search)
      const res = await API.get(`/mapping/vaccines/items?${params.toString()}`)
      setItems(res.data || [])
    } catch (err) {
      setError('Failed to load items')
      console.error('Error fetching lab test items:', err)
    } finally {
      setLoadingItems(false)
    }
  }

  const toggleItem = (item) => {
    setSelectedItems(prev => {
      const exists = prev.some(i => i.id === item.id)
      if (exists) return prev.filter(i => i.id !== item.id)
      return [...prev, item]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedItems.length === 0) {
      setError('Please select at least one item')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        hmis_code: hmisCode,
        hmis_name: hmisName,
        vaccines: selectedItems.map(it => ({ vaccine_id: it.id, vaccine_name: it.name }))
      }
      await API.post('/mapping/vaccines', payload)
      onSubmit()
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating mapping')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedItems([])
    setSearchTerm('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }} onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}>
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
          <div className="modal-header bg-white border-0 pb-0 pt-3 px-4">
            <div>
              <h5 className="modal-title mb-1" style={{ fontWeight: 600 }}>Add New Mapping - {hmisName}</h5>
              <small className="text-muted">Select items to map to <strong>{hmisCode}</strong></small>
            </div>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 pt-2 pb-3">
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Search by name ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Available Items</label>
                <div className="border rounded p-3 bg-white" style={{ maxHeight: '420px', overflowY: 'auto', minHeight: '220px' }}>
                  {loadingItems ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading items...</span></div>
                      <div className="mt-2">Loading items...</div>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="text-center p-4 text-muted">No items available</div>
                  ) : (
                    <div className="row g-2">
                      {items.map(item => {
                        const isSelected = selectedItems.some(i => i.id === item.id)
                        return (
                          <div className="col-12 col-md-4" key={item.id}>
                            <div className={`card h-100 ${isSelected ? 'border-2 border-primary' : 'border-0'}`} style={{ cursor: 'pointer', borderRadius: '0.6rem', boxShadow: isSelected ? '0 6px 12px rgba(20,115,255,0.06)' : 'none' }} onClick={() => toggleItem(item)}>
                              <div className="card-body py-1">
                                <div className="d-flex align-items-start">
                                  <div className="form-check me-2 mt-1"><input className="form-check-input" type="checkbox" checked={isSelected} readOnly style={{ width: '16px', height: '16px' }} /></div>
                                  <div className="flex-grow-1"><div className="text-wrap text-truncate" title={item.name} style={{ fontSize: '0.85rem' }}>{item.name}</div></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}
            </div>

            <div className="modal-footer border-0 pt-0 pb-4 px-4">
              <button type="button" className="btn btn-light btn-sm" onClick={handleClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading || selectedItems.length === 0}>{loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>) : `Save Mapping`}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VaccinesModal;
