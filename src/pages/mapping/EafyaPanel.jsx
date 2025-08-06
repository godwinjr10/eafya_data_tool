import React, { useState } from "react";
import API from "../../helpers/api";
import { FolderOpen, Download, Loader2, Info } from "lucide-react";

const EafyaPanel = ({
  currentSearch,
  handleSelect,
  searchLoading,
  handleSearch,
  selectedItems,
  SearchDropdown,
  panelHeaderStyle,
  displayKey,
  searchKeys,
  minSearchLength,
  mappedItems,
  mappedLoading,
  onAddMappedItem,
  onUpdateMappedItem,
  onDeleteMappedItem,
  selectedSection,
  selectedSectionItem,
  handleRemoveSelectedItem,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [totalEafyaItems, setTotalEafyaItems] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(true);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Available EAFYA categories
  const availableCategories = [
    "Bed",
    "Blood Transfusion",
    "Clinic",
    "Department",
    "Disease",
    "Family Planning",
    "Family Planning Category",
    "Imaging",
    "Imaging Category",
    "Inventory Unit",
    "Lab Test",
    "Lab Test Category",
    "Lab Test Sample Type",
    "Lab Tests Parent",
    "Major Theatre",
    "Major Theatre Category",
    "Major Theatre Room",
    "Minor Theatre",
    "Minor Theatre Category",
    "Pharmacology",
    "Product",
    "Room",
    "Store",
    "Triage Type",
    "Vaccine",
    "Visit Type",
    "Vital Type",
    "Ward",
  ];

  // Fetch total count of EAFYA items on component mount
  React.useEffect(() => {
    const fetchTotalCount = async () => {
      setLoadingTotal(true);
      try {
        const response = await API.get(
          "/mapping/items/eafya-items?download=true"
        );
        setTotalEafyaItems(response.data.length);
      } catch (error) {
        console.error("Error fetching total EAFYA items count:", error);
      } finally {
        setLoadingTotal(false);
      }
    };

    fetchTotalCount();
  }, []);

  // Handle clicking outside dropdown to close it
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategorySelector) {
        const dropdown = event.target.closest("[data-dropdown]");
        if (!dropdown) {
          setShowCategorySelector(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategorySelector]);

  const handleAddMapping = async (eafyaItem) => {
    if (onAddMappedItem) {
      await onAddMappedItem(eafyaItem);
    }
  };

  const handleUpdateMapping = async (mapping, newEafyaName) => {
    if (onUpdateMappedItem && mapping.id) {
      await onUpdateMappedItem(mapping.id, mapping.eafya_id, newEafyaName);
    }
  };

  const handleDeleteMapping = async (mapping) => {
    if (onDeleteMappedItem && mapping.id) {
      await onDeleteMappedItem(mapping.id);
      setShowDeleteConfirm(null);
    }
  };

  const confirmDelete = (mapping) => {
    setShowDeleteConfirm(mapping);
  };

  // Handle category selection
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle select all categories
  const handleSelectAllCategories = () => {
    setSelectedCategories(availableCategories);
  };

  // Handle deselect all categories
  const handleDeselectAllCategories = () => {
    setSelectedCategories([]);
  };

  // Function to download all EAFYA items as CSV
  const downloadEafyaItems = async () => {
    setDownloading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("download", "true");

      if (selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(","));
      }

      // Fetch EAFYA items with category filter
      const response = await API.get(
        `/mapping/items/eafya-items?${params.toString()}`
      );

      const items = response.data;

      if (!items || items.length === 0) {
        alert("No EAFYA items found to download.");
        return;
      }

      // Create CSV content
      const csvHeaders = ["ID", "Name", "Category"];
      const csvRows = items.map((item) => [
        item.id,
        item.name,
        item.category || "General",
      ]);

      // Combine headers and rows
      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      // Create filename with category info
      const categorySuffix =
        selectedCategories.length > 0
          ? `_${selectedCategories.length}_categories`
          : "_all_categories";
      link.setAttribute(
        "download",
        `eafya_items_${
          new Date().toISOString().split("T")[0]
        }${categorySuffix}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);

      const categoryText =
        selectedCategories.length > 0
          ? ` (${selectedCategories.length} categories selected)`
          : " (all categories)";

      alert(
        `Successfully downloaded ${items.length.toLocaleString()} EAFYA items${categoryText}!`
      );
    } catch (error) {
      console.error("Error downloading EAFYA items:", error);
      alert(
        `Failed to download EAFYA items: ${
          error.response?.data?.error || error.message
        }. Please try again.`
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        borderLeft: "1px solid #ddd",
      }}
      className="col"
    >
      {/* Header */}
      <div className="p-4 border-bottom fw-bold d-flex justify-content-between align-items-center">
        <div>
          Eafya Ids{" "}
          {loadingTotal ? (
            <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
              Loading total items...
            </div>
          ) : totalEafyaItems > 0 ? (
            <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
              {totalEafyaItems.toLocaleString()} total items available
            </div>
          ) : (
            <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
              No EAFYA items found.
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {/* Category Selector Dropdown */}
          <div style={{ position: "relative" }} data-dropdown>
            <button
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              style={{
                background: showCategorySelector ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                minWidth: "auto",
                whiteSpace: "nowrap",
              }}
              title="Select categories to download"
            >
              <FolderOpen size={14} />
              <span>
                {selectedCategories.length > 0
                  ? selectedCategories.length
                  : "All"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showCategorySelector && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  minWidth: "280px",
                  maxHeight: "300px",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #eee",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>
                    Select Categories
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      onClick={handleSelectAllCategories}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "3px 6px",
                        fontSize: "9px",
                        cursor: "pointer",
                      }}
                    >
                      All
                    </button>
                    <button
                      onClick={handleDeselectAllCategories}
                      style={{
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "3px 6px",
                        fontSize: "9px",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Categories Grid */}
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "4px",
                    }}
                  >
                    {availableCategories.map((category) => (
                      <label
                        key={category}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "10px",
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          backgroundColor: selectedCategories.includes(category)
                            ? "#e3f2fd"
                            : "transparent",
                          border: selectedCategories.includes(category)
                            ? "1px solid #2196f3"
                            : "1px solid transparent",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedCategories.includes(category)) {
                            e.target.style.backgroundColor = "#f5f5f5";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedCategories.includes(category)) {
                            e.target.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          style={{
                            margin: 0,
                            accentColor: "#2196f3",
                          }}
                        />
                        <span
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                {selectedCategories.length > 0 && (
                  <div
                    style={{
                      padding: "8px 16px",
                      borderTop: "1px solid #eee",
                      backgroundColor: "#f8f9fa",
                      fontSize: "10px",
                      color: "#666",
                      textAlign: "center",
                    }}
                  >
                    {selectedCategories.length} category
                    {selectedCategories.length !== 1 ? "ies" : "y"} selected
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={downloadEafyaItems}
            disabled={downloading}
            style={{
              background: downloading ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "10px",
              cursor: downloading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              whiteSpace: "nowrap",
            }}
            title={`Download ${
              selectedCategories.length > 0 ? selectedCategories.length : "all"
            } categories as CSV`}
          >
            {downloading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span style={{ fontSize: "9px" }}>...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span style={{ fontSize: "9px" }}>CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #f1f1f1",
        }}
      >
        <SearchDropdown
          items={currentSearch}
          onSelect={handleSelect}
          loading={searchLoading}
          onSearch={handleSearch}
          displayKey={displayKey}
          searchKeys={searchKeys}
          minSearchLength={minSearchLength}
          placeholder="Search Eafya items..."
        />

        {/* Info section about download feature */}
        <div
          style={{
            marginTop: "6px",
            padding: "4px 8px",
            backgroundColor: "#f0f8ff",
            borderRadius: "3px",
            fontSize: "9px",
            color: "#0066cc",
            border: "1px solid #cce5ff",
            display: "inline-block",
          }}
        >
          <Info
            size={12}
            style={{ marginRight: "4px", verticalAlign: "middle" }}
          />
          Click{" "}
          <FolderOpen
            size={10}
            style={{ marginRight: "2px", verticalAlign: "middle" }}
          />{" "}
          to filter categories
        </div>

        {/* Selected items for adding */}
        {selectedItems.length > 0 && (
          <div
            style={{
              marginTop: "12px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Selected Items ({selectedItems.length}
              ):
            </div>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 8px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    marginBottom: "4px",
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      marginRight: "8px",
                    }}
                  >
                    {item.name}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    <button
                      onClick={() => handleAddMapping(item)}
                      disabled={!selectedSectionItem}
                      style={{
                        background: selectedSectionItem ? "#4caf50" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        cursor: selectedSectionItem ? "pointer" : "not-allowed",
                      }}
                      title={
                        !selectedSectionItem
                          ? "Select a condition first"
                          : "Add mapping"
                      }
                    >
                      Add
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveSelectedItem &&
                        handleRemoveSelectedItem(item.id)
                      }
                      style={{
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                      title="Remove from selection"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mapped Items Section */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #f1f1f1",
            backgroundColor: "#f8f9fa",
            fontWeight: "600",
            fontSize: "13px",
          }}
        >
          Mapped Items
          {selectedSection && (
            <div
              style={{
                fontSize: "11px",
                fontWeight: "normal",
                marginTop: "2px",
              }}
            >
              Section: {selectedSection.name}
            </div>
          )}
        </div>

        {!selectedSectionItem ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Select a condition to view and manage mappings
          </div>
        ) : mappedLoading ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Loading mappings...
          </div>
        ) : mappedItems.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            No mappings found for this condition.
            <br />
            Search and select EAFYA items above to create mappings.
          </div>
        ) : (
          <div
            style={{
              padding: "8px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#666",
                marginBottom: "8px",
                paddingLeft: "8px",
              }}
            >
              {mappedItems.length} mapping
              {mappedItems.length !== 1 ? "s" : ""} found
            </div>
            {mappedItems.map((mapping, index) => (
              <div
                key={`${mapping.id}-${index}`}
                style={{
                  padding: "8px",
                  marginBottom: "6px",
                  border: "1px solid #e1e5e9",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    marginBottom: "4px",
                    color: "#333",
                  }}
                >
                  {mapping.eafya_name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#666",
                    marginBottom: "6px",
                  }}
                >
                  ID: {mapping.eafya_id}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                  }}
                >
                  <button
                    onClick={() => {
                      const newName = prompt(
                        "Enter new name:",
                        mapping.eafya_name
                      );
                      if (
                        newName &&
                        newName.trim() &&
                        newName !== mapping.eafya_name
                      ) {
                        handleUpdateMapping(mapping, newName.trim());
                      }
                    }}
                    style={{
                      background: "#2196f3",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      padding: "4px 8px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(mapping)}
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      padding: "4px 8px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                color: "#333",
              }}
            >
              Confirm Delete
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Are you sure you want to delete the mapping for:
              <br />
              <strong>"{showDeleteConfirm.eafya_name}"</strong>
              <br />
              This action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMapping(showDeleteConfirm)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EafyaPanel;
