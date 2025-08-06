import React from "react";

const CategoryPanel = ({
  categories,
  selectedType,
  loading,
  handleCategoryClick,
  resetSelections,
  renderPaginationControls,
  panelHeaderStyle,
  columnHeaderStyle,
}) => {
  // Render category item
  const renderCategoryItem = (
    category
  ) => (
    <div
      key={category}
      onClick={() =>
        handleCategoryClick(
          category
        )
      }
      style={{
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: "12px",
        backgroundColor:
          selectedType ===
          category
            ? "#e3f2fd"
            : "transparent",
        borderLeft:
          selectedType ===
          category
            ? "3px solid #2196f3"
            : "3px solid transparent",
        borderBottom:
          "1px solid #f1f1f1",
        transition:
          "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (
          selectedType !==
          category
        ) {
          e.target.style.backgroundColor =
            "#f8f9fa";
        }
      }}
      onMouseLeave={(e) => {
        if (
          selectedType !==
          category
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
          textTransform:
            "capitalize",
        }}
      >
        ➡️ {category}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "280px",
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
        Categories
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
            }}
          >
            <div
              style={{
                fontSize:
                  "12px",
                color: "#666",
              }}
            >
              Loading
              categories...
            </div>
          </div>
        ) : (
          categories.map(
            (category) =>
              renderCategoryItem(
                category
              )
          )
        )}
      </div>
    </div>
  );
};

export default CategoryPanel;
