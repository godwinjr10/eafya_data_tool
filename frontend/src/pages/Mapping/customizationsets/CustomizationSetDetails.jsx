import React, { useEffect, useState, useImperativeHandle, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  listCustomizationSetByName,
  deleteCustomizationSetMapping,
  bulkAddCustomizationSets,
} from "../../../helpers/customizationsetApi";

const CustomizationSetDetail = React.forwardRef(({ name: propName, category, onOpenDialog }, ref) => {
  const { name: urlName } = useParams();
  const name = propName || urlName;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);


  // Function to get endpoint based on category
  const getEndpointFromCategory = (category) => {
    
    switch (category) {
      case 'Clinics':
        return '/customizationsets/items/clinics';
      case 'Wards':
        return '/customizationsets/items/wards';
      case 'Vaccines':
        return '/customizationsets/items/vaccines';
      case 'Stores':
        return '/customizationsets/items/store';
        default:
          return '/customizationsets/items/clinics';
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCustomizationSetByName(name);
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    load();
  }, [name, load]);



  const onDelete = async (id) => {
    try {
      await deleteCustomizationSetMapping(name, id);
      await load();
      toast.success('Mapping deleted successfully');
    } catch (error) {
      console.error('Error deleting mapping:', error);
      toast.error('Failed to delete mapping');
    }
  };

  const openAdd = () => {
    if (onOpenDialog) {
      const endpoint = getEndpointFromCategory(category);
      onOpenDialog({
        hmisName: name,
        category: category,
        searchEndpoint: endpoint,
        onSave: onSaveDialog
      });
    }
  };

  // Expose openAdd function to parent component via ref
  useImperativeHandle(ref, () => ({
    openAdd
  }));


  const onSaveDialog = async (selectedItems) => {
    if (!Array.isArray(selectedItems) || selectedItems.length === 0) return;
    
    try {
      // Now we have both ID and name from the selected items
      const mappings = selectedItems.map((item) => ({
        id: Number(item.id),
        name: item.name || null,
      }));
      await bulkAddCustomizationSets(name, {
        allData: {
          name,
          category: category || null,
          mappings,
        },
      });
      await load();
      toast.success(`${selectedItems.length} mapping(s) added successfully`);
    } catch (error) {
      console.error('Error adding mappings:', error);
      toast.error('Failed to add mappings');
    }
  };

  const columns = [
    { accessor: "id", header: "ID", width: "100px" },
    { accessor: "name", header: "Name" },
    {
      accessor: "actions",
      header: "Actions",
      width: "120px",
      render: (r) => (
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(r.id)}
          style={{ fontSize: '13px', padding: '4px 12px' }}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      {loading ? (
        <div className="text-center py-3">Loading...</div>
      ) : rows.length > 0 ? (
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.accessor} 
                    className="fw-semibold"
                    style={{ fontSize: '14px', padding: '8px 12px' }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((column) => (
                    <td 
                      key={column.accessor}
                      style={{ fontSize: '13px', padding: '8px 12px', verticalAlign: 'middle' }}
                    >
                      {column.render ? column.render(item) : item[column.accessor] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No mappings found</h5>
          <p className="text-muted">This customization set doesn't have any mappings yet. Click "Add Mapping" to create one.</p>
        </div>
      )}
    </div>
  );
});

export default CustomizationSetDetail;
