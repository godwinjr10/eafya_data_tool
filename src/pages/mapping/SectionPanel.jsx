import React from "react";

const SectionPanel = ({
  currentSections,
  selectedSection,
  handleSectionClick,
  renderPaginationControls,
  panelHeaderStyle,
  columnHeaderStyle,
  loading,
}) => {
  const renderSectionItem = (
    section
  ) => (
    <div
      key={section.id}
      style={{
        padding: "8px 12px",
        fontSize: "11px",
        borderBottom:
          "1px solid #f1f1f1",
        backgroundColor:
          selectedSection?.id ===
          section.id
            ? "#E8F4F8"
            : "#fafafa",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() =>
        handleSectionClick(
          section.id,
          section.name
        )
      }
    >
      <div
        style={{
          fontWeight: "500",
          color: "#333",
          display: "flex",
          flexDirection:
            "column",
          gap: "2px",
        }}
      >
        <div
          style={{
            color: "#2196f3",
            fontSize: "10px",
          }}
        >
          {section.id}
        </div>
        <div
          style={{
            fontSize: "12px",
          }}
        >
          {section.name}
        </div>
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
        Sections (
        {
          currentSections.length
        }
        )
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
        {loading ? (
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
            Loading
            sections...
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
          </div>
        ) : (
          <div>
            {currentSections.map(
              (section) =>
                renderSectionItem(
                  section
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionPanel;
