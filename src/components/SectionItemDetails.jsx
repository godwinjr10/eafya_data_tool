import React, { useEffect, useState } from "react";

export const SectionItemDetails = ({
  item,
  handleSectionItemClick,
  fetchItemsCount,
  selectedSectionItem,
}) => {
  // Use mapping_count directly from the item data
  const count = item.mapping_count || 0;

  return (
    <div
      key={item.id}
      style={{
        padding: "8px 12px",
        fontSize: "11px",
        borderBottom: "1px solid #f1f1f1",
        backgroundColor: selectedSectionItem?.id === item.id ? "#E8F4F8" : "",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => handleSectionItemClick(item)}
    >
      <div
        className="flex items-center justify-between w-full"
        style={{
          fontWeight: "500",
          color: "#333",
        }}
      >
        <span>
          📄({item.code}) {item.name}
          {item.dhis2_name && (
            <div className="text-xs text-secondary mt-1">
              ↳ {item.dhis2_name}
            </div>
          )}
        </span>
        <span
          className={`text-decoration-none ${
            count === 0 ? "text-danger" : "text-success"
          }`}
        >
          {count !== null ? `(${count})` : "(...)"}
        </span>
      </div>
    </div>
  );
};
