import React, { useState, useEffect, useRef } from 'react';
import { getPopularCompanies } from '../../services/interviewExperienceService';
import './SearchAndFilter.css';

const SearchAndFilter = ({ 
  onSearchChange, 
  onCompanyFilter, 
  onSortChange,
  onPageSizeChange,
  currentSort = { sortBy: 'updatedAt', sortDir: 'desc' },
  currentPageSize = 12,
  totalResults = 0,
  isLoading = false,
  isMobile = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyInput, setCompanyInput] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchInputRef = useRef(null);
  const companyInputRef = useRef(null);
  const popularCompanies = getPopularCompanies();

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange]);

  // Filter companies based on input
  const filteredCompanies = popularCompanies.filter(company =>
    company.toLowerCase().includes(companyInput.toLowerCase()) &&
    !selectedCompanies.includes(company)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCompanyInputChange = (e) => {
    setCompanyInput(e.target.value);
    setShowCompanySuggestions(true);
  };

  const handleCompanySelect = (company) => {
    if (!selectedCompanies.includes(company)) {
      const newCompanies = [...selectedCompanies, company];
      setSelectedCompanies(newCompanies);
      onCompanyFilter(newCompanies);
    }
    setCompanyInput('');
    setShowCompanySuggestions(false);
  };

  const handleCompanyRemove = (company) => {
    const newCompanies = selectedCompanies.filter(c => c !== company);
    setSelectedCompanies(newCompanies);
    onCompanyFilter(newCompanies);
  };

  const handleSortChange = (sortBy, sortDir) => {
    onSortChange({ sortBy, sortDir });
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedCompanies([]);
    setCompanyInput('');
    onSearchChange('');
    onCompanyFilter([]);
    onSortChange({ sortBy: 'updatedAt', sortDir: 'desc' });
  };

  const getSortLabel = () => {
    const sortLabels = {
      'updatedAt': 'Last Updated',
      'createdAt': 'Date Posted',
      'title': 'Title',
      'companyTag': 'Company'
    };
    
    const direction = currentSort.sortDir === 'asc' ? '↑' : '↓';
    return `${sortLabels[currentSort.sortBy] || 'Last Updated'} ${direction}`;
  };

  if (isMobile) {
    return (
      <div className="search-filter-mobile">
        {/* Mobile Search Bar */}
        <div className="mobile-search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search interview experiences..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              aria-label="Search interviews"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            )}
          </div>
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            aria-label="Toggle filters"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {showMobileFilters && (
          <div className="mobile-filter-panel">
            <div className="filter-section">
              <h4>Company</h4>
              <div className="company-filter-mobile">
                <input
                  ref={companyInputRef}
                  type="text"
                  placeholder="Add company..."
                  value={companyInput}
                  onChange={handleCompanyInputChange}
                  onFocus={() => setShowCompanySuggestions(true)}
                  className="company-input"
                />
                {showCompanySuggestions && filteredCompanies.length > 0 && (
                  <div className="company-suggestions">
                    {filteredCompanies.slice(0, 6).map(company => (
                      <button
                        key={company}
                        onClick={() => handleCompanySelect(company)}
                        className="company-suggestion"
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedCompanies.length > 0 && (
                <div className="selected-companies">
                  {selectedCompanies.map(company => (
                    <span key={company} className="company-chip">
                      {company}
                      <button 
                        onClick={() => handleCompanyRemove(company)}
                        className="remove-company"
                        aria-label={`Remove ${company}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-section">
              <h4>Sort By</h4>
              <div className="sort-options">
                {[
                  { value: 'updatedAt', label: 'Last Updated' },
                  { value: 'createdAt', label: 'Date Posted' },
                  { value: 'title', label: 'Title' },
                  { value: 'companyTag', label: 'Company' }
                ].map(option => (
                  <div key={option.value} className="sort-option">
                    <button
                      className={`sort-btn ${currentSort.sortBy === option.value ? 'active' : ''}`}
                      onClick={() => handleSortChange(option.value, 'desc')}
                    >
                      {option.label}
                    </button>
                    {currentSort.sortBy === option.value && (
                      <button
                        className="sort-direction"
                        onClick={() => handleSortChange(option.value, currentSort.sortDir === 'desc' ? 'asc' : 'desc')}
                      >
                        {currentSort.sortDir === 'desc' ? '↓' : '↑'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-all-btn" onClick={handleClearAll}>
                Clear All
              </button>
              <button 
                className="apply-filters-btn"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary">
          <span>{totalResults} interviews found</span>
          {(searchTerm || selectedCompanies.length > 0) && (
            <button className="clear-all-link" onClick={handleClearAll}>
              Clear all
            </button>
          )}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="search-filter-container">
      {/* Main Search Bar */}
      <div className="main-search-section">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search interview experiences by title, content, or company..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search interviews"
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          )}
        </div>

        <button 
          className="advanced-filter-toggle"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          aria-label="Toggle advanced filters"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          {/* Company Filter */}
          <div className="filter-group">
            <label className="filter-label">Company</label>
            <div className="company-filter-wrapper">
              <input
                ref={companyInputRef}
                type="text"
                placeholder="Add companies to filter..."
                value={companyInput}
                onChange={handleCompanyInputChange}
                onFocus={() => setShowCompanySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 200)}
                className="company-input"
              />
              {showCompanySuggestions && filteredCompanies.length > 0 && (
                <div className="company-suggestions">
                  {filteredCompanies.slice(0, 8).map(company => (
                    <button
                      key={company}
                      onClick={() => handleCompanySelect(company)}
                      className="company-suggestion"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {selectedCompanies.length > 0 && (
              <div className="selected-companies">
                {selectedCompanies.map(company => (
                  <span key={company} className="company-chip">
                    {company}
                    <button 
                      onClick={() => handleCompanyRemove(company)}
                      className="remove-company"
                      aria-label={`Remove ${company}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sort Controls */}
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <div className="sort-controls">
              <select 
                value={currentSort.sortBy}
                onChange={(e) => handleSortChange(e.target.value, currentSort.sortDir)}
                className="sort-select"
              >
                <option value="updatedAt">Last Updated</option>
                <option value="createdAt">Date Posted</option>
                <option value="title">Title (A-Z)</option>
                <option value="companyTag">Company</option>
              </select>
              <button
                className="sort-direction-btn"
                onClick={() => handleSortChange(currentSort.sortBy, currentSort.sortDir === 'desc' ? 'asc' : 'desc')}
                title={`Sort ${currentSort.sortDir === 'desc' ? 'ascending' : 'descending'}`}
              >
                {currentSort.sortDir === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          {/* Page Size Control */}
          <div className="filter-group">
            <label className="filter-label">Items per page</label>
            <select 
              value={currentPageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      <div className="active-filters-summary">
        <div className="results-count">
          <span className="count">{isLoading ? '...' : totalResults}</span>
          <span className="label">interview experiences found</span>
        </div>
        
        <div className="filter-summary">
          {searchTerm && (
            <span className="active-filter">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedCompanies.length > 0 && (
            <span className="active-filter">
              Companies: {selectedCompanies.join(', ')}
            </span>
          )}
          <span className="active-filter">
            {getSortLabel()}
          </span>
          
          {(searchTerm || selectedCompanies.length > 0) && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;