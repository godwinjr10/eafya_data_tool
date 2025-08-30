import React, { useState, useMemo, useEffect, useRef } from "react";

const MappingTable = ({
  data = [],
  columns = [],
  pageSize = 10,
  searchable = true,
  sortable = true,
  className = "",
  onRowClick = null,
  emptyMessage = "No data available",
  loading = false,
  striped = true,
  hover = true,
  bordered = false,
  size = "md", // sm, md, lg
  filterable = true,
  sectionFilter = true, // New prop for section filtering
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [selectedSection, setSelectedSection] = useState("");

  // Get unique sections from data
  const uniqueSections = useMemo(() => {
    const sections = [
      ...new Set(
        data.map((item) => item.section_name || item.section_id).filter(Boolean)
      ),
    ];
    return sections.sort();
  }, [data]);

  // Filter data based on search term and section filter
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply section filter
    if (selectedSection && sectionFilter) {
      filtered = filtered.filter((item) => {
        const sectionValue = item.section_name || item.section_id;
        return sectionValue === selectedSection;
      });
    }

    // Apply global search
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          const value = column.accessor ? item[column.accessor] : "";
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    return filtered;
  }, [data, searchTerm, selectedSection, sectionFilter, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startItem =
    sortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

  const handleSort = (columnKey) => {
    if (!sortable) return;

    setSortConfig((prevConfig) => ({
      key: columnKey,
      direction:
        prevConfig.key === columnKey && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedSection("");
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <li
        key="prev"
        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <li key="1" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        buttons.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      buttons.push(
        <li key={totalPages} className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    // Next button
    buttons.push(
      <li
        key="next"
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    );

    return buttons;
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item, item[column.accessor]);
    }
    return item[column.accessor] || "-";
  };

  const getSortIcon = (columnKey) => {
    if (!sortable || sortConfig.key !== columnKey) {
      return <span className="text-muted ms-1">↕</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className="text-primary ms-1">↑</span>
    ) : (
      <span className="text-primary ms-1">↓</span>
    );
  };

  const tableClasses = ["table", className].filter(Boolean).join(" ");

  return (
    <div className="card border-0 shadow-sm p-3">
      {/* Header Controls */}
      <div className="card-header border-0 bg-light bg-opacity-0  mb-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            {searchable && (
              <div className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search across all data..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                {filterable && sectionFilter && uniqueSections.length > 0 && (
                  <select
                    className="form-select"
                    value={selectedSection}
                    onChange={(e) => handleSectionChange(e.target.value)}
                    style={{ minWidth: "150px" }}
                  >
                    <option value="">All Sections</option>
                    {uniqueSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
          <div className="col-md-6 text-end">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <div className="d-flex align-items-center gap-2">
                <label className="form-label mb-0 small">Show:</label>
                <select
                  className="form-select form-select-sm"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{ width: "auto" }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              {(searchTerm || selectedSection) && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={clearAllFilters}
                  title="Clear all filters"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key || column.accessor}
                      className="fw-semibold text-uppercase small"
                      style={{
                        width: column.width,
                        cursor:
                          sortable && column.sortable !== false
                            ? "pointer"
                            : "default",
                        userSelect: "none",
                      }}
                      onClick={() =>
                        column.sortable !== false && handleSort(column.accessor)
                      }
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{column.header}</span>
                        {sortable &&
                          column.sortable !== false &&
                          getSortIcon(column.accessor)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id || index}
                      style={{
                        cursor: onRowClick ? "pointer" : "default",
                      }}
                      onClick={() => onRowClick && onRowClick(item)}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key || column.accessor}
                          className="align-middle"
                        >
                          {renderCell(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-4 text-muted"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="card-footer border-0 bg-light bg-opacity-0 ">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Showing {startItem} to {endItem} of {sortedData.length} entries
              {(searchTerm || selectedSection) &&
                ` (filtered from ${data.length} total entries)`}
            </div>
            <nav aria-label="Table pagination">
              <ul className="pagination pagination-sm mb-0">
                {renderPaginationButtons()}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
export default MappingTable;
