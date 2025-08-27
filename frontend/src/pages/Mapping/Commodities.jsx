import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import API from "../../helpers/api";
import MappingDialog from "./MappingDialog";

import MappingTable from "../../components/MappingTable";

const Commodities = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [dialogState, setDialogState] = useState({ isOpen: false, row: null });
  const [productItems, setProductItems] = useState([]);


  const fetchMappings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/eafya/commodities");
      setMappings(res.data || []);
    
    } catch (e) {
      console.error("Error fetching commodity mappings", e);
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  const filteredMappings = useMemo(() => {
    let filtered = mappings;

    // Filter by section first
    if (selectedSection) {
      filtered = filtered.filter((m) => m.section_id === selectedSection);
    }

    // Then filter by search term
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          (m.hmis_code || "").toLowerCase().includes(term) ||
          (m.hmis_name || "").toLowerCase().includes(term) ||
          (m.eafya_product_name || "").toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [mappings, search, selectedSection]);

  const handleAdd = (row) => {
    setDialogState({ isOpen: true, row });
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/eafya/commodities/${id}`);
      if (res.status === 200) {
        setMappings((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete mapping", e);
      alert("Failed to delete mapping");
    }
  };

  const onEafyaItemsLoaded = (items) => setProductItems(items);

  // Get unique sections from mappings
  const uniqueSections = useMemo(() => {
    const sections = [
      ...new Set(mappings.map((m) => m.section_id).filter(Boolean)),
    ];
    return sections.sort();
  }, [mappings]);

  // Section display names
  const SECTION_DISPLAY_NAMES = {
    6.1: "Essential Medicines",
  };

  const getSectionDisplayName = (sectionId) => {
    return SECTION_DISPLAY_NAMES[sectionId] || sectionId;
  };

  const onSave = async (selectedIds) => {
    if (!dialogState.row) return;
    const {
      section_id,
      hmis_code
    } = dialogState.row;
    const mappingsPayload = selectedIds
      .map((id) => {
        const item = productItems.find((i) => i.id === id);
        return item ? { id: item.id, name: item.name } : null;
      })
      .filter(Boolean);

    if (mappingsPayload.length === 0) return;

    try {
      const res = await API.post("/eafya/commodities", {
        section_id,
        hmis_code,
        mappings: mappingsPayload,
      });

      if (res.status === 200) {
        await fetchMappings();
      }
    } catch (e) {
      console.error("Failed to save mappings", e);
      alert("Failed to save mappings");
    }
  };

  // Define columns for the reusable table
  const columns = [
    {
      accessor: "hmis_code",
      header: "HMIS Code",
      width: "120px",
      sortable: true,
    },
    {
      accessor: "hmis_name",
      header: "HMIS Name",
      sortable: true,
    },
    {
      accessor: "data_element_name",
      header: "Data Element",
      sortable: true,
    },
    {
      accessor: "eafya_product",
      header: "eAFYA Product",
      sortable: false,
      render: (row) =>
        row.eafya_product_id ? (
          `${row.eafya_product_id} - ${row.eafya_product_name}`
        ) : (
          <span className="text-muted">-</span>
        ),
    },
    {
      accessor: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="item-mappings">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleAdd(row)}
          >
            <FaPlus /> Add Mapping
          </button>
          {row.id && (
            <a
              href="#"
              className="text-danger  px-4"
              onClick={() => handleDelete(row.id)}
            >
              <FaTrash />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <MappingTable
        data={filteredMappings}
        columns={columns}
        loading={loading}
        pageSize={10}
        searchable={false} // Using custom search above
        sortable={true}
        emptyMessage="No commodity mappings found"
        className="mapping-table"
      />

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, row: null })}
        onSave={onSave}
        hmisName={dialogState.row?.hmis_name || ""}
        section={"HMIS1054"}
        eafyaItems={productItems}
        onEafyaItemsLoaded={onEafyaItemsLoaded}
        datasetCode={"HMIS1054"}
      />
    </>
  );
};

export default Commodities;

// import React, { useEffect, useMemo, useState } from 'react'
// import { FaPlus, FaTrash } from 'react-icons/fa'
// import API from '../../helpers/api'
// import MappingDialog from './MappingDialog'
// import './styles.css'

// const Commodities = () => {
//   const [mappings, setMappings] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [search, setSearch] = useState('')
//   const [selectedSection, setSelectedSection] = useState('')
//   const [dialogState, setDialogState] = useState({ isOpen: false, row: null })
//   const [productItems, setProductItems] = useState([])

//   const fetchMappings = async () => {
//     setLoading(true)
//     try {
//       const res = await API.get('/eafya/commodities')
//       setMappings(res.data || [])
//     } catch (e) {
//       console.error('Error fetching commodity mappings', e)
//       setMappings([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchMappings()
//   }, [])

//   const filteredMappings = useMemo(() => {
//     let filtered = mappings

//     // Filter by section first
//     if (selectedSection) {
//       filtered = filtered.filter(m => m.section_id === selectedSection)
//     }

//     // Then filter by search term
//     if (search) {
//       const term = search.toLowerCase()
//       filtered = filtered.filter(m =>
//         (m.hmis_code || '').toLowerCase().includes(term) ||
//         (m.hmis_name || '').toLowerCase().includes(term) ||
//         (m.eafya_product_name || '').toLowerCase().includes(term)
//       )
//     }

//     return filtered
//   }, [mappings, search, selectedSection])

//   const handleAdd = (row) => {
//     setDialogState({ isOpen: true, row })
//   }

//   const handleDelete = async (id) => {
//     try {
//       const res = await API.delete(`/eafya/commodities/${id}`)
//       if (res.status === 200) {
//         setMappings(prev => prev.filter(m => m.id !== id))
//       }
//     } catch (e) {
//       console.error('Failed to delete mapping', e)
//       alert('Failed to delete mapping')
//     }
//   }

//   const onEafyaItemsLoaded = (items) => setProductItems(items)

//   // Get unique sections from mappings
//   const uniqueSections = useMemo(() => {
//     const sections = [...new Set(mappings.map(m => m.section_id).filter(Boolean))]
//     return sections.sort()
//   }, [mappings])

//   // Section display names
//   const SECTION_DISPLAY_NAMES = {
//     '6.1': 'Essential Medicines'
//   }

//   const getSectionDisplayName = (sectionId) => {
//     return SECTION_DISPLAY_NAMES[sectionId] || sectionId
//   }

//   const onSave = async (selectedIds) => {
//     if (!dialogState.row) return
//     const { section_id, hmis_code, hmis_name, dhis2_data_element_id, data_element_name } = dialogState.row
//     const mappingsPayload = selectedIds
//       .map(id => {
//         const item = productItems.find(i => i.id === id)
//         return item ? { id: item.id, name: item.name } : null
//       })
//       .filter(Boolean)

//     if (mappingsPayload.length === 0) return

//     try {
//       const res = await API.post('/eafya/commodities', {
//         section_id,
//         hmis_code,
//         hmis_name,
//         dhis2_data_element_id,
//         data_element_name,
//         mappings: mappingsPayload
//       })

//       if (res.status === 200) {
//         await fetchMappings()
//       }
//     } catch (e) {
//       console.error('Failed to save mappings', e)
//       alert('Failed to save mappings')
//     }
//   }

//   return (
//     <div className="report-sections">
//       <h1 className="page-title">eAFYA Commodities Mapping</h1>

//       <div className="section-selectors">
//         <div className="select-group">
//           <label>Section:</label>
//           <select
//             value={selectedSection}
//             onChange={e => setSelectedSection(e.target.value)}
//             className="search-input"
//           >
//             <option value="">All Sections</option>
//             {uniqueSections.map(section => (
//               <option key={section} value={section}>
//                 {section} - {getSectionDisplayName(section)}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="select-group">
//           <label>Search Mappings:</label>
//           <input
//             type="text"
//             placeholder="Search by HMIS code, name, or eAFYA product..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="search-input"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-message">Loading commodity mappings...</div>
//       ) : (
//         <div className="mapping-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>HMIS Code</th>
//                 <th>HMIS Name</th>
//                 <th>Data Element</th>
//                 <th>eAFYA Product</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMappings.map(row => (
//                 <tr key={`${row.id}-${row.eafya_product_id || ''}`} className="hmis-row">
//                   <td>{row.hmis_code}</td>
//                   <td>{row.hmis_name}</td>
//                   <td>{row.data_element_name}</td>
//                   <td>{row.eafya_product_id ? `${row.eafya_product_id} - ${row.eafya_product_name}` : '-'}</td>
//                   <td>
//                     <div className="item-mappings">
//                       <button className="btn btn-outline-primary btn-sm" onClick={() => handleAdd(row)}>
//                         <FaPlus /> Add Mapping
//                       </button>
//                       {row.id && (
//                         <button className="remove-btn" onClick={() => handleDelete(row.id)}>
//                           <FaTrash />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <MappingDialog
//         isOpen={dialogState.isOpen}
//         onClose={() => setDialogState({ isOpen: false, row: null })}
//         onSave={onSave}
//         hmisName={dialogState.row?.hmis_name || ''}
//         section={'HMIS1054'}
//         eafyaItems={productItems}
//         onEafyaItemsLoaded={onEafyaItemsLoaded}
//         datasetCode={'HMIS1054'}
//       />
//     </div>
//   )
// }

// export default Commodities
