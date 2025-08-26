import React, { useState, useMemo } from 'react';

const MappingTable = ({
  data = [],
  columns = [],
  pageSize = 10,
  searchable = true,
  sortable = true,
  className = '',
  onRowClick = null,
  emptyMessage = 'No data available',
  loading = false,
  striped = true,
  hover = true,
  bordered = false,
  size = 'md' // sm, md, lg
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    return data.filter(item =>
      columns.some(column => {
        const value = column.accessor ? item[column.accessor] : '';
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
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
  const startItem = sortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key: columnKey,
      direction: prevConfig.key === columnKey && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
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
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
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
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
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
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }

    // Next button
    buttons.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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
    return item[column.accessor] || '-';
  };

  const getSortIcon = (columnKey) => {
    if (!sortable || sortConfig.key !== columnKey) {
      return <span className="text-muted ms-1">↕</span>;
    }
    return sortConfig.direction === 'asc' ? 
      <span className="text-primary ms-1">↑</span> : 
      <span className="text-primary ms-1">↓</span>;
  };

  const tableClasses = [
    'table',
    striped && 'table-striped',
    hover && 'table-hover',
    bordered && 'table-bordered',
    size === 'md' && 'table-md',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="card bg-white p-4">
      {/* Header Controls */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          {searchable && (
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
        <div className="col-md-6 text-end">
          <div className="d-flex justify-content-end align-items-center gap-3">
            <div className="d-flex align-items-center">
              <label className="form-label me-2 mb-0">Show:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <small className="text-muted">
              Showing {startItem} to {endItem} of {sortedData.length} entries
              {searchTerm && ` (filtered from ${data.length} total entries)`}
            </small>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="container">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <table className={tableClasses}>
            <thead className="table-primary">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key || column.accessor}
                    style={{
                      width: column.width,
                      cursor: sortable && column.sortable !== false ? 'pointer' : 'default',
                      userSelect: 'none'
                    }}
                    onClick={() => column.sortable !== false && handleSort(column.accessor)}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{column.header}</span>
                      {sortable && column.sortable !== false && getSortIcon(column.accessor)}
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
                      cursor: onRowClick ? 'pointer' : 'default'
                    }}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={onRowClick ? 'table-row-hover' : ''}
                  >
                    {columns.map((column) => (
                      <td key={column.key || column.accessor}>
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-muted">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="row align-items-center mt-3">
          <div className="col-md-6">
            <small className="text-muted">
              Page {currentPage} of {totalPages}
            </small>
          </div>
          <div className="col-md-6">
            <nav aria-label="Table pagination">
              <ul className="pagination pagination-sm justify-content-end mb-0">
                {renderPaginationButtons()}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* <style jsx>{`
        .table-row-hover:hover {
          background-color: rgba(0, 123, 255, 0.1) !important;
        }
        .page-link {
          border: 1px solid #dee2e6;
        }
        .page-item.active .page-link {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
        .table th {
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .data-table-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          padding: 1.5rem;
        }
      `}</style> */}
    </div>
  );
};
export default MappingTable
