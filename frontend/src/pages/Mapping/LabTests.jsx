// LabTests.js
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import API from "../../helpers/api";
import MappingDialog from "./MappingDialog";
import MappingTable from "../../components/MappingTable";

const LabTests = () => {
  const history = useHistory();
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dialogState, setDialogState] = useState({ isOpen: false, row: null });
  const [labItems, setLabItems] = useState([]);

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/eafya/labtests");
      setMappings(res.data || []);
    } catch (e) {
      console.error("Error fetching labtest mappings", e);
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

    // Filter by category first
    if (selectedCategory) {
      filtered = filtered.filter((m) => m.category === selectedCategory);
    }

    // Then filter by search term
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          (m.hmis_code || "").toLowerCase().includes(term) ||
          (m.hmis_name || "").toLowerCase().includes(term) ||
          (m.eafya_labtest_name || "").toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [mappings, search, selectedCategory]);

  const handleAdd = (row) => {
    setDialogState({ isOpen: true, row });
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/eafya/labtests/${id}`);
      if (res.status === 200) {
        setMappings((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete mapping", e);
      alert("Failed to delete mapping");
    }
  };

  const onEafyaItemsLoaded = (items) => setLabItems(items);

  const handleRowClick = (row) => {
    history.push(`/mapping/labtests/${row.hmis_code}`);
  };

  const handleViewDetails = (e, row) => {
    e.stopPropagation();
    history.push(`/mapping/labtests/${row.hmis_code}`);
  };

  // Get unique categories from mappings
  const uniqueCategories = useMemo(() => {
    const categories = [
      ...new Set(mappings.map((m) => m.category).filter(Boolean)),
    ];
    return categories.sort();
  }, [mappings]);

  const onSave = async (selectedIds) => {
    if (!dialogState.row) return;
    const {
      section_id,
      category,
      hmis_code,
      hmis_name,
      dhis2_data_element_id,
    } = dialogState.row;
    const mappingsPayload = selectedIds
      .map((id) => {
        const item = labItems.find((i) => i.id === id);
        return item ? { id: item.id, name: item.name } : null;
      })
      .filter(Boolean);

    if (mappingsPayload.length === 0) return;

    try {
      const res = await API.post("/eafya/labtests", {
        section_id,
        category,
        hmis_code,
        hmis_name,
        dhis2_data_element_id,
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
      accessor: "category",
      header: "Category",
      sortable: true,
    },
    {
      accessor: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="item-mappings">
          <button
            className="btn btn-outline-info btn-sm me-2"
            onClick={(e) => handleViewDetails(e, row)}
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd(row);
            }}
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
        searchable={false} // We're using custom search above
        sortable={true}
        emptyMessage="No lab test mappings found"
        className="mapping-table"
        onRowClick={handleRowClick}
      />

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, row: null })}
        onSave={onSave}
        hmisName={dialogState.row?.hmis_name || ""}
        section={"HMIS1055"}
        eafyaItems={labItems}
        onEafyaItemsLoaded={onEafyaItemsLoaded}
        datasetCode={"HMIS1055"}
      />
    </>
  );
};
export default LabTests;

// import React, { useEffect, useMemo, useState } from 'react'
// import { FaPlus, FaTrash } from 'react-icons/fa'
// import API from '../../helpers/api'
// import MappingDialog from './MappingDialog'
// import './styles.css'

// const LabTests = () => {
//   const [mappings, setMappings] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [search, setSearch] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState('')
//   const [dialogState, setDialogState] = useState({ isOpen: false, row: null })
//   const [labItems, setLabItems] = useState([])

//   const fetchMappings = async () => {
//     setLoading(true)
//     try {
//       const res = await API.get('/eafya/labtests')
//       setMappings(res.data || [])
//     } catch (e) {
//       console.error('Error fetching labtest mappings', e)
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

//     // Filter by category first
//     if (selectedCategory) {
//       filtered = filtered.filter(m => m.category === selectedCategory)
//     }

//     // Then filter by search term
//     if (search) {
//       const term = search.toLowerCase()
//       filtered = filtered.filter(m =>
//         (m.hmis_code || '').toLowerCase().includes(term) ||
//         (m.hmis_name || '').toLowerCase().includes(term) ||
//         (m.eafya_labtest_name || '').toLowerCase().includes(term)
//       )
//     }

//     return filtered
//   }, [mappings, search, selectedCategory])

//   const handleAdd = (row) => {
//     setDialogState({ isOpen: true, row })
//   }

//   const handleDelete = async (id) => {
//     try {
//       const res = await API.delete(`/eafya/labtests/${id}`)
//       if (res.status === 200) {
//         setMappings(prev => prev.filter(m => m.id !== id))
//       }
//     } catch (e) {
//       console.error('Failed to delete mapping', e)
//       alert('Failed to delete mapping')
//     }
//   }

//   const onEafyaItemsLoaded = (items) => setLabItems(items)

//   // Get unique categories from mappings
//   const uniqueCategories = useMemo(() => {
//     const categories = [...new Set(mappings.map(m => m.category).filter(Boolean))]
//     return categories.sort()
//   }, [mappings])

//   const onSave = async (selectedIds) => {
//     if (!dialogState.row) return
//     const { section_id, category, hmis_code, hmis_name, dhis2_data_element_id } = dialogState.row
//     const mappingsPayload = selectedIds
//       .map(id => {
//         const item = labItems.find(i => i.id === id)
//         return item ? { id: item.id, name: item.name } : null
//       })
//       .filter(Boolean)

//     if (mappingsPayload.length === 0) return

//     try {
//       const res = await API.post('/eafya/labtests', {
//         section_id,
//         category,
//         hmis_code,
//         hmis_name,
//         dhis2_data_element_id,
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
//       <h1 className="page-title">eAFYA Lab Tests Mapping</h1>

//       <div className="section-selectors">
//         <div className="select-group">
//           <label>Category:</label>
//           <select
//             value={selectedCategory}
//             onChange={e => setSelectedCategory(e.target.value)}
//             className="search-input"
//           >
//             <option value="">All Categories</option>
//             {uniqueCategories.map(category => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="select-group">
//           <label>Search Mappings:</label>
//           <input
//             type="text"
//             placeholder="Search by HMIS code, name, or eAFYA lab test..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="search-input"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="loading-message">Loading lab test mappings...</div>
//       ) : (
//         <div className="mapping-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>HMIS Code</th>
//                 <th>HMIS Name</th>
//                 <th>Category</th>
//                 <th>eAFYA Lab Test</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMappings.map(row => (
//                 <tr key={`${row.id}-${row.eafya_labtest_id || ''}`} className="hmis-row">
//                   <td>{row.hmis_code}</td>
//                   <td>{row.hmis_name}</td>
//                   <td>{row.category}</td>
//                   <td>{row.eafya_labtest_id ? `${row.eafya_labtest_id} - ${row.eafya_labtest_name}` : '-'}</td>
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
//         section={'HMIS1055'}
//         eafyaItems={labItems}
//         onEafyaItemsLoaded={onEafyaItemsLoaded}
//         datasetCode={'HMIS1055'}
//       />
//     </div>
//   )
// }

// export default LabTests
