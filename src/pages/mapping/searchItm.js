import React, {
  useState,
  useEffect,
  useRef,
} from "react";

const SearchDropdown = ({
  items = [],
  onSelect,
  loading = false,
  onSearch,
  displayKey = "name",
  searchKeys = ["name"],
  minSearchLength = 2,
  placeholder = "Search items...",
}) => {
  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");
  const [isOpen, setIsOpen] =
    useState(false);
  const [
    filteredItems,
    setFilteredItems,
  ] = useState([]);
  const dropdownRef =
    useRef(null);

  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {
          setIsOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (
      searchTerm.length >=
      minSearchLength
    ) {
      // Filter items locally based on search term
      const filtered =
        items.filter(
          (item) => {
            return searchKeys.some(
              (key) => {
                const value =
                  item[key];
                return (
                  value &&
                  value
                    .toString()
                    .toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    )
                );
              }
            );
          }
        );
      setFilteredItems(
        filtered.slice(0, 50)
      ); // Limit to 50 results for performance
      setIsOpen(true);
    } else {
      setFilteredItems([]);
      setIsOpen(false);
    }
  }, [
    searchTerm,
    items,
    searchKeys,
    minSearchLength,
  ]);

  const handleInputChange = (
    e
  ) => {
    const value =
      e.target.value;
    setSearchTerm(value);

    // Also trigger the parent's search function for API calls
    if (
      onSearch &&
      value.length >=
        minSearchLength
    ) {
      onSearch(value);
    }
  };

  const handleSelect = (
    item
  ) => {
    if (onSelect) {
      onSelect(item);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          position:
            "relative",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={
            handleInputChange
          }
          placeholder={
            placeholder
          }
          style={{
            width: "100%",
            padding:
              "8px 32px 8px 12px",
            border:
              "1px solid #ddd",
            borderRadius:
              "4px",
            fontSize: "14px",
            outline: "none",
            boxSizing:
              "border-box",
          }}
          onFocus={() => {
            if (
              searchTerm.length >=
                minSearchLength &&
              filteredItems.length >
                0
            ) {
              setIsOpen(true);
            }
          }}
        />

        {/* Search icon */}
        <div
          style={{
            position:
              "absolute",
            right: "8px",
            top: "50%",
            transform:
              "translateY(-50%)",
            pointerEvents:
              searchTerm
                ? "auto"
                : "none",
            cursor: searchTerm
              ? "pointer"
              : "default",
          }}
        >
          {searchTerm ? (
            <span
              onClick={
                clearSearch
              }
              style={{
                fontSize:
                  "16px",
                color: "#666",
                cursor:
                  "pointer",
                userSelect:
                  "none",
              }}
            >
              ×
            </span>
          ) : (
            <span
              style={{
                fontSize:
                  "14px",
                color: "#999",
              }}
            >
              🔍
            </span>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position:
              "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor:
              "white",
            border:
              "1px solid #ddd",
            borderTop: "none",
            borderRadius:
              "0 0 4px 4px",
            maxHeight:
              "300px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {loading ? (
            <div
              style={{
                padding:
                  "12px",
                textAlign:
                  "center",
                color: "#666",
                fontSize:
                  "12px",
              }}
            >
              Loading...
            </div>
          ) : filteredItems.length ===
            0 ? (
            <div
              style={{
                padding:
                  "12px",
                textAlign:
                  "center",
                color: "#666",
                fontSize:
                  "12px",
              }}
            >
              {searchTerm.length <
              minSearchLength
                ? `Type at least ${minSearchLength} characters to search`
                : "No results found"}
            </div>
          ) : (
            filteredItems.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item.id ||
                    index
                  }
                  onClick={() =>
                    handleSelect(
                      item
                    )
                  }
                  style={{
                    padding:
                      "8px 12px",
                    cursor:
                      "pointer",
                    borderBottom:
                      index <
                      filteredItems.length -
                        1
                        ? "1px solid #f1f1f1"
                        : "none",
                    fontSize:
                      "13px",
                    backgroundColor:
                      "transparent",
                  }}
                  onMouseEnter={(
                    e
                  ) => {
                    e.target.style.backgroundColor =
                      "#f8f9fa";
                  }}
                  onMouseLeave={(
                    e
                  ) => {
                    e.target.style.backgroundColor =
                      "transparent";
                  }}
                >
                  <div
                    style={{
                      fontWeight:
                        "500",
                    }}
                  >
                    {
                      item[
                        displayKey
                      ]
                    }
                  </div>
                  {item.id && (
                    <div
                      style={{
                        fontSize:
                          "11px",
                        color:
                          "#666",
                        marginTop:
                          "2px",
                      }}
                    >
                      ID:{" "}
                      {
                        item.id
                      }
                    </div>
                  )}
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
