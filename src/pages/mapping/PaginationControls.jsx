import React from "react";

const PaginationControls = ({
  paginationButtonStyle,
  resetSelections,
}) => (
  <div
    style={{
      backgroundColor:
        "#f8f9fa",
      padding: "4px 8px",
      borderBottom:
        "1px solid #ddd",
      fontSize: "10px",
      display: "flex",
      justifyContent:
        "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <button
        style={
          paginationButtonStyle
        }
      >
        ⟨⟨
      </button>
      <button
        style={
          paginationButtonStyle
        }
      >
        ⟨
      </button>
      <span
        style={{
          margin: "0 4px",
        }}
      >
        Page 1 of 1
      </span>
      <button
        style={
          paginationButtonStyle
        }
      >
        ⟩
      </button>
      <button
        style={
          paginationButtonStyle
        }
      >
        ⟩⟩
      </button>
    </div>
    <div>
      <button
        style={
          paginationButtonStyle
        }
      >
        📄
      </button>
      <button
        onClick={
          resetSelections
        }
        style={
          paginationButtonStyle
        }
      >
        🔄
      </button>
    </div>
  </div>
);

export default PaginationControls;
