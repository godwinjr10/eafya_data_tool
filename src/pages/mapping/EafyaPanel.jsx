import React, {
  useState,
} from "react";

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
  mappedItems = [],
  mappedLoading = false,
  onAddMappedItem,
  onUpdateMappedItem,
  onDeleteMappedItem,
  selectedSection,
}) => {
  // Local state for mapping
  const [
    selectedEafya,
    setSelectedEafya,
  ] = useState(null);
  const [editId, setEditId] =
    useState(null);
  const [
    editEafyaId,
    setEditEafyaId,
  ] = useState("");
  const [
    editEafyaName,
    setEditEafyaName,
  ] = useState("");

  // When a user selects from search, store it for mapping
  const handleSearchSelect = (
    item
  ) => {
    setSelectedEafya(item);
    handleSelect(item);
  };

  const handleMap = () => {
    if (
      !selectedSection ||
      !selectedEafya
    )
      return;
    onAddMappedItem(
      selectedEafya
    );
    setSelectedEafya(null);
  };

  const handleEdit = (
    item
  ) => {
    setEditId(item.id);
    setEditEafyaId(
      item.eafya_id || ""
    );
    setEditEafyaName(
      item.eafya_name || ""
    );
  };

  const handleEditSave = (
    itemId
  ) => {
    onUpdateMappedItem(
      itemId,
      editEafyaId,
      editEafyaName
    );
    setEditId(null);
    setEditEafyaId("");
    setEditEafyaName("");
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection:
          "column",
      }}
      className="bg-light"
    >
      <div
        style={
          panelHeaderStyle
        }
      >
        <span>Eafya</span>
      </div>
      <div
        style={{
          backgroundColor:
            "#f8f9fa",
          padding: "6px 12px",
          borderBottom:
            "1px solid #ddd",
          fontSize: "11px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
        }}
      >
        <span>
          Sorting Order
        </span>
        <button
          style={{
            padding:
              "1px 6px",
            fontSize: "10px",
            border:
              "1px solid #ccc",
            background:
              "white",
            cursor: "pointer",
          }}
        >
          🔄
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <div
          style={{
            backgroundColor:
              "#f0f0f0",
            padding:
              "4px 8px",
            fontSize: "11px",
            fontWeight:
              "bold",
            borderBottom:
              "1px solid #ddd",
          }}
        >
          Item (
          {
            selectedItems.length
          }
          )
        </div>
        <div className="py-4 px-2">
          <SearchDropdown
            data={
              currentSearch
            }
            onSelect={
              handleSearchSelect
            }
            placeholder="Search items..."
            searchKeys={
              searchKeys
            }
            displayKey={
              displayKey
            }
            isLoading={
              searchLoading
            }
            minSearchLength={
              minSearchLength
            }
            onSearch={
              handleSearch
            }
          />

          {selectedEafya && (
            <div className="my-2 p-2 bg-light rounded">
              <div>
                <b>
                  Selected
                  Eafya:
                </b>{" "}
                {selectedEafya.name ||
                  selectedEafya.eafya_name}{" "}
                (ID:{" "}
                {selectedEafya.id ||
                  selectedEafya.eafya_id}
                )
              </div>
              <button
                onClick={
                  handleMap
                }
                disabled={
                  !selectedSection
                }
                className="btn btn-sm btn-primary mt-1"
                style={{
                  fontSize: 12,
                }}
              >
                {selectedSection
                  ? "Map to Selected Data Element"
                  : "Select a Section First"}
              </button>
            </div>
          )}

          <div className="mt-3">
            <h5>
              Mapped Items
            </h5>
            {selectedItems.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="d-flex align-items-center border-bottom py-1"
                  style={{
                    gap: 8,
                  }}
                >
                  {editId ===
                  item.id ? (
                    <>
                      <input
                        value={
                          editEafyaId
                        }
                        onChange={(
                          e
                        ) =>
                          setEditEafyaId(
                            e
                              .target
                              .value
                          )
                        }
                        placeholder="Eafya ID"
                        className="form-control form-control-sm"
                        style={{
                          width: 80,
                        }}
                      />
                      <input
                        value={
                          editEafyaName
                        }
                        onChange={(
                          e
                        ) =>
                          setEditEafyaName(
                            e
                              .target
                              .value
                          )
                        }
                        placeholder="Eafya Name"
                        className="form-control form-control-sm"
                        style={{
                          width: 120,
                        }}
                      />
                      <button
                        onClick={() =>
                          handleEditSave(
                            item.id
                          )
                        }
                        className="btn btn-success btn-sm"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() =>
                          setEditId(
                            null
                          )
                        }
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="fw-medium">
                        {
                          item.eafya_id
                        }
                      </span>
                      <span>
                        {
                          item.eafya_name
                        }
                      </span>
                      <button
                        onClick={() =>
                          handleEdit(
                            item
                          )
                        }
                        className="btn btn-outline-primary btn-sm"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          onDeleteMappedItem(
                            item.id
                          )
                        }
                        className="btn btn-outline-danger btn-sm"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EafyaPanel;
