import React, {
  useEffect,
  useState,
} from "react";

export const SectionItemDetails =
  ({
    item,
    handleSectionItemClick,
    fetchItemsCount,
    selectedSectionItem,
  }) => {
    const [count, setCount] =
      useState(null);

    useEffect(() => {
      let mounted = true;
      fetchItemsCount(item.id)
        .then((response) => {
          if (mounted) {
            // Extract the count number from the response object
            const countValue =
              response &&
              response.count !==
                undefined
                ? response.count
                : 0;
            setCount(
              countValue
            );
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching count:",
            error
          );
          if (mounted) {
            setCount(0);
          }
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
          backgroundColor:
            selectedSectionItem?.id ===
            item.id
              ? "#E8F4F8"
              : "#fafafa",
          cursor: "pointer",
          position:
            "relative",
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
          <span>
            📄(
            {
              item.hmis_code
            }){" "}
            {item.hmis_name}{" "}
          </span>
          <span
            className={`text-decoration-none ${
              count === 0
                ? "text-danger"
                : "text-success"
            }`}
          >
            {count !== null
              ? `(${count})`
              : "(...)"}
          </span>
        </div>
      </div>
    );
  };
