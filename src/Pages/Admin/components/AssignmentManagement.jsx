import React, { useState, useEffect } from 'react';
import { workspaceService } from '../../../services/workspaceService';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [formData, setFormData] = useState({
    workspaceId: '',
    title: '',
    description: '',
    assignmentTypeKey: 'CUSTOM',
    totalRewardPoints: 0,
    totalEstimatedHours: 0,
    deadline: '',
    taskIds: [],
    newTasks: []
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadAssignments();
    }
  }, [selectedWorkspace]);

  const loadWorkspaces = async () => {
    try {
      const response = await workspaceService.getAllWorkspaces();
      setWorkspaces(response.content || response || []);
    } catch (error) {
      showMessage('Failed to load workspaces', 'error');
    }
  };

  const loadAssignments = async () => {
    if (!selectedWorkspace) return;
    
    setLoading(true);
    try {
      const assignmentsData = await workspaceService.getAssignmentsByWorkspace(selectedWorkspace);
      setAssignments(assignmentsData || []);
    } catch (error) {
      showMessage('Failed to load assignments', 'error');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.workspaceId.trim()) {
      errors.workspaceId = 'Workspace is required';
    }

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must be less than 255 characters';
    }

    if (formData.description && formData.description.length > 5000) {
      errors.description = 'Description must be less than 5000 characters';
    }

    if (formData.totalRewardPoints < 0) {
      errors.totalRewardPoints = 'Total reward points cannot be negative';
    }

    if (formData.totalEstimatedHours < 0) {
      errors.totalEstimatedHours = 'Total estimated hours cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const assignmentData = {
        ...formData,
        totalRewardPoints: parseFloat(formData.totalRewardPoints),
        totalEstimatedHours: parseFloat(formData.totalEstimatedHours),
        deadline: formData.deadline || null,
        taskIds: formData.taskIds.filter(id => id.trim()),
        newTasks: formData.newTasks.filter(task => task.title && task.title.trim())
      };

      if (editingAssignment) {
        await workspaceService.updateAssignment(editingAssignment.id, assignmentData);
        showMessage('Assignment updated successfully', 'success');
      } else {
        await workspaceService.createAssignment(assignmentData);
        showMessage('Assignment created successfully', 'success');
      }
      
      resetForm();
      await loadAssignments();
    } catch (error) {
      showMessage(error.message || 'Failed to save assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      workspaceId: assignment.workspaceId || '',
      title: assignment.title || '',
      description: assignment.description || '',
      assignmentTypeKey: assignment.assignmentTypeKey || 'CUSTOM',
      totalRewardPoints: assignment.totalRewardPoints || 0,
      totalEstimatedHours: assignment.totalEstimatedHours || 0,
      deadline: assignment.deadline ? assignment.deadline.split('T')[0] : '',
      taskIds: assignment.taskIds || [],
      newTasks: []
    });
    setSelectedWorkspace(assignment.workspaceId);
    setShowForm(true);
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await workspaceService.deleteAssignment(assignment.id);
      showMessage('Assignment deleted successfully', 'success');
      await loadAssignments();
    } catch (error) {
      showMessage(error.message || 'Failed to delete assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      workspaceId: selectedWorkspace,
      title: '',
      description: '',
      assignmentTypeKey: 'CUSTOM',
      totalRewardPoints: 0,
      totalEstimatedHours: 0,
      deadline: '',
      taskIds: [],
      newTasks: []
    });
    setFormErrors({});
    setEditingAssignment(null);
    setShowForm(false);
  };

  const addNewTask = () => {
    setFormData(prev => ({
      ...prev,
      newTasks: [...prev.newTasks, {
        title: '',
        description: '',
        priority: 3,
        rewardPoints: 0,
        estimatedHours: 0,
        statusKey: 'TODO'
      }]
    }));
  };

  const removeNewTask = (index) => {
    setFormData(prev => ({
      ...prev,
      newTasks: prev.newTasks.filter((_, i) => i !== index)
    }));
  };

  const updateNewTask = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      newTasks: prev.newTasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  return (
    <div className="assignment-management">
      {message && (
        <div className={`message message-${message.type}`}>
          <span>{message.type === 'error' ? '❌' : '✅'}</span>
          {message.text}
        </div>
      )}

      <div className="admin-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">📋</span>
            Assignment Management
          </h2>
          <div className="action-buttons">
            <select
              className="form-select"
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              style={{ marginRight: '12px' }}
            >
              <option value="">Select Workspace</option>
              {workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
              disabled={loading || !selectedWorkspace}
            >
              {showForm ? '📋 View List' : '➕ Create Assignment'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="assignment-form">
            <h3>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Workspace <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.workspaceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, workspaceId: e.target.value }))}
                  required
                >
                  <option value="">Select Workspace</option>
                  {workspaces.map(workspace => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
                {formErrors.workspaceId && <div className="form-error">{formErrors.workspaceId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter assignment title"
                  maxLength={255}
                  required
                />
                {formErrors.title && <div className="form-error">{formErrors.title}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Assignment Type</label>
                <select
                  className="form-select"
                  value={formData.assignmentTypeKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignmentTypeKey: e.target.value }))}
                >
                  <option value="CUSTOM">Custom</option>
                  <option value="ROADMAP">Roadmap</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Reward Points</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.totalRewardPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalRewardPoints: e.target.value }))}
                  min="0"
                />
                {formErrors.totalRewardPoints && <div className="form-error">{formErrors.totalRewardPoints}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Total Estimated Hours</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.totalEstimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalEstimatedHours: e.target.value }))}
                  min="0"
                  step="0.5"
                />
                {formErrors.totalEstimatedHours && <div className="form-error">{formErrors.totalEstimatedHours}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter assignment description"
                maxLength={5000}
                rows={4}
              />
              {formErrors.description && <div className="form-error">{formErrors.description}</div>}
            </div>

            {/* Existing Task IDs */}
            <div className="form-group">
              <label className="form-label">Existing Task IDs</label>
              <input
                type="text"
                className="form-input"
                value={formData.taskIds.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  taskIds: e.target.value.split(',').map(id => id.trim()).filter(id => id)
                }))}
                placeholder="Enter existing task UUIDs separated by commas"
              />
              <div className="form-help">Add existing tasks to this assignment</div>
            </div>

            {/* New Tasks */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label className="form-label">New Tasks to Create</label>
                <button type="button" className="btn btn-secondary" onClick={addNewTask}>
                  ➕ Add Task
                </button>
              </div>
              
              {formData.newTasks.map((task, index) => (
                <div key={index} className="new-task-item" style={{ 
                  border: '1px solid var(--sb-border)', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  marginBottom: '16px',
                  background: 'var(--sb-bg)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Task {index + 1}</h4>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => removeNewTask(index)}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      ❌ Remove
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        value={task.title}
                        onChange={(e) => updateNewTask(index, 'title', e.target.value)}
                        placeholder="Task title"
                      />
                    </div>
                    <div className="form-group">
                      <select
                        className="form-select"
                        value={task.priority}
                        onChange={(e) => updateNewTask(index, 'priority', parseInt(e.target.value))}
                      >
                        <option value={1}>Priority 1 - Low</option>
                        <option value={2}>Priority 2 - Medium</option>
                        <option value={3}>Priority 3 - High</option>
                        <option value={4}>Priority 4 - Critical</option>
                        <option value={5}>Priority 5 - Urgent</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-input"
                        value={task.rewardPoints}
                        onChange={(e) => updateNewTask(index, 'rewardPoints', e.target.value)}
                        placeholder="Reward points"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-input"
                        value={task.estimatedHours}
                        onChange={(e) => updateNewTask(index, 'estimatedHours', e.target.value)}
                        placeholder="Estimated hours"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                  
                  <textarea
                    className="form-textarea"
                    value={task.description}
                    onChange={(e) => updateNewTask(index, 'description', e.target.value)}
                    placeholder="Task description"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Saving...' : (editingAssignment ? '💾 Update' : '➕ Create')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {!showForm && selectedWorkspace && (
          <div className="assignment-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading assignments...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
                <span style={{ fontSize: '48px' }}>📋</span>
                <p>No assignments found in this workspace</p>
                <p>Click "Create Assignment" to get started</p>
              </div>
            ) : (
              <div className="item-list">
                {assignments.map(assignment => (
                  <div key={assignment.id} className="item-card">
                    <div className="item-header">
                      <h3 className="item-title">{assignment.title}</h3>
                      <div className="item-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleEdit(assignment)}
                          disabled={loading}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(assignment)}
                          disabled={loading}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    {assignment.description && (
                      <p style={{ margin: '8px 0', color: 'var(--sb-sub)' }}>
                        {assignment.description.length > 150 
                          ? assignment.description.substring(0, 150) + '...'
                          : assignment.description
                        }
                      </p>
                    )}

                    <div className="item-meta">
                      <span className={`status-badge ${assignment.assignmentTypeKey.toLowerCase()}`}>
                        {assignment.assignmentTypeKey}
                      </span>
                      {assignment.totalRewardPoints > 0 && (
                        <span>🏆 {assignment.totalRewardPoints} pts</span>
                      )}
                      {assignment.totalEstimatedHours > 0 && (
                        <span>⏱️ {assignment.totalEstimatedHours}h estimated</span>
                      )}
                      {assignment.deadline && (
                        <span>📅 Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                      )}
                      {assignment.taskCount !== undefined && (
                        <span>📝 {assignment.taskCount} tasks</span>
                      )}
                      {assignment.createdAt && (
                        <span>📅 Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!showForm && !selectedWorkspace && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
            <span style={{ fontSize: '48px' }}>🏢</span>
            <p>Please select a workspace to view and manage assignments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;