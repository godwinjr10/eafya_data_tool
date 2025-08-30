import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { FaArrowLeft, FaHistory, FaInfoCircle, FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import API from "../../helpers/api";
import MappingTable from "../../components/MappingTable";
import MappingDialog from "./MappingDialog";
const MappingDetail = () => {
  const { mappingType, id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const [mappingData, setMappingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mappingHistory, setMappingHistory] = useState([]);
  const [dialogState, setDialogState] = useState({ isOpen: false, row: null });
  const [eafyaItems, setEafyaItems] = useState([]);

  // Mapping type configurations
  const MAPPING_CONFIGS = {
    commodities: {
      title: "Commodities Mapping",
      endpoint: "/eafya/commodities",
      searchEndpoint: "/eafya/products",
      sectionField: "section_id",
      datasetCode: "HMIS1054",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    labtests: {
      title: "Lab Tests Mapping",
      endpoint: "/eafya/labtests",
      searchEndpoint: "/eafya/lab",
      sectionField: "_section_id",
      datasetCode: "HMIS1055",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
    conditions: {
      title: "Conditions Mapping",
      endpoint: "/eafya/conditions",
      searchEndpoint: "/eafya/disease-items",
      sectionField: "section_id",
      datasetCode: "HMIS1052_CONDITIONS",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "section_id", label: "Section ID" },
      ],
    },
    familyplanning: {
      title: "Family Planning Mapping",
      endpoint: "/eafya/familyplanning",
      searchEndpoint: "/eafya/familyplanning-items",
      sectionField: "_section_id",
      datasetCode: "HMIS1052_FP",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
    vaccines: {
      title: "Vaccines Mapping",
      endpoint: "/eafya/vaccines",
      searchEndpoint: "/eafya/vaccine-items",
      sectionField: "_section_id",
      datasetCode: "HMIS1052_VACCINE",
      fields: [
        { key: "hmis_code", label: "HMIS Code" },
        { key: "hmis_name", label: "HMIS Name" },
        { key: "_section_id", label: "Section ID" },
      ],
    },
  };

  const config = MAPPING_CONFIGS[mappingType] || MAPPING_CONFIGS.commodities;

  useEffect(() => {
    if (id) {
      fetchMappingDetail();
      fetchMappingHistory();
    }
  }, [id, mappingType]);

  const fetchMappingDetail = async () => {
    setLoading(true);
    try {
      // Use the new detail endpoint with HMIS code
      const res = await API.get(`/eafya-details/${mappingType}/${id}`);
      setMappingData(res.data);
    } catch (error) {
      console.error("Error fetching mapping detail:", error);
      setMappingData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMappingHistory = async () => {
    try {
      // This would fetch mapping history/audit trail
      // For now, we'll simulate it
      setMappingHistory([
        {
          id: 1,
          action: "Created",
          timestamp: new Date().toISOString(),
          user: "System Admin",
          details: "Initial mapping created",
        },
      ]);
    } catch (error) {
      console.error("Error fetching mapping history:", error);
    }
  };

  const handleDelete = async (eafyaId) => {
    if (window.confirm("Are you sure you want to delete this mapping?")) {
      try {
        // Build the delete payload with the required fields
        const hmis_code = id; // The ID from URL params is the hmis_code

        // Get section value from the current mapping context
        let sectionValue;
        if (mappingData && mappingData[config.sectionField]) {
          sectionValue = mappingData[config.sectionField];
        } else if (mappingData && mappingData.section_id) {
          sectionValue = mappingData.section_id;
        } else if (mappingData && mappingData._section_id) {
          sectionValue = mappingData._section_id;
        } else {
          sectionValue = "6.1"; // Default section
        }

        // Simple payload - just send what we need
        const payload = {
          eafya_id: eafyaId,
        };

        console.log("Deleting mapping with payload:", payload);

        // Call the delete endpoint
        const res = await API.delete(config.endpoint, { data: payload });

        if (res.status === 200 || res.status === 204) {
          // Refresh the mapping data to show updated list
          fetchMappingDetail();
          alert("Mapping deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting mapping:", error);
        alert("Failed to delete mapping. Please try again.");
      }
    }
  };
  const handleAdd = (row) => {
    setDialogState({ isOpen: true, row });
  };

  const onEafyaItemsLoaded = (items) => setEafyaItems(items);

  const onSave = async (mappingData) => {
    try {
      console.log("onSave received mappingData:", mappingData);
      console.log("Current mappingData from state:", mappingData);
      console.log("Current config:", config);

      // Get the required fields from the current mapping context
      const hmis_code = id; // The ID from URL params is the hmis_code
      const sectionField = config.sectionField;

      // mappingData is an array of selected item IDs, convert to proper mappings format
      const mappings = Array.isArray(mappingData)
        ? mappingData
            .map((id) => {
              const item = eafyaItems.find((i) => i.id === id);
              return item ? { id: item.id, name: item.name } : null;
            })
            .filter(Boolean)
        : [];

      // Get section value from the current mapping context (mappingData from state)
      let sectionValue;
      if (mappingData && mappingData[sectionField]) {
        sectionValue = mappingData[sectionField];
      } else if (mappingData && mappingData.section_id) {
        sectionValue = mappingData.section_id;
      } else if (mappingData && mappingData._section_id) {
        sectionValue = mappingData._section_id;
      } else {
        // If we can't find section value in mappingData, we need to get it from the current context
        // For now, let's use a default or get it from the URL/context
        sectionValue = "6.1"; // Default section for commodities - you may need to adjust this
      }

      console.log("Extracted values:", {
        hmis_code,
        sectionValue,
        sectionField,
        mappings,
      });

      if (!sectionValue || !hmis_code || !mappings || mappings.length === 0) {
        alert(
          `Missing required fields: ${sectionField}=${sectionValue}, hmis_code=${hmis_code} and non-empty mappings array (length: ${mappings.length})`
        );
        return;
      }

      // Build the payload with the correct section field name
      // For labtests, database uses _section_id but backend expects section_id
      const payload = {
        hmis_code,
        mappings: mappings,
        [mappingType === "labtests" ? "section_id" : sectionField]:
          sectionValue,
      };

      console.log("Sending payload:", payload);

      const res = await API.post(config.endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        // Refresh the mapping data
        fetchMappingDetail();
        setDialogState({ isOpen: false, row: null });
        alert("Mapping added successfully!");
      }
    } catch (error) {
      console.error("Error saving mapping:", error);
      alert("Failed to save mapping");
    }
  };

  const columns = [
    {
      accessor: "eafya_id",
      header: "Eafya ID",
      width: "120px",
      sortable: true,
    },
    {
      accessor: "eafya_name",
      header: "Eafya Name",
      sortable: true,
    },
    {
      accessor: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="item-mappings">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.eafya_id);
            }}
            title="Delete mapping"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];
  console.log("mapping data==", mappingData);
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="bg-primary bg-opacity-10 text-primary p-4 mb-4 rounded">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item">
                  <button
                    className="btn btn-link p-0 text-primary text-decoration-none"
                    onClick={() => history.push("/mapping")}
                  >
                    <FaArrowLeft className="me-1" />
                    Mapping
                  </button>
                </li>
                <li
                  className="breadcrumb-item active text-primary"
                  aria-current="page"
                >
                  {config.title} Detail
                </li>
              </ol>
            </nav>
            <h1 className="display-6 text-primary fw-bold mb-2">
              {mappingData?.hmis_name}
            </h1>
            <p className="lead mb-0 text-primary opacity-75">
              <span className="fw-semibold">HMIS Code:</span>{" "}
              {mappingData?.hmis_code} |{" "}
              <span className="fw-semibold">Type:</span> {config.title}
            </p>
          </div>
          <div className="col-lg-4 mt-3 mt-lg-0">
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={() => handleAdd(mappingData)}
              >
                <FaPlus className="me-2" />
                Add Mapping
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <MappingTable
            data={mappingData?.mappings}
            columns={columns}
            loading={loading}
            pageSize={10}
            searchable={true}
            filterable={true}
            sortable={true}
            emptyMessage="No condition mappings found"
            className="mapping-table"
            onRowClick={() => {}}
          />
        </div>
      </div>

      <MappingDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, row: null })}
        onSave={onSave}
        hmisName={dialogState.row?.hmis_name || ""}
        section={dialogState.row?.[config.sectionField] || ""}
        eafyaItems={eafyaItems}
        onEafyaItemsLoaded={onEafyaItemsLoaded}
        datasetCode={config.datasetCode}
        searchEndpoint={config.searchEndpoint}
      />
    </div>
  );
};

export default MappingDetail;
