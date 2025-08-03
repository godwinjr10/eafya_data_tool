import React from "react";

const ItemsPanel = ({
  currentSectionItems,
  selectedSection,
  renderSectionItemDetails
}) => {
  return (
    <div className="col">
      <div className="p-4 border-bottom fw-bold">
        Conditions
        {selectedSection && (
          <small className="text-xs text-secondary fw-thin">
            -({selectedSection.name})
          </small>
        )}
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {!selectedSection ? (
          <div
            style={{
              padding: "20px",
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
        )}
      </div>
    </div>
  );
};

export default ItemsPanel;
