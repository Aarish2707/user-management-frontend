import React, { useState, useCallback } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search...", loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          disabled={loading}
        />
        {searchTerm && (
          <button 
            className="search-clear-btn" 
            onClick={handleClear}
            disabled={loading}
          >
            ×
          </button>
        )}
        <div className="search-icon">
          🔍
        </div>
      </div>
    </div>
  );
};

export default SearchBar;