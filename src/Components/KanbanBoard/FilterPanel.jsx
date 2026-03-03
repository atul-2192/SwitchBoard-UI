import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, availableWorkspaces = [], availableAssignments = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Quick filter presets
  const quickFilters = [
    { id: 'my-tasks', label: 'My Tasks', icon: '👤' },
    { id: 'overdue', label: 'Overdue', icon: '⚠️' },
    { id: 'high-priority', label: 'High Priority', icon: '🔥' },
  ];

  const priorityOptions = [
    { value: '1', label: 'Low', color: '#4CAF50' },
    { value: '2', label: 'Medium', color: '#FF9800' },
    { value: '3', label: 'High', color: '#F44336' },
    { value: '4', label: 'Critical', color: '#9C27B0' },
    { value: '5', label: 'Urgent', color: '#E91E63' }
  ];

  const statusOptions = [
    { value: 'BACKLOG', label: 'Backlog', color: '#FF9800' },
    { value: 'TODO', label: 'To Do', color: '#6B7C93' },
    { value: 'ONGOING', label: 'In Progress', color: '#2196F3' },
    { value: 'COMPLETED', label: 'Completed', color: '#4CAF50' }
  ];

  const sortOptions = [
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' }
  ];

  useEffect(() => {
    if (filters) {
      const count = Object.values(filters).filter(value => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== '' && value !== 'all' && value !== 'updatedAt' && value !== 'desc';
      }).length;
      setActiveFiltersCount(count);
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ [key]: value });
    }
  };

  const handleQuickFilter = (quickFilter) => {
    // Handle quick filter logic here
    if (quickFilter.id === 'high-priority') {
      handleFilterChange('priority', ['4', '5']);
    } else if (quickFilter.id === 'overdue') {
      // Handle overdue logic
    }
  };

  const resetFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        workspace: '',
        assignment: '',
        status: [],
        priority: [],
        search: '',
        sort: 'updatedAt',
        order: 'desc'
      });
    }
  };

  const handleStatusToggle = (statusValue) => {
    const currentStatus = filters?.status || [];
    const newStatus = currentStatus.includes(statusValue)
      ? currentStatus.filter(s => s !== statusValue)
      : [...currentStatus, statusValue];
    handleFilterChange('status', newStatus);
  };

  const handlePriorityToggle = (priorityValue) => {
    const currentPriority = filters?.priority || [];
    const newPriority = currentPriority.includes(priorityValue)
      ? currentPriority.filter(p => p !== priorityValue)
      : [...currentPriority, priorityValue];
    handleFilterChange('priority', newPriority);
  };

  return (
    <div className="filter-panel">
      {/* Quick Filters Strip */}
      <div className="quick-filters">
        <div className="quick-filters-left">
          <div className="filter-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
            <span className="filter-icon">⚙️</span>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
            <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>

          <div className="quick-filter-chips">
            {quickFilters.map(filter => (
              <button
                key={filter.id}
                className="quick-filter-chip"
                onClick={() => handleQuickFilter(filter)}
              >
                <span className="chip-icon">{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quick-filters-right">
          <div className="sort-control">
            <select
              value={filters?.sort || 'updatedAt'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className={`sort-order-btn ${filters?.order === 'asc' ? 'asc' : 'desc'}`}
              onClick={() => handleFilterChange('order', filters?.order === 'asc' ? 'desc' : 'asc')}
            >
              {filters?.order === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button className="clear-filters-btn" onClick={resetFilters}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className={`advanced-filters ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-grid">
          {/* Workspace Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🏢</span>
              Workspace
            </label>
            <select
              value={filters?.workspace || ''}
              onChange={(e) => handleFilterChange('workspace', e.target.value)}
              className="filter-select"
            >
              <option value="">All Workspaces</option>
              {availableWorkspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📋</span>
              Assignment
            </label>
            <select
              value={filters?.assignment || ''}
              onChange={(e) => handleFilterChange('assignment', e.target.value)}
              className="filter-select"
            >
              <option value="">All Assignments</option>
              {availableAssignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📊</span>
              Status
            </label>
            <div className="status-filter-options">
              {statusOptions.map(status => (
                <button
                  key={status.value}
                  className={`status-option ${(filters?.status || []).includes(status.value) ? 'active' : ''}`}
                  onClick={() => handleStatusToggle(status.value)}
                  style={{ '--status-color': status.color }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🎯</span>
              Priority
            </label>
            <div className="priority-filter-options">
              {priorityOptions.map(priority => (
                <button
                  key={priority.value}
                  className={`priority-option ${(filters?.priority || []).includes(priority.value) ? 'active' : ''}`}
                  onClick={() => handlePriorityToggle(priority.value)}
                  style={{ '--priority-color': priority.color }}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;