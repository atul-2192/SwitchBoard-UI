import React, { useState, useEffect } from 'react';
import './EditTaskModal.css';
import { workspaceService } from '../../services/workspaceService';

const EditTaskModal = ({ isOpen, task, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
    estimatedHours: '',
    rewardPoints: '',
    deadline: '',
    tags: '',
    status: 'BACKLOG'
  });
  const [formErrors, setFormErrors] = useState({});

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 2,
        estimatedHours: task.estimatedHours || '',
        rewardPoints: task.rewardPoints || '',
        deadline: task.deadline ? task.deadline.slice(0, 16) : '', // Format for datetime-local
        tags: task.tags ? task.tags.map(tag => tag.name || tag).join(', ') : '',
        status: task.status || 'BACKLOG'
      });
      setError('');
      setFormErrors({});
    }
  }, [task]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setFormErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Task title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      errors.title = 'Task title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    if (formData.estimatedHours) {
      const hours = parseFloat(formData.estimatedHours);
      if (isNaN(hours) || hours <= 0 || hours > 1000) {
        errors.estimatedHours = 'Please enter a valid number of hours (1-1000)';
      }
    }

    if (formData.rewardPoints) {
      const points = parseInt(formData.rewardPoints);
      if (isNaN(points) || points < 0 || points > 10000) {
        errors.rewardPoints = 'Please enter valid reward points (0-10000)';
      }
    }

    if (formData.deadline) {
      const deadline = new Date(formData.deadline);
      const now = new Date();
      // Allow past deadlines for existing tasks
      if (!task && deadline <= now) {
        errors.deadline = 'Deadline must be in the future';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear related error
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
        rewardPoints: formData.rewardPoints ? parseInt(formData.rewardPoints) : null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => ({ name: tag.trim() })) : [],
        status: formData.status,
        updatedAt: new Date().toISOString()
      };

      await workspaceService.updateTask(task.id, updateData);
      onSuccess();
      onClose();
    } catch (error) {
      if (error.message.includes('fetch')) {
        setError('Demo Mode: Backend API not available. In a real application, this task would be updated.');
      } else {
        setError(error.message || 'Failed to update task');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusUpdate = async (newStatus) => {
    setLoading(true);
    setError('');

    try {
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'ONGOING' && !task.startedAt ? { startedAt: new Date().toISOString() } : {}),
        ...(newStatus === 'COMPLETED' ? { completedAt: new Date().toISOString() } : {})
      };

      await workspaceService.updateTask(task.id, updateData);
      onSuccess();
      onClose();
    } catch (error) {
      if (error.message.includes('fetch')) {
        setError('Demo Mode: Backend API not available. In a real application, this task status would be updated.');
      } else {
        setError(error.message || 'Failed to update task status');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return '#4CAF50';
      case 2: return '#2196F3';
      case 3: return '#FF9800';
      case 4: return '#F44336';
      case 5: return '#9C27B0';
      default: return '#6B7C93';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Critical';
      case 5: return 'Urgent';
      default: return 'Normal';
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'BACKLOG': return { color: '#FF9800', icon: '📋', label: 'Backlog' };
      case 'ONGOING': return { color: '#2196F3', icon: '⚡', label: 'In Progress' };
      case 'COMPLETED': return { color: '#4CAF50', icon: '✅', label: 'Completed' };
      default: return { color: '#6B7C93', icon: '📄', label: status };
    }
  };

  if (!isOpen || !task) return null;

  const statusInfo = getStatusInfo(formData.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-task-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-info">
            <h2>
              <span className="modal-icon">✏️</span>
              Edit Task
            </h2>
            <div className="task-meta">
              <span 
                className="status-badge"
                style={{ background: `${statusInfo.color}20`, color: statusInfo.color }}
              >
                {statusInfo.icon} {statusInfo.label}
              </span>
              <span 
                className="priority-badge"
                style={{ background: `${getPriorityColor(formData.priority)}20`, color: getPriorityColor(formData.priority) }}
              >
                {getPriorityLabel(formData.priority)} Priority
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className={`quick-btn ${formData.status === 'BACKLOG' ? 'active' : ''}`}
              onClick={() => handleQuickStatusUpdate('BACKLOG')}
              disabled={loading}
              style={{ borderColor: '#FF9800' }}
            >
              <span>📋</span> Move to Backlog
            </button>
            <button 
              className={`quick-btn ${formData.status === 'ONGOING' ? 'active' : ''}`}
              onClick={() => handleQuickStatusUpdate('ONGOING')}
              disabled={loading}
              style={{ borderColor: '#2196F3' }}
            >
              <span>⚡</span> Start Working
            </button>
            <button 
              className={`quick-btn ${formData.status === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => handleQuickStatusUpdate('COMPLETED')}
              disabled={loading}
              style={{ borderColor: '#4CAF50' }}
            >
              <span>✅</span> Mark Complete
            </button>
          </div>
        </div>

        {/* Detailed Form */}
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3>Task Details</h3>
            
            <div className="form-group">
              <label className="form-label">
                Task Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter task title"
                maxLength={200}
              />
              {formErrors.title && <div className="form-error">{formErrors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe what needs to be done"
                rows={4}
                maxLength={1000}
              />
              {formErrors.description && <div className="form-error">{formErrors.description}</div>}
              <div className="character-count">
                {formData.description.length}/1000 characters
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="BACKLOG">📋 Backlog</option>
                  <option value="ONGOING">⚡ In Progress</option>
                  <option value="COMPLETED">✅ Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                >
                  <option value={1}>Low Priority</option>
                  <option value={2}>Medium Priority</option>
                  <option value={3}>High Priority</option>
                  <option value={4}>Critical</option>
                  <option value={5}>Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Hours</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.estimatedHours}
                  onChange={(e) => handleChange('estimatedHours', e.target.value)}
                  placeholder="e.g. 4.5"
                  min="0.5"
                  max="1000"
                  step="0.5"
                />
                {formErrors.estimatedHours && <div className="form-error">{formErrors.estimatedHours}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Reward Points</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.rewardPoints}
                  onChange={(e) => handleChange('rewardPoints', e.target.value)}
                  placeholder="e.g. 50"
                  min="0"
                  max="10000"
                />
                {formErrors.rewardPoints && <div className="form-error">{formErrors.rewardPoints}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                />
                {formErrors.deadline && <div className="form-error">{formErrors.deadline}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                className="form-input"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="Enter tags separated by commas"
                maxLength={200}
              />
              <div className="form-help">Separate multiple tags with commas</div>
            </div>
          </div>

          {/* Task Timeline */}
          {(task.createdAt || task.startedAt || task.completedAt) && (
            <div className="form-section">
              <h3>Timeline</h3>
              <div className="timeline">
                {task.createdAt && (
                  <div className="timeline-item">
                    <span className="timeline-icon">📅</span>
                    <span className="timeline-text">Created: {formatDate(task.createdAt)}</span>
                  </div>
                )}
                {task.startedAt && (
                  <div className="timeline-item">
                    <span className="timeline-icon">▶️</span>
                    <span className="timeline-text">Started: {formatDate(task.startedAt)}</span>
                  </div>
                )}
                {task.completedAt && (
                  <div className="timeline-item">
                    <span className="timeline-icon">✅</span>
                    <span className="timeline-text">Completed: {formatDate(task.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;