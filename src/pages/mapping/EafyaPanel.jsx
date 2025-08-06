<<<<<<< HEAD
import React, {
  useState,
} from "react";
=======
import React, { useState } from "react";
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459

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
<<<<<<< HEAD
  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(null);

  const handleAddMapping =
    async (eafyaItem) => {
      if (onAddMappedItem) {
        await onAddMappedItem(
          eafyaItem
        );
      }
    };

  const handleUpdateMapping =
    async (
      mapping,
      newEafyaName
    ) => {
      if (
        onUpdateMappedItem &&
        mapping.id
      ) {
        await onUpdateMappedItem(
          mapping.id,
          mapping.eafya_id,
          newEafyaName
        );
      }
    };

  const handleDeleteMapping =
    async (mapping) => {
      if (
        onDeleteMappedItem &&
        mapping.id
      ) {
        await onDeleteMappedItem(
          mapping.id
        );
        setShowDeleteConfirm(
          null
        );
      }
    };

  const confirmDelete = (
    mapping
  ) => {
    setShowDeleteConfirm(
      mapping
    );
=======
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
  };

  return (
    <div
      style={{
<<<<<<< HEAD
        width: "400px",
        backgroundColor:
          "white",
        borderLeft:
          "1px solid #ddd",
        display: "flex",
        flexDirection:
          "column",
      }}
    >
      {/* Header */}
      <div
        style={
          panelHeaderStyle
        }
      >
        Eafya Items
        {selectedSectionItem && (
          <div
            style={{
              fontSize:
                "11px",
              fontWeight:
                "normal",
              marginTop:
                "4px",
            }}
          >
            {
              selectedSectionItem.hmis_name
            }
          </div>
        )}
=======
        borderLeft: "1px solid #ddd",
      }}
      className="col"
    >
      {/* Header */}
      <div className="p-4 border-bottom fw-bold">
        Eafya Items{" "}
        <small className="text-xs text-secondary fw-thin">
          -({selectedSectionItem && selectedSectionItem.hmis_name})
        </small>
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
      </div>

      {/* Search Section */}
      <div
        style={{
          padding: "16px",
<<<<<<< HEAD
          borderBottom:
            "1px solid #f1f1f1",
        }}
      >
        <SearchDropdown
          items={
            currentSearch
          }
          onSelect={
            handleSelect
          }
          loading={
            searchLoading
          }
          onSearch={
            handleSearch
          }
          displayKey={
            displayKey
          }
          searchKeys={
            searchKeys
          }
          minSearchLength={
            minSearchLength
          }
=======
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
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
          placeholder="Search Eafya items..."
        />

        {/* Selected items for adding */}
<<<<<<< HEAD
        {selectedItems.length >
          0 && (
          <div
            style={{
              marginTop:
                "12px",
=======
        {selectedItems.length > 0 && (
          <div
            style={{
              marginTop: "12px",
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
            }}
          >
            <div
              style={{
<<<<<<< HEAD
                fontSize:
                  "12px",
                fontWeight:
                  "600",
                marginBottom:
                  "8px",
              }}
            >
              Selected Items (
              {
                selectedItems.length
              }
=======
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Selected Items ({selectedItems.length}
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
              ):
            </div>
            <div
              style={{
<<<<<<< HEAD
                maxHeight:
                  "200px",
                overflowY:
                  "auto",
              }}
            >
              {selectedItems.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      padding:
                        "6px 8px",
                      backgroundColor:
                        "#f8f9fa",
                      borderRadius:
                        "4px",
                      marginBottom:
                        "4px",
                      fontSize:
                        "12px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        marginRight:
                          "8px",
                      }}
                    >
                      {
                        item.name
                      }
                    </span>
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "4px",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleAddMapping(
                            item
                          )
                        }
                        disabled={
                          !selectedSectionItem
                        }
                        style={{
                          background:
                            selectedSectionItem
                              ? "#4caf50"
                              : "#ccc",
                          color:
                            "white",
                          border:
                            "none",
                          borderRadius:
                            "3px",
                          padding:
                            "4px 8px",
                          fontSize:
                            "11px",
                          cursor:
                            selectedSectionItem
                              ? "pointer"
                              : "not-allowed",
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
                          handleRemoveSelectedItem(
                            item.id
                          )
                        }
                        style={{
                          background:
                            "#f44336",
                          color:
                            "white",
                          border:
                            "none",
                          borderRadius:
                            "3px",
                          padding:
                            "4px 8px",
                          fontSize:
                            "11px",
                          cursor:
                            "pointer",
                        }}
                        title="Remove from selection"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              )}
=======
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
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
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
<<<<<<< HEAD
            padding:
              "12px 16px",
            borderBottom:
              "1px solid #f1f1f1",
            backgroundColor:
              "#f8f9fa",
=======
            padding: "12px 16px",
            borderBottom: "1px solid #f1f1f1",
            backgroundColor: "#f8f9fa",
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
            fontWeight: "600",
            fontSize: "13px",
          }}
        >
          Mapped Items
          {selectedSection && (
            <div
              style={{
<<<<<<< HEAD
                fontSize:
                  "11px",
                fontWeight:
                  "normal",
                marginTop:
                  "2px",
              }}
            >
              Section:{" "}
              {
                selectedSection.name
              }
=======
                fontSize: "11px",
                fontWeight: "normal",
                marginTop: "2px",
              }}
            >
              Section: {selectedSection.name}
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
            </div>
          )}
        </div>

        {!selectedSectionItem ? (
          <div
            style={{
              padding: "20px",
<<<<<<< HEAD
              textAlign:
                "center",
              fontSize:
                "12px",
              color: "#666",
            }}
          >
            Select a condition
            to view and manage
            mappings
=======
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Select a condition to view and manage mappings
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
          </div>
        ) : mappedLoading ? (
          <div
            style={{
              padding: "20px",
<<<<<<< HEAD
              textAlign:
                "center",
              fontSize:
                "12px",
              color: "#666",
            }}
          >
            Loading
            mappings...
          </div>
        ) : mappedItems.length ===
          0 ? (
          <div
            style={{
              padding: "20px",
              textAlign:
                "center",
              fontSize:
                "12px",
              color: "#666",
            }}
          >
            No mappings found
            for this
            condition.
            <br />
            Search and select
            EAFYA items above
            to create
            mappings.
=======
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
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
          </div>
        ) : (
          <div
            style={{
              padding: "8px",
            }}
          >
            <div
              style={{
<<<<<<< HEAD
                fontSize:
                  "11px",
                color: "#666",
                marginBottom:
                  "8px",
                paddingLeft:
                  "8px",
              }}
            >
              {
                mappedItems.length
              }{" "}
              mapping
              {mappedItems.length !==
              1
                ? "s"
                : ""}{" "}
              found
            </div>
            {mappedItems.map(
              (
                mapping,
                index
              ) => (
                <div
                  key={`${mapping.id}-${index}`}
                  style={{
                    padding:
                      "8px",
                    marginBottom:
                      "6px",
                    border:
                      "1px solid #e1e5e9",
                    borderRadius:
                      "4px",
                    backgroundColor:
                      "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "12px",
                      fontWeight:
                        "500",
                      marginBottom:
                        "4px",
                      color:
                        "#333",
                    }}
                  >
                    {
                      mapping.eafya_name
                    }
                  </div>
                  <div
                    style={{
                      fontSize:
                        "11px",
                      color:
                        "#666",
                      marginBottom:
                        "6px",
                    }}
                  >
                    ID:{" "}
                    {
                      mapping.eafya_id
                    }
                  </div>
                  <div
                    style={{
                      display:
                        "flex",
                      gap: "6px",
                    }}
                  >
                    <button
                      onClick={() => {
                        const newName =
                          prompt(
                            "Enter new name:",
                            mapping.eafya_name
                          );
                        if (
                          newName &&
                          newName.trim() &&
                          newName !==
                            mapping.eafya_name
                        ) {
                          handleUpdateMapping(
                            mapping,
                            newName.trim()
                          );
                        }
                      }}
                      style={{
                        background:
                          "#2196f3",
                        color:
                          "white",
                        border:
                          "none",
                        borderRadius:
                          "3px",
                        padding:
                          "4px 8px",
                        fontSize:
                          "10px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        confirmDelete(
                          mapping
                        )
                      }
                      style={{
                        background:
                          "#f44336",
                        color:
                          "white",
                        border:
                          "none",
                        borderRadius:
                          "3px",
                        padding:
                          "4px 8px",
                        fontSize:
                          "10px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
=======
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
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
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
<<<<<<< HEAD
            backgroundColor:
              "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
=======
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
            zIndex: 1000,
          }}
        >
          <div
            style={{
<<<<<<< HEAD
              backgroundColor:
                "white",
              padding: "20px",
              borderRadius:
                "8px",
              maxWidth:
                "400px",
              width: "90%",
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1)",
=======
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
            }}
          >
            <h3
              style={{
<<<<<<< HEAD
                margin:
                  "0 0 16px 0",
                fontSize:
                  "16px",
=======
                margin: "0 0 16px 0",
                fontSize: "16px",
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
                color: "#333",
              }}
            >
              Confirm Delete
            </h3>
            <p
              style={{
<<<<<<< HEAD
                margin:
                  "0 0 20px 0",
                fontSize:
                  "14px",
                color: "#666",
              }}
            >
              Are you sure you
              want to delete
              the mapping for:
              <br />
              <strong>
                "
                {
                  showDeleteConfirm.eafya_name
                }
                "
              </strong>
              <br />
              This action
              cannot be
              undone.
            </p>
            <div
              style={{
                display:
                  "flex",
                gap: "12px",
                justifyContent:
                  "flex-end",
              }}
            >
              <button
                onClick={() =>
                  setShowDeleteConfirm(
                    null
                  )
                }
                style={{
                  background:
                    "#6c757d",
                  color:
                    "white",
                  border:
                    "none",
                  borderRadius:
                    "4px",
                  padding:
                    "8px 16px",
                  cursor:
                    "pointer",
=======
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
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
                }}
              >
                Cancel
              </button>
              <button
<<<<<<< HEAD
                onClick={() =>
                  handleDeleteMapping(
                    showDeleteConfirm
                  )
                }
                style={{
                  background:
                    "#dc3545",
                  color:
                    "white",
                  border:
                    "none",
                  borderRadius:
                    "4px",
                  padding:
                    "8px 16px",
                  cursor:
                    "pointer",
=======
                onClick={() => handleDeleteMapping(showDeleteConfirm)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
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
