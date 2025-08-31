// Vaccines.js
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import API from "../../helpers/api";
import MappingDialog from "../../components/MappingDialog";
import MappingTable from "../../components/MappingTable";

const Vaccines = () => {
  const history = useHistory();
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [dialogState, setDialogState] = useState({ isOpen: false, row: null });
  const [vaccineItems, setVaccineItems] = useState([]);

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/eafya/vaccines");
      setMappings(res.data || []);
    } catch (e) {
      console.error("Error fetching vaccine mappings", e);
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
          (m.eafya_vaccine_name || "").toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [mappings, search, selectedSection]);


  const handleViewDetails = (row) => {
    history.push(`/mapping/vaccines/${row.hmis_code}`);
  };


  // Define columns for the reusable table
  const columns = [
    {
      accessor: "hmis_code",
      header: "HMIS Code",
      width: "180px",
      sortable: true,
    },
    {
      accessor: "hmis_name",
      header: "HMIS Name",
      sortable: true,
    },
    {
      accessor: "section_name",
      header: "Section Name",
      sortable: true,
    },
    {
      accessor: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="item-mappings">
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={(e) => handleViewDetails(row)}
            title="View Details"
          >
            <FaEye /> View Mapping
          </button>

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
        searchable={true}
        filterable={true}
        sortable={true}
        emptyMessage="No vaccine mappings found"
        className="mapping-table"
        onRowClick={handleRowClick}
      />
    </>
  );
};

export default Vaccines;
