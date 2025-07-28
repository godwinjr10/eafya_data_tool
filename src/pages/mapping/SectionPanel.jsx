import React from "react";

const SectionPanel = ({
  currentSections,
  selectedType,
  selectedSection,
  handleSectionClick,
  renderPaginationControls,
  panelHeaderStyle,
  columnHeaderStyle,
}) => {
  // Render section item
  const renderSectionItem = (
    section
  ) => (
    <div
      key={section.id}
      onClick={() =>
        handleSectionClick(
          section.id,
          section.name
        )
      }
      style={{
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: "12px",
        backgroundColor:
          selectedSection?.id ===
          section.id
            ? "#e8f5e8"
            : "transparent",
        borderLeft:
          selectedSection?.id ===
          section.id
            ? "3px solid #4caf50"
            : "3px solid transparent",
        borderBottom:
          "1px solid #f1f1f1",
        transition:
          "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (
          selectedSection?.id !==
          section.id
        ) {
          e.target.style.backgroundColor =
            "#f8f9fa";
        }
      }}
      onMouseLeave={(e) => {
        if (
          selectedSection?.id !==
          section.id
        ) {
          e.target.style.backgroundColor =
            "transparent";
        }
      }}
    >
      <div
        style={{
          fontWeight: "500",
          color: "#333",
        }}
      >
        📁  {section.name}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "320px",
        backgroundColor:
          "white",
        borderRight:
          "1px solid #ddd",
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
        Sections{" "}
        {selectedType &&
          `(${selectedType})`}
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
          Name
        </div>
        {!selectedType ? (
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
            Select a category
            to view sections
          </div>
        ) : currentSections.length ===
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
            No sections found
            for this category
          </div>
        ) : (
          currentSections.map(
            (section) =>
              renderSectionItem(
                section
              )
          )
        )}
      </div>
    </div>
  );
};

export default SectionPanel;
