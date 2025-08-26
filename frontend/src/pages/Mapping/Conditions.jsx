import React, { useEffect, useMemo, useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import API from '../../helpers/api'
import MappingDialog from './MappingDialog'
import './styles.css'

const Conditions = () => {
  const [mappings, setMappings] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [dialogState, setDialogState] = useState({ isOpen: false, row: null })
  const [diseaseItems, setDiseaseItems] = useState([])

  const fetchMappings = async () => {
    setLoading(true)
    try {
      const res = await API.get('/eafya/conditions')
      setMappings(res.data || [])
    } catch (e) {
      console.error('Error fetching condition mappings', e)
      setMappings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMappings()
  }, [])

  const filteredMappings = useMemo(() => {
    let filtered = mappings
    
    // Filter by section first
    if (selectedSection) {
      filtered = filtered.filter(m => m.section_id === selectedSection)
    }
    
    // Then filter by search term
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter(m =>
        (m.hmis_code || '').toLowerCase().includes(term) ||
        (m.hmis_name || '').toLowerCase().includes(term) ||
        (m.eafya_disease_name || '').toLowerCase().includes(term)
      )
    }
    
    return filtered
  }, [mappings, search, selectedSection])

  const handleAdd = (row) => {
    setDialogState({ isOpen: true, row })
  }

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/eafya/conditions/${id}`)
      if (res.status === 200) {
        setMappings(prev => prev.filter(m => m.id !== id))
      }
    } catch (e) {
      console.error('Failed to delete mapping', e)
      alert('Failed to delete mapping')
    }
  }

  const onEafyaItemsLoaded = (items) => setDiseaseItems(items)

  // Get unique sections from mappings
  const uniqueSections = useMemo(() => {
    const sections = [...new Set(mappings.map(m => m.section_id).filter(Boolean))]
    return sections.sort()
  }, [mappings])

  const onSave = async (selectedIds) => {
    if (!dialogState.row) return
    const { 
      csv_id, 
      section_id, 
      section_name, 
      hmis_code, 
      hmis_name, 
      data_element_id, 
      category_optioncombo_id, 
      category_optioncombo_name 
    } = dialogState.row
    
    const mappingsPayload = selectedIds
      .map(id => {
        const item = diseaseItems.find(i => i.id === id)
        return item ? { id: item.id, name: item.name } : null
      })
      .filter(Boolean)

    if (mappingsPayload.length === 0) return

    try {
      const res = await API.post('/eafya/conditions', {
        csv_id,
        section_id,
        section_name,
        hmis_code,
        hmis_name,
        data_element_id,
        category_optioncombo_id,
        category_optioncombo_name,
        mappings: mappingsPayload
      })

      if (res.status === 200) {
        await fetchMappings()
      }
    } catch (e) {
      console.error('Failed to save mappings', e)
      alert('Failed to save mappings')
    }
  }

  return (
    <div className="report-sections">
      <h1 className="page-title">eAFYA Conditions Mapping</h1>

      <div className="section-selectors">
        <div className="select-group">
          <label>Section:</label>
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="search-input"
          >
            <option value="">All Sections</option>
            {uniqueSections.map(section => (
              <option key={section} value={section}>
                {section} - {mappings.find(m => m.section_id === section)?.section_name || section}
              </option>
            ))}
          </select>
        </div>
        <div className="select-group">
          <label>Search Mappings:</label>
          <input
            type="text"
            placeholder="Search by HMIS code, name, or eAFYA disease..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading condition mappings...</div>
      ) : (
        <div className="mapping-table">
          <table>
            <thead>
              <tr>
                <th>HMIS Code</th>
                <th>HMIS Name</th>
                <th>Category Option Combo</th>
                <th>eAFYA Disease ID</th>
                <th>eAFYA Disease Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map(row => (
                <tr key={`${row.id}-${row.eafya_disease_id || ''}`} className="hmis-row">
                  <td>{row.hmis_code}</td>
                  <td>{row.hmis_name}</td>
                  <td>{row.category_optioncombo_name || '-'}</td>
                  <td>{row.eafya_disease_id || '-'}</td>
                  <td>{row.eafya_disease_name || '-'}</td>
                  <td>
                    <div className="item-mappings">
                      <button className="add-mapping-btn" onClick={() => handleAdd(row)}>
                        <FaPlus /> Add Mapping
                      </button>
                      {row.id && (
                        <button className="remove-btn" onClick={() => handleDelete(row.id)}>
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, row: null })}
        onSave={onSave}
        hmisName={dialogState.row?.hmis_name || ''}
        section={'HMIS1052'}
        eafyaItems={diseaseItems}
        onEafyaItemsLoaded={onEafyaItemsLoaded}
        datasetCode={'HMIS1052_CONDITIONS'}
      />
    </div>
  )
}

export default Conditions