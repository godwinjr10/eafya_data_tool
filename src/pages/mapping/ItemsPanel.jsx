import React from "react";

const ItemsPanel = ({
  currentSectionItems,
  selectedSection,
  renderSectionItemDetails,
<<<<<<< HEAD
  renderPaginationControls,
  panelHeaderStyle,
  columnHeaderStyle,
}) => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor:
          "white",
        display: "flex",
        flexDirection:
          "column",
      }}
    >
      <div
        style={
          panelHeaderStyle
        }
      >
        Conditions
        {selectedSection &&
          ` (${selectedSection.name})`}
      </div>
      {renderPaginationControls()}
=======
}) => {
  return (
    <div className="col">
      <div className="p-4 border-bottom fw-bold">
        All
        {selectedSection && (
          <small className="text-xs text-secondary fw-thin">
            -({selectedSection.name})
          </small>
        )}
      </div>
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
<<<<<<< HEAD
        <div
          style={
            columnHeaderStyle
          }
        >
          Details
        </div>
=======
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
        {!selectedSection ? (
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
            Select a section
            to view conditions
          </div>
        ) : currentSectionItems.length ===
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
            No conditions
            found for this
            section
          </div>
        ) : (
          currentSectionItems.map(
            (item) =>
              renderSectionItemDetails(
                item
              )
          )
=======
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Select a section to view conditions
          </div>
        ) : currentSectionItems.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            No conditions found for this section
          </div>
        ) : (
          <div
            class=" w-100 border-0   overflow-auto"
            style={{
              height: "75vh",
            }}
          >
            {currentSectionItems.map((item) => renderSectionItemDetails(item))}
          </div>
>>>>>>> 5e8829423a7c3b61e0fb755c12ff1b92b1c93459
        )}
      </div>
    </div>
  );
};

export default ItemsPanel;
