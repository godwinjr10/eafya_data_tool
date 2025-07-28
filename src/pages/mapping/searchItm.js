import React, { useState, useEffect, useRef } from 'react';

const SearchDropdown = ({
  data = [],
  onSelect = () => {},
  placeholder = "Search...",
  searchKeys = ['title'],
  displayKey = 'title',
  subtitleKey = null,
  maxResults = 10,
  minSearchLength = 1,
  emptyMessage = "No results found",
  loadingMessage = "Searching...",
  isLoading = false,
  size = 'md',
  disabled = false,
  clearOnSelect = false,
  showIcon = true,
  iconPosition = 'right',
  className = '',
  dropdownClassName = '',
  itemClassName = '',
  id = 'search-dropdown',
  'aria-label': ariaLabel = 'Search dropdown'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Size classes
  const sizeClasses = {
    sm: 'form-control-sm',
    md: '',
    lg: 'form-control-lg'
  };

  // Search function
  const performSearch = (value) => {
    if (value.length < minSearchLength) {
      setSearchResults([]);
      return;
    }

    const filtered = data.filter(item => {
      return searchKeys.some(key => {
        const fieldValue = getNestedValue(item, key);
        return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
      });
    }).slice(0, maxResults);

    setSearchResults(filtered);
  };

  // Get nested object value by key path (e.g., 'user.name')
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchTerm(value);
    setHighlightedIndex(-1);
    
    if (value.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    performSearch(value);
    setShowDropdown(true);
  };

  // Handle result selection
  const handleResultClick = (item, index) => {
    onSelect(item, index);
    
    if (clearOnSelect) {
      setSearchTerm('');
    } else {
      setSearchTerm(getNestedValue(item, displayKey) || '');
    }
    
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
          handleResultClick(searchResults[highlightedIndex], highlightedIndex);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchTerm.trim() !== '' && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle input blur
  const handleInputBlur = (e) => {
    // Don't hide if clicking on dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      return;
    }
    setTimeout(() => {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Highlight matching text
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-warning bg-opacity-25 text-dark p-0">
          {part}
        </mark>
      ) : part
    );
  };

  const SearchIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
  );

  const ClearIcon = () => (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  );

  return (
    <div className={`position-relative mb-2 ${className}`} style={{ maxWidth: '100%' }}>
      <div className="input-group">
        {showIcon && iconPosition === 'left' && (
          <span className="input-group-text bg-white border-end-0">
            <SearchIcon />
          </span>
        )}
        
        <input
          ref={inputRef}
          id={id}
          type="text"
          className={`form-control ${sizeClasses[size]} ${showIcon && iconPosition === 'left' ? 'border-start-0' : ''} ${showIcon && iconPosition === 'right' ? 'border-end-0' : ''}`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {searchTerm && (
          <button
            type="button"
            className="btn btn-outline-secondary border-start-0 border-end-0 px-2"
            onClick={clearSearch}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <ClearIcon />
          </button>
        )}

        {showIcon && iconPosition === 'right' && (
          <span className="input-group-text bg-white border-start-0">
            {isLoading ? (
              <div className="spinner-border spinner-border-sm text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <SearchIcon />
            )}
          </span>
        )}
      </div>

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className={`dropdown-menu show w-100 mt-1 shadow border-0 ${dropdownClassName}`}
          style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
          }}
          role="listbox"
          aria-label="Search results"
        >
          {isLoading ? (
            <div className="dropdown-item-text text-center py-3 text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              {loadingMessage}
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <h6 className="dropdown-header text-uppercase fw-semibold text-muted small">
                {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
              </h6>
              {searchResults.map((item, index) => {
                const displayText = getNestedValue(item, displayKey) || '';
                const subtitleText = subtitleKey ? getNestedValue(item, subtitleKey) : null;
                
                return (
                  <button
                    key={item.id || index}
                    className={`dropdown-item d-flex justify-content-between align-items-center py-2 ${
                      highlightedIndex === index ? 'active' : ''
                    } ${itemClassName}`}
                    onClick={() => handleResultClick(item, index)}
                    role="option"
                    aria-selected={highlightedIndex === index}
                  >
                    <div className="flex-grow-1">
                      <div className="fw-medium text-start">
                        {highlightMatch(displayText, searchTerm)}
                      </div>
                      {subtitleText && (
                        <small className="text-muted d-block text-start">
                          {subtitleText}
                        </small>
                      )}
                    </div>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="dropdown-item-text text-center py-3 text-muted">
              <div className="mb-1">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="opacity-50">
                  <path d="M6.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                </svg>
              </div>
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;