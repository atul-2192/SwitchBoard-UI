import React, { useState, useEffect } from 'react';
import './KanbanBoard.css';
import KanbanCard from './KanbanCard';
import { assignmentService } from '../../services/assignmentService';
import { workspaceService } from '../../services/workspaceService';

const KanbanBoard = ({ workspaceId, assignmentId, filters, refreshTrigger, onEditTask, onDeleteTask }) => {
  const [tasks, setTasks] = useState({
    backlog: [],
    ongoing: [],
    completed: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [expandedColumns, setExpandedColumns] = useState({
    backlog: true,
    ongoing: true,
    completed: false // Start with completed collapsed on mobile
  });

  // Load tasks from backend
  useEffect(() => {
    const loadTasks = async () => {
      if (!assignmentId) {

        setTasks({
          backlog: [],
          ongoing: [],
          completed: []
        });
        setIsLoading(false);
        return;
      }
      

      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch tasks from backend by assignment ID
        const backendTasks = await assignmentService.getTasksByAssignment(assignmentId);
        
        // Group tasks by status (BACKLOG, ONGOING, COMPLETED)
        const groupedTasks = {
          backlog: backendTasks.filter(task => 
            !task.statusKey || task.statusKey === 'BACKLOG'
          ),
          ongoing: backendTasks.filter(task => task.statusKey === 'ONGOING'),
          completed: backendTasks.filter(task => task.statusKey === 'COMPLETED')
        };
        
        setTasks(groupedTasks);
      } catch (error) {
        setError(error.message || 'Failed to load tasks');
        
        // Clear tasks on error - no fallback data
        setTasks({
          backlog: [],
          ongoing: [],
          completed: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [assignmentId, refreshTrigger]);  const handleDragStart = (e, task, sourceColumn) => {
    setDraggedTask({ ...task, sourceColumn });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.sourceColumn === targetColumn) {
      setDraggedTask(null);
      return;
    }

    // Update task status based on target column
    const statusMap = {
      'backlog': 'BACKLOG',
      'ongoing': 'ONGOING', 
      'completed': 'COMPLETED'
    };

    const newStatus = statusMap[targetColumn];


    const updatedTask = {
      ...draggedTask,
      status: newStatus, // Keep this for compatibility
      statusKey: newStatus, // Add this to match backend schema
      ...(targetColumn === 'ongoing' && !draggedTask.startedAt ? 
          { startedAt: new Date().toISOString() } : {}),
      ...(targetColumn === 'completed' ? 
          { completedAt: new Date().toISOString() } : {})
    };



    // Optimistically update UI
    setTasks(prev => ({
      ...prev,
      [draggedTask.sourceColumn]: prev[draggedTask.sourceColumn].filter(
        task => task.id !== draggedTask.id
      ),
      [targetColumn]: [...prev[targetColumn], updatedTask]
    }));

    const originalTasks = tasks; // Store original state for rollback
    setDraggedTask(null);

    // Update task status in backend
    try {
      const backendResponse = await workspaceService.updateTaskStatus(draggedTask.id, newStatus);
    } catch (error) {
      // Show error feedback to user
      alert(`Failed to move task "${draggedTask.title}". The change will be reverted.`);
      
      // Revert the UI change on error
      setTasks(originalTasks);
      
      // Optionally, you could show a toast notification instead of alert
      // showErrorToast(`Failed to update task: ${error.message}`);
    }
  };

  const getColumnIcon = (column) => {
    switch (column) {
      case 'backlog': return '📋';
      case 'ongoing': return '⚡';
      case 'completed': return '✅';
      default: return '📄';
    }
  };

  const getColumnColor = (column) => {
    switch (column) {
      case 'backlog': return '#FF9800';
      case 'ongoing': return '#2196F3';
      case 'completed': return '#4CAF50';
      default: return '#6B7C93';
    }
  };

  const toggleColumn = (columnKey) => {
    setExpandedColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Filter and sort tasks based on filters
  const filterTasks = (taskList) => {
    if (!filters) return taskList;

    let filtered = [...taskList];

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => 
        filters.status.includes(task.statusKey?.toUpperCase() || 'BACKLOG')
      );
    }

    // Apply priority filter
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => 
        filters.priority.includes(task.priority?.toString())
      );
    }

    // Apply search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // NOTE: Workspace and assignment filters are NOT applied here
    // because tasks are already filtered by assignmentId when fetched from backend
    // The API endpoint GET /assignments/{id}/tasks only returns tasks for that assignment
    // So applying these filters would incorrectly filter out all tasks!

    // Sort tasks
    if (filters.sort) {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch (filters.sort) {
          case 'title':
            aVal = a.title || '';
            bVal = b.title || '';
            break;
          case 'priority':
            aVal = a.priority || 0;
            bVal = b.priority || 0;
            break;
          case 'deadline':
            aVal = new Date(a.deadline || '9999-12-31');
            bVal = new Date(b.deadline || '9999-12-31');
            break;
          case 'createdAt':
            aVal = new Date(a.createdAt || '1970-01-01');
            bVal = new Date(b.createdAt || '1970-01-01');
            break;
          case 'updatedAt':
          default:
            aVal = new Date(a.updatedAt || '1970-01-01');
            bVal = new Date(b.updatedAt || '1970-01-01');
            break;
        }

        if (typeof aVal === 'string') {
          return filters.order === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return filters.order === 'asc' 
            ? aVal - bVal
            : bVal - aVal;
        }
      });
    }

    return filtered;
  };

  // Apply filters to each column
  const filteredTasks = {
    backlog: filterTasks(tasks.backlog),
    ongoing: filterTasks(tasks.ongoing),
    completed: filterTasks(tasks.completed)
  };

  if (isLoading) {
    return (
      <div className="kanban-loading">
        <div className="loading-spinner"></div>
        <p>Loading your workspace stories...</p>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      {error && (
        <div className="kanban-error demo-mode">
          <span className="error-icon">💡</span>
          <span>{error}</span>
          <small style={{ marginLeft: '8px', opacity: 0.7 }}>
            Start your backend server to connect to real data.
          </small>
        </div>
      )}
      
      {filters?.assignment && (
        <div className="active-filters">
          <span className="filter-icon">🔍</span>
          <span>Showing tasks for selected assessment</span>
          <button 
            className="clear-filter" 
            onClick={() => {
              // We would need a callback to clear filters
              // For now, just show the indicator
            }}
            title="Clear assessment filter"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="kanban-columns">
        {Object.entries(filteredTasks).map(([columnKey, columnTasks]) => (
          <div 
            key={columnKey}
            className={`kanban-column ${columnKey}-column ${!expandedColumns[columnKey] ? 'collapsed' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnKey)}
          >
            <div className="column-header" onClick={() => toggleColumn(columnKey)}>
              <div className="column-title">
                <span 
                  className="column-icon"
                  style={{ color: getColumnColor(columnKey) }}
                >
                  {getColumnIcon(columnKey)}
                </span>
                <h3>{columnKey.charAt(0).toUpperCase() + columnKey.slice(1)}</h3>
                <div className="column-count">
                  {columnTasks.length}
                  {tasks[columnKey].length !== columnTasks.length && (
                    <span className="filtered-count">/{tasks[columnKey].length}</span>
                  )}
                </div>
              </div>
              <button className="column-toggle">
                <span className={`toggle-icon ${expandedColumns[columnKey] ? 'expanded' : 'collapsed'}`}>
                  ▼
                </span>
              </button>
            </div>
            
            <div className={`column-content ${expandedColumns[columnKey] ? 'expanded' : 'collapsed'}`}>
              {columnTasks.length === 0 ? (
                <div className="empty-column">
                  <div className="empty-icon">📭</div>
                  <p>No stories in {columnKey}</p>
                  <span>Drag stories here to get started</span>
                </div>
              ) : (
                <div className="task-list">
                  {columnTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      onDragStart={(e) => handleDragStart(e, task, columnKey)}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;