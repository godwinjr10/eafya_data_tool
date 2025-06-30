import React, {
  useState,
  useEffect,
} from "react";
import axios from "axios";
import Papa from "papaparse";
import API from "../../helpers/api";

// Configuration for all mapping types
const mappingConfig = {
  conditions: {
    id: "conditions",
    name: "Conditions",
    section: "CON",
    endpoint:
      "/mapping/conditions",
    primaryKey: "id", // Uses ID-based primary key
    fields: {
      eafya_id: "eafya_id",
      eafya_name:
        "eafya_name",
      data_element_id:
        "data_element_id",
      optioncombo_name:
        "category_optioncombo_name",
    },
  },
  commodities: {
    id: "commodities",
    name: "Commodities",
    section: "COM",
    endpoint:
      "/mapping/commodities",
    primaryKey: "hmis_code", // Uses single key
    fields: {
      eafya_id:
        "eafya_product_id",
      eafya_name:
        "eafya_product_name",
      data_element_id:
        "dhis2_data_element_id",
      optioncombo_name:
        "categoryoptioncombo_name",
    },
  },
  labtests: {
    id: "labtests",
    name: "Lab Tests",
    section: "LAB",
    endpoint:
      "/mapping/labtests",
    primaryKey: "hmis_code", // Uses single key
    fields: {
      eafya_id:
        "eafya_test_id",
      eafya_name:
        "eafya_test_name",
      data_element_id:
        "dhis2_data_element_id",
      optioncombo_name:
        "categoryoptioncombo_name",
    },
  },
  vaccines: {
    id: "vaccines",
    name: "Vaccines",
    section: "VAC",
    endpoint:
      "/mapping/vaccines",
    primaryKey: "composite", // Uses composite key (hmis_code + categoryoptioncombo_uid)
    fields: {
      eafya_id:
        "eafya_vaccine_id",
      eafya_name:
        "eafya_vaccine_name",
      data_element_id:
        "dhis2_data_element_id",
      optioncombo_name:
        "categoryoptioncombo_name",
    },
  },
  postnatal: {
    id: "postnatal",
    name: "Postnatal",
    section: "POS",
    endpoint:
      "/mapping/postnatal",
    primaryKey: "composite", // Uses composite key
    fields: {
      eafya_id:
        "eafya_postnatal_id",
      eafya_name:
        "eafya_postnatal_name",
      data_element_id:
        "dhis2_data_element_id",
      optioncombo_name:
        "categoryoptioncombo_name",
    },
  },
  maternity: {
    id: "maternity",
    name: "Maternity",
    section: "MAT",
    endpoint:
      "/mapping/maternity",
    primaryKey: "composite", // Uses composite key
    fields: {
      eafya_id:
        "eafya_maternity_id",
      eafya_name:
        "eafya_maternity_name",
      data_element_id:
        "dhis2_data_element_id",
      optioncombo_name: null, // Maternity doesn't have optioncombo_name
    },
  },
  familyplanning: {
    id: "familyplanning",
    name: "Family Planning",
    section: "FP",
    endpoint:
      "/mapping/familyplanning",
    primaryKey: "id", // Uses ID-based primary key
    fields: {
      eafya_id: "eafya_fp_id",
      eafya_name:
        "eafya_fp_name",
      data_element_id:
        "dhis2_data_element_id",
      optioncombo_name:
        "categoryoptioncombo_name",
    },
  },
  antenatal: {
    id: "antenatal",
    name: "Antenatal",
    section: "ANT",
    endpoint:
      "/mapping/antenatal",
    primaryKey: "composite", // Uses composite key
    fields: {
      eafya_id:
        "eafya_antenatal_id",
      eafya_name:
        "eafya_antenatal_name",
      data_element_id:
        "dhis2_data_element_id",
      optioncombo_name:
        "categoryoptioncombo_name",
    },
  },
};

const MappingPage = () => {
  const mappingTypes =
    Object.values(
      mappingConfig
    );

  // State management
  const [
    selectedType,
    setSelectedType,
  ] = useState("conditions");
  const [data, setData] =
    useState([]);
  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");
  const [
    editingCell,
    setEditingCell,
  ] = useState(null);
  const [
    hasChanges,
    setHasChanges,
  ] = useState(false);
  const [saving, setSaving] =
    useState(false);
  const [
    savingFields,
    setSavingFields,
  ] = useState({});
  const [
    originalValues,
    setOriginalValues,
  ] = useState({});
  const [
    loading,
    setLoading,
  ] = useState(false);

  // Pagination state
  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);
  const [
    pageSize,
    setPageSize,
  ] = useState(50);
  const [
    totalRecords,
    setTotalRecords,
  ] = useState(0);
  const [
    totalPages,
    setTotalPages,
  ] = useState(0);
  const [
    hasNext,
    setHasNext,
  ] = useState(false);
  const [
    hasPrev,
    setHasPrev,
  ] = useState(false);

  // Get current mapping configuration
  const currentConfig =
    mappingConfig[
      selectedType
    ];

  // Helper function to map backend data to frontend format
  const mapBackendToFrontend =
    (backendData, config) => {
      return backendData.map(
        (item) => ({
          section_id:
            item.section_id,
          section_name:
            item.section_name,
          eafya_id:
            item[
              config.fields
                .eafya_id
            ] || "",
          eafya_name:
            item[
              config.fields
                .eafya_name
            ] || "",
          hmis_code:
            item.hmis_code,
          hmis_name:
            item.hmis_name,
          data_element_id:
            item[
              config.fields
                .data_element_id
            ] || "",
          categoryoptioncombo_uid:
            item.categoryoptioncombo_uid ||
            item.category_optioncombo_id ||
            "",
          optioncombo_name:
            config.fields
              .optioncombo_name
              ? item[
                  config
                    .fields
                    .optioncombo_name
                ] || ""
              : "",
          // Keep original item for reference
          _original: item,
        })
      );
    };

  // Helper function to map frontend data to backend format
  const mapFrontendToBackend =
    (
      frontendRecord,
      config
    ) => {
      const backendData = {
        section_id:
          frontendRecord.section_id,
        section_name:
          frontendRecord.section_name,
        hmis_code:
          frontendRecord.hmis_code,
        hmis_name:
          frontendRecord.hmis_name,
        [config.fields
          .eafya_id]:
          frontendRecord.eafya_id,
        [config.fields
          .eafya_name]:
          frontendRecord.eafya_name,
        [config.fields
          .data_element_id]:
          frontendRecord.data_element_id,
      };

      // Handle different field names for categoryoptioncombo
      if (
        config.id ===
        "conditions"
      ) {
        backendData.category_optioncombo_id =
          frontendRecord.categoryoptioncombo_uid;
      } else {
        backendData.categoryoptioncombo_uid =
          frontendRecord.categoryoptioncombo_uid;
      }

      // Add optioncombo_name if the mapping type supports it
      if (
        config.fields
          .optioncombo_name
      ) {
        backendData[
          config.fields.optioncombo_name
        ] =
          frontendRecord.optioncombo_name;
      }

      return backendData;
    };

  // Helper function to get the correct endpoint URL for updates
  const getUpdateEndpoint = (
    record,
    config
  ) => {
    const baseUrl =
      config.endpoint;

    switch (
      config.primaryKey
    ) {
      case "composite":
        return `${baseUrl}/${record.hmis_code}/${record.categoryoptioncombo_uid}`;
      case "hmis_code":
        return `${baseUrl}/${record.hmis_code}`;
      case "id":
        return `${baseUrl}/${record._original?.id}`;
      default:
        throw new Error(
          `Unknown primary key type: ${config.primaryKey}`
        );
    }
  };

  // Fetch data with pagination
  const fetchData = async (
    page = 1,
    search = ""
  ) => {
    setLoading(true);
    try {
      const params =
        new URLSearchParams({
          page: page.toString(),
          limit:
            pageSize.toString(),
          search: search,
        });

      const response =
        await API.get(
          `${currentConfig.endpoint}?${params}`
        );

      console.log(
        "API Response:",
        response.data
      );
      console.log(
        "Current config:",
        currentConfig
      );
      console.log(
        "Params:",
        params.toString()
      );

      // Handle both paginated and non-paginated responses
      if (
        response.data.data &&
        response.data
          .pagination
      ) {
        // Paginated response
        const mappedData =
          mapBackendToFrontend(
            response.data
              .data,
            currentConfig
          );
        setData(mappedData);
        setCurrentPage(
          response.data
            .pagination.page
        );
        setTotalRecords(
          response.data
            .pagination.total
        );
        setTotalPages(
          response.data
            .pagination
            .totalPages
        );
        setHasNext(
          response.data
            .pagination
            .hasNext
        );
        setHasPrev(
          response.data
            .pagination
            .hasPrev
        );
      } else {
        // Non-paginated response (fallback)
        const mappedData =
          mapBackendToFrontend(
            response.data,
            currentConfig
          );
        setData(mappedData);
        setTotalRecords(
          mappedData.length
        );
        setTotalPages(1);
        setCurrentPage(1);
        setHasNext(false);
        setHasPrev(false);
      }

      setEditingCell(null);
      setHasChanges(false);
      setOriginalValues({});
    } catch (error) {
      console.error(
        "Error fetching data:",
        error
      );
      setData([]);
      setTotalRecords(0);
      setTotalPages(0);
      setCurrentPage(1);
      setHasNext(false);
      setHasPrev(false);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle mapping type change
  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchData(1, "");
  }, [
    selectedType,
    pageSize,
  ]);

  // Effect to handle search with debouncing
  useEffect(() => {
    const timeoutId =
      setTimeout(() => {
        setCurrentPage(1);
        fetchData(
          1,
          searchTerm
        );
      }, 500); // Debounce search by 500ms

    return () =>
      clearTimeout(timeoutId);
  }, [searchTerm]);

  // Generic function to update field value locally
  const updateFieldValue = (
    index,
    field,
    value
  ) => {
    const newData = [...data];
    newData[index][field] =
      value;
    setData(newData);
  };

  // Generic function to save field value to backend
  const saveFieldValue =
    async (index, field) => {
      const record =
        data[index];
      const fieldKey = `${index}-${field}`;
      const originalValue =
        originalValues[
          fieldKey
        ];

      // Don't save if value hasn't changed
      if (
        record[field] ===
        originalValue
      ) {
        return;
      }

      // Set loading state for this field
      setSavingFields(
        (prev) => ({
          ...prev,
          [fieldKey]: true,
        })
      );

      try {
        const updateData =
          mapFrontendToBackend(
            record,
            currentConfig
          );
        const endpoint =
          getUpdateEndpoint(
            record,
            currentConfig
          );

        await API.put(
          endpoint,
          updateData
        );

        // Update the original value after successful save
        setOriginalValues(
          (prev) => ({
            ...prev,
            [fieldKey]:
              record[field],
          })
        );
      } catch (error) {
        console.error(
          `Error updating ${field}:`,
          error
        );
        // Revert local state on error
        const revertedData = [
          ...data,
        ];
        revertedData[index][
          field
        ] = originalValue;
        setData(revertedData);
      } finally {
        // Remove loading state
        setSavingFields(
          (prev) => {
            const newState = {
              ...prev,
            };
            delete newState[
              fieldKey
            ];
            return newState;
          }
        );
      }
    };

  // Handle file upload
  const handleFileUpload =
    async (event) => {
      const file =
        event.target.files[0];
      if (file) {
        const reader =
          new FileReader();
        reader.onload = (
          e
        ) => {
          try {
            Papa.parse(
              e.target.result,
              {
                header: true,
                complete: (
                  results
                ) => {
                  const mappedData =
                    results.data.map(
                      (
                        row
                      ) => ({
                        section_id:
                          currentConfig.section,
                        hmis_code:
                          row.hmis_code,
                        hmis_name:
                          row.hmis_name,
                        eafya_id:
                          row.eafya_id ||
                          "",
                        eafya_name:
                          row.eafya_name ||
                          "",
                        data_element_id:
                          row.data_element_id ||
                          "",
                        categoryoptioncombo_uid:
                          row.categoryoptioncombo_uid ||
                          "",
                        optioncombo_name:
                          row.optioncombo_name ||
                          "",
                      })
                    );
                  setData(
                    mappedData
                  );
                  setHasChanges(
                    true
                  );
                },
                error: (
                  error
                ) => {
                  console.error(
                    "Error parsing CSV:",
                    error
                  );
                },
              }
            );
          } catch (error) {
            console.error(
              "Error processing CSV:",
              error
            );
          }
        };
        reader.readAsText(
          file
        );
      }
    };

  // Handle saving changes
  const handleSave = () => {
    setHasChanges(false);
  };

  // Render editable cell
  const renderEditableCell = (
    record,
    index,
    field,
    placeholder = "Click to edit"
  ) => {
    const fieldKey = `${index}-${field}`;
    const isEditing =
      editingCell ===
      fieldKey;
    const isSaving =
      savingFields[fieldKey];

    if (isEditing) {
      return (
        <div className="position-relative">
          <input
            type="text"
            className="form-control form-control-sm border-0"
            value={
              record[field]
            }
            onChange={(e) =>
              updateFieldValue(
                index,
                field,
                e.target.value
              )
            }
            onBlur={() => {
              setEditingCell(
                null
              );
              saveFieldValue(
                index,
                field
              );
            }}
            onKeyDown={(
              e
            ) => {
              if (
                e.key ===
                "Enter"
              ) {
                setEditingCell(
                  null
                );
                saveFieldValue(
                  index,
                  field
                );
              }
            }}
            autoFocus
            disabled={
              isSaving
            }
            style={{
              fontSize:
                "11px",
              minWidth:
                "80px",
              backgroundColor:
                "#fff",
              boxShadow:
                "0 0 0 2px #0d6efd",
            }}
          />
          {isSaving && (
            <div
              className="position-absolute top-50 end-0 translate-middle-y me-2"
              style={{
                fontSize:
                  "10px",
              }}
            >
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Saving...
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className="p-1 position-relative"
        onClick={() => {
          setEditingCell(
            fieldKey
          );
          setOriginalValues(
            (prev) => ({
              ...prev,
              [fieldKey]:
                record[field],
            })
          );
        }}
        style={{
          cursor: "pointer",
          backgroundColor:
            record[field]
              ? "#f0f9ff"
              : "#fef3c7",
          border:
            "1px solid " +
            (record[field]
              ? "#e0f2fe"
              : "#fde68a"),
          borderRadius: "3px",
          minHeight: "24px",
          fontSize: "11px",
          color: record[field]
            ? "#0c4a6e"
            : "#92400e",
        }}
      >
        {record[field] ||
          placeholder}
        {isSaving && (
          <div
            className="position-absolute top-50 end-0 translate-middle-y me-1"
            style={{
              fontSize: "8px",
            }}
          >
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Saving...
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor:
            "#f8f9fa",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-muted">
            Loading{" "}
            {
              currentConfig.name
            }{" "}
            mappings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor:
          "#f8f9fa",
      }}
    >
      <div className="container-fluid p-3">
        {/* Header */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4
                  className="mb-1"
                  style={{
                    fontSize:
                      "18px",
                    fontWeight:
                      "500",
                    color:
                      "#212529",
                  }}
                >
                  DHIS Eafya
                  Mapping -{" "}
                  {
                    currentConfig.name
                  }
                </h4>
                <p
                  className="mb-0"
                  style={{
                    fontSize:
                      "13px",
                    color:
                      "#6c757d",
                  }}
                >
                  {
                    totalRecords
                  }{" "}
                  total
                  records •
                  Page{" "}
                  {
                    currentPage
                  }{" "}
                  of{" "}
                  {totalPages}{" "}
                  • Click on
                  Eafya fields
                  to edit
                </p>
              </div>
              <div className="d-flex gap-2">
                {/* Mapping Type Selector */}
                <select
                  className="form-select border-0"
                  value={
                    selectedType
                  }
                  onChange={(
                    e
                  ) =>
                    setSelectedType(
                      e.target
                        .value
                    )
                  }
                  style={{
                    width:
                      "180px",
                    fontSize:
                      "12px",
                    backgroundColor:
                      "white",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {mappingTypes.map(
                    (
                      type
                    ) => (
                      <option
                        key={
                          type.id
                        }
                        value={
                          type.id
                        }
                      >
                        {
                          type.name
                        }
                      </option>
                    )
                  )}
                </select>
                <input
                  type="file"
                  accept=".csv"
                  onChange={
                    handleFileUpload
                  }
                  className="form-control border-0"
                  style={{
                    width:
                      "200px",
                    fontSize:
                      "12px",
                    backgroundColor:
                      "white",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                />
                <button
                  className="btn border-0"
                  onClick={
                    handleSave
                  }
                  disabled={
                    !hasChanges ||
                    saving
                  }
                  style={{
                    fontSize:
                      "12px",
                    whiteSpace:
                      "nowrap",
                    backgroundColor:
                      hasChanges
                        ? "#198754"
                        : "#e9ecef",
                    color:
                      hasChanges
                        ? "white"
                        : "#6c757d",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Search and Pagination Controls */}
            <div className="row mb-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search by HMIS name, code, or Eafya name..."
                  value={
                    searchTerm
                  }
                  onChange={(
                    e
                  ) =>
                    setSearchTerm(
                      e.target
                        .value
                    )
                  }
                  style={{
                    fontSize:
                      "12px",
                    backgroundColor:
                      "white",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
              <div className="col-md-8 d-flex justify-content-end align-items-center gap-3">
                {/* Page Size Selector */}
                <div className="d-flex align-items-center gap-2">
                  <label
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#6c757d",
                    }}
                  >
                    Show:
                  </label>
                  <select
                    className="form-select border-0"
                    value={
                      pageSize
                    }
                    onChange={(
                      e
                    ) =>
                      setPageSize(
                        parseInt(
                          e
                            .target
                            .value
                        )
                      )
                    }
                    style={{
                      width:
                        "80px",
                      fontSize:
                        "12px",
                      backgroundColor:
                        "white",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <option
                      value={
                        25
                      }
                    >
                      25
                    </option>
                    <option
                      value={
                        50
                      }
                    >
                      50
                    </option>
                    <option
                      value={
                        100
                      }
                    >
                      100
                    </option>
                    <option
                      value={
                        200
                      }
                    >
                      200
                    </option>
                  </select>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn border-0"
                    onClick={() =>
                      fetchData(
                        1,
                        searchTerm
                      )
                    }
                    disabled={
                      !hasPrev ||
                      loading
                    }
                    style={{
                      fontSize:
                        "12px",
                      backgroundColor:
                        hasPrev
                          ? "white"
                          : "#e9ecef",
                      color:
                        hasPrev
                          ? "#495057"
                          : "#6c757d",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.1)",
                      minWidth:
                        "35px",
                    }}
                  >
                    ««
                  </button>
                  <button
                    className="btn border-0"
                    onClick={() =>
                      fetchData(
                        currentPage -
                          1,
                        searchTerm
                      )
                    }
                    disabled={
                      !hasPrev ||
                      loading
                    }
                    style={{
                      fontSize:
                        "12px",
                      backgroundColor:
                        hasPrev
                          ? "white"
                          : "#e9ecef",
                      color:
                        hasPrev
                          ? "#495057"
                          : "#6c757d",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.1)",
                      minWidth:
                        "35px",
                    }}
                  >
                    ‹
                  </button>
                  <span
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#495057",
                      minWidth:
                        "100px",
                      textAlign:
                        "center",
                    }}
                  >
                    Page{" "}
                    {
                      currentPage
                    }{" "}
                    of{" "}
                    {
                      totalPages
                    }
                  </span>
                  <button
                    className="btn border-0"
                    onClick={() =>
                      fetchData(
                        currentPage +
                          1,
                        searchTerm
                      )
                    }
                    disabled={
                      !hasNext ||
                      loading
                    }
                    style={{
                      fontSize:
                        "12px",
                      backgroundColor:
                        hasNext
                          ? "white"
                          : "#e9ecef",
                      color:
                        hasNext
                          ? "#495057"
                          : "#6c757d",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.1)",
                      minWidth:
                        "35px",
                    }}
                  >
                    ›
                  </button>
                  <button
                    className="btn border-0"
                    onClick={() =>
                      fetchData(
                        totalPages,
                        searchTerm
                      )
                    }
                    disabled={
                      !hasNext ||
                      loading
                    }
                    style={{
                      fontSize:
                        "12px",
                      backgroundColor:
                        hasNext
                          ? "white"
                          : "#e9ecef",
                      color:
                        hasNext
                          ? "#495057"
                          : "#6c757d",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.1)",
                      minWidth:
                        "35px",
                    }}
                  >
                    »»
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="row">
          <div className="col-12">
            <div
              style={{
                backgroundColor:
                  "white",
                borderRadius:
                  "4px",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="table-responsive">
                <table
                  className="table table-sm table-hover mb-0"
                  style={{
                    fontSize:
                      "11px",
                  }}
                >
                  <thead
                    style={{
                      backgroundColor:
                        "#f8f9fa",
                      borderBottom:
                        "1px solid #dee2e6",
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          width:
                            "60px",
                          fontSize:
                            "10px",
                          color:
                            "#495057",
                          fontWeight:
                            "500",
                        }}
                      >
                        Section
                      </th>
                      <th
                        style={{
                          width:
                            "100px",
                          fontSize:
                            "10px",
                          color:
                            "#495057",
                          fontWeight:
                            "500",
                        }}
                      >
                        Eafya
                        ID
                      </th>
                      <th
                        style={{
                          minWidth:
                            "200px",
                          fontSize:
                            "10px",
                          color:
                            "#495057",
                          fontWeight:
                            "500",
                        }}
                      >
                        Eafya
                        Name
                      </th>
                      <th
                        style={{
                          width:
                            "80px",
                          fontSize:
                            "10px",
                          color:
                            "#495057",
                          fontWeight:
                            "500",
                        }}
                      >
                        HMIS
                        Code
                      </th>
                      <th
                        style={{
                          minWidth:
                            "300px",
                          fontSize:
                            "10px",
                          color:
                            "#495057",
                          fontWeight:
                            "500",
                        }}
                      >
                        HMIS
                        Name
                      </th>
                      <th
                        style={{
                          width:
                            "120px",
                          fontSize:
                            "10px",
                          color:
                            "#495057",
                          fontWeight:
                            "500",
                        }}
                      >
                        Data
                        Element
                        ID
                      </th>
                      <th
                        style={{
                          width:
                            "120px",
                          fontSize:
                            "10px",
                          color:
                            "#495057",
                          fontWeight:
                            "500",
                        }}
                      >
                        Category
                        Combo
                      </th>
                      {currentConfig
                        .fields
                        .optioncombo_name && (
                        <th
                          style={{
                            width:
                              "120px",
                            fontSize:
                              "10px",
                            color:
                              "#495057",
                            fontWeight:
                              "500",
                          }}
                        >
                          Option
                          Combo
                          Name
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(
                      (
                        record,
                        index
                      ) => (
                        <tr
                          key={`${record.section_id}-${record.hmis_code}-${index}`}
                          style={{
                            borderBottom:
                              "1px solid #f1f3f4",
                          }}
                        >
                          <td className="text-center">
                            <span
                              style={{
                                fontSize:
                                  "9px",
                                backgroundColor:
                                  "#e9ecef",
                                color:
                                  "#495057",
                                padding:
                                  "2px 6px",
                                borderRadius:
                                  "3px",
                                fontWeight:
                                  "500",
                              }}
                            >
                              {
                                record.section_id
                              }
                            </span>
                          </td>
                          <td>
                            {renderEditableCell(
                              record,
                              index,
                              "eafya_id"
                            )}
                          </td>
                          <td>
                            {renderEditableCell(
                              record,
                              index,
                              "eafya_name"
                            )}
                          </td>
                          <td>
                            <span
                              style={{
                                fontSize:
                                  "9px",
                                backgroundColor:
                                  "#e3f2fd",
                                color:
                                  "#1565c0",
                                padding:
                                  "2px 6px",
                                borderRadius:
                                  "3px",
                                fontWeight:
                                  "500",
                              }}
                            >
                              {
                                record.hmis_code
                              }
                            </span>
                          </td>
                          <td
                            style={{
                              fontSize:
                                "11px",
                              color:
                                "#212529",
                            }}
                          >
                            {
                              record.hmis_name
                            }
                          </td>
                          <td
                            style={{
                              fontSize:
                                "10px",
                              fontFamily:
                                "monospace",
                              color:
                                "#6c757d",
                            }}
                          >
                            {
                              record.data_element_id
                            }
                          </td>
                          <td
                            style={{
                              fontSize:
                                "10px",
                              fontFamily:
                                "monospace",
                              color:
                                "#6c757d",
                            }}
                          >
                            {
                              record.categoryoptioncombo_uid
                            }
                          </td>
                          {currentConfig
                            .fields
                            .optioncombo_name && (
                            <td
                              style={{
                                fontSize:
                                  "11px",
                                color:
                                  "#495057",
                              }}
                            >
                              {
                                record.optioncombo_name
                              }
                            </td>
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className="position-fixed bottom-0 end-0 p-3">
            <div
              className="alert mb-0"
              style={{
                fontSize:
                  "12px",
                backgroundColor:
                  "#fff3cd",
                border:
                  "1px solid #ffeaa7",
                color:
                  "#856404",
                borderRadius:
                  "4px",
              }}
            >
              You have unsaved
              changes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MappingPage;
