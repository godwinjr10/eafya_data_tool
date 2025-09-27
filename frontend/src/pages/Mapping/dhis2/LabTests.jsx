// LabTests.js
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import API from "../../../helpers/api";
import MappingTable from "../../../components/MappingTable";

const LabTests = () => {
  const history = useHistory();
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/mapping/labtests");
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

  const handleViewDetails = (row) => {
    history.push(`/mapping/labtests/${row.hmis_code}`);
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
        emptyMessage="No lab test mappings found"
        className="mapping-table"
        onRowClick={handleViewDetails}
      />
    </>
  );
};
export default LabTests;
