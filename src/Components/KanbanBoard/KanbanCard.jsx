import React, { useState } from 'react';
import './KanbanCard.css';

const KanbanCard = ({ task, onDragStart, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      1: { color: '#10b981', label: 'Low', icon: '🟢' },
      2: { color: '#3b82f6', label: 'Medium', icon: '🔵' },
      3: { color: '#f59e0b', label: 'High', icon: '🟠' },
      4: { color: '#ef4444', label: 'Critical', icon: '🔴' },
      5: { color: '#a855f7', label: 'Urgent', icon: '🟣' }
    };
    return configs[priority] || { color: '#6b7280', label: 'Normal', icon: '⚪' };
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - now.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffTime < 0) return { text: 'Overdue', status: 'overdue' };
    if (diffHours < 24) return { text: `${diffHours}h left`, status: 'urgent' };
    if (diffDays < 7) return { text: `${diffDays}d left`, status: 'warning' };
    return { text: formatDate(deadline), status: 'normal' };
  };

  const getProgressPercentage = () => {
    // Calculate progress based on task completion status
    if (task.completedAt) return 100;
    if (task.startedAt) return 65;
    return 0;
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      if (window.confirm('Are you sure you want to delete this task?')) {
        onDelete(task.id);
      }
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.drag-handle') || e.target.closest('.card-actions')) {
      return;
    }
    if (onEdit) onEdit(task);
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const timeRemaining = getTimeRemaining(task.deadline);
  const progressPercentage = getProgressPercentage();

  return (
    <div 
      className={`kanban-card ${timeRemaining?.status || ''} ${task.completedAt ? 'completed' : ''}`}
      draggable
      onDragStart={onDragStart}
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      data-priority={task.priority}
    >
      {/* Priority Accent Bar */}
      <div 
        className="priority-accent-bar"
        style={{ backgroundColor: priorityConfig.color }}
      />

      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-top">
          <div className="card-id">#{task.id?.toString().slice(-4) || '0000'}</div>
          <div className="card-actions-trigger">
            <div className={`card-actions ${showActions ? 'visible' : ''}`}>
              <button 
                className="action-btn edit-btn" 
                onClick={handleEdit}
                title="Edit task"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className="action-btn delete-btn" 
                onClick={handleDelete}
                title="Delete task"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <h3 className="card-title">{task.title}</h3>

        {/* Status and Priority Row */}
        <div className="card-meta-row">
          <div className="priority-badge" style={{ backgroundColor: priorityConfig.color }}>
            <span className="priority-icon">{priorityConfig.icon}</span>
            <span className="priority-label">{priorityConfig.label}</span>
          </div>
          
          {task.rewardPoints > 0 && (
            <div className="reward-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
              <span>{task.rewardPoints}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Description */}
      {task.description && (
        <div className="card-description">
          <p>{task.description.length > 120 ? `${task.description.substring(0, 120)}...` : task.description}</p>
        </div>
      )}

      {/* Progress Bar */}
      {progressPercentage > 0 && (
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: task.completedAt ? '#10b981' : '#3b82f6'
              }}
            />
          </div>
          <span className="progress-text">{progressPercentage}%</span>
        </div>
      )}

      {/* Card Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="card-tags">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              {tag.name}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="tag more-tags">
              +{task.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="card-footer">
        <div className="footer-left">
          {task.estimatedHours && (
            <div className="footer-item time-estimate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{task.estimatedHours}h</span>
            </div>
          )}
          
          {timeRemaining && (
            <div className={`footer-item deadline ${timeRemaining.status}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{timeRemaining.text}</span>
            </div>
          )}
        </div>

        <div className="footer-right">
          {/* Assignee Avatar */}
          {task.assigneeUserId && (
            <div className="assignee-container">
              <div 
                className="assignee-avatar"
                title={`Assigned to ${task.assigneeUserId}`}
                style={{ backgroundColor: priorityConfig.color }}
              >
                {task.assigneeUserId.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drag Handle */}
      <div className="drag-handle" title="Drag to move">
        <svg width="12" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="12" r="1" fill="currentColor"/>
          <circle cx="15" cy="12" r="1" fill="currentColor"/>
          <circle cx="9" cy="5" r="1" fill="currentColor"/>
          <circle cx="15" cy="5" r="1" fill="currentColor"/>
          <circle cx="9" cy="19" r="1" fill="currentColor"/>
          <circle cx="15" cy="19" r="1" fill="currentColor"/>
        </svg>
      </div>

      {/* Completion Checkmark */}
      {task.completedAt && (
        <div className="completion-indicator">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m9 11 3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default KanbanCard;