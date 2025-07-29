import React from "react";

const ItemsPanel = ({
  currentSectionItems,
  selectedSection,
  renderSectionItemDetails,
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
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <div
          style={
            columnHeaderStyle
          }
        >
          Details
        </div>
        {!selectedSection ? (
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
        )}
      </div>
    </div>
  );
};

export default ItemsPanel;
