import React, {
  useEffect,
  useState,
} from "react";

export const SectionItemDetails =
  ({
    item,
    handleSectionItemClick,
    fetchItemsCount,
    selectedSectionItem
  }) => {
    const [count, setCount] =
      useState(null);

    useEffect(() => {
      let mounted = true;
      fetchItemsCount(
        item.id
      ).then((c) => {
        if (mounted)
          setCount(c);
      });
      return () => {
        mounted = false;
      };
    }, [
      item.id,
      fetchItemsCount,
    ]);

    return (
      <div
        key={item.id}
        style={{
          padding: "8px 12px",
          fontSize: "11px",
          borderBottom:
            "1px solid #f1f1f1",
          backgroundColor: selectedSectionItem?.id === item.id ? "#E8F4F8" :
            "#fafafa",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() =>
          handleSectionItemClick(
            item
          )
        }
      >
        <div
         className="flex items-center justify-between w-full"
          style={{
            fontWeight: "500",
            color: "#333",
          }}
        >
          <a>
          📄({item.hmis_code}) {item.hmis_name}{" "}
          </a>
         <a className={`text-decoration-none  ${count == 0 ? "text-danger" : "text-success"}`}> {count !== null
            ? `(${count})`
            : ""}</a>
        </div>
      </div>
    );
  };
