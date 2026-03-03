import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import './Forms.css';

const TaskForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    workspaceId: '',
    assignmentId: '',
    title: '',
    description: '',
    taskTypeKey: 'DEVELOPMENT',
    statusKey: 'TODO',
    priority: 3,
    rewardPoints: 0,
    estimatedHours: 0,
    titleColor: '#8B4513',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (formData.workspaceId) {
      loadAssignments(formData.workspaceId);
    } else {
      setAssignments([]);
      setFormData(prev => ({ ...prev, assignmentId: '' }));
    }
  }, [formData.workspaceId]);

  const loadWorkspaces = async () => {
    if (!user?.id) return;

    try {
      setLoadingWorkspaces(true);
      // ✅ API Gateway automatically adds X-User-Id from JWT token
      // No need to manually set headers
      const response = await apiClient.get('/workspaces/accessible');
      
      // Workspaces endpoint returns array directly, not wrapped in ApiResponse
      setWorkspaces(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (err) {

      setError('Failed to load workspaces');
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  const loadAssignments = async (workspaceId) => {
    try {
      setLoadingAssignments(true);
      const response = await apiClient.get(`/assignments/workspace/${workspaceId}`);
      
      if (response.data.success) {
        setAssignments(response.data.data || []);
      } else {
        setAssignments([]);
      }
    } catch (err) {

      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (name === 'priority' ? parseInt(value) || 1 : parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.workspaceId) {
      setError('Please select a workspace');
      return;
    }

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        workspaceId: formData.workspaceId,
        assignmentId: formData.assignmentId || undefined,
        assigneeUserId: undefined, // Will be assigned later
        reporterUserId: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        taskTypeKey: formData.taskTypeKey,
        statusKey: formData.statusKey,
        priority: formData.priority,
        rewardPoints: formData.rewardPoints,
        estimatedHours: formData.estimatedHours,
        spentHours: 0,
        titleColor: formData.titleColor,
        position: 1.0,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        tagIds: []
      };

      const response = await apiClient.post('/tasks', payload);
      
      if (response.data.success) {
        onSuccess(response.data.data);
      } else {
        setError(response.data.message || 'Failed to create task');
      }
    } catch (err) {

      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (loadingWorkspaces) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading workspaces...</p>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No Workspaces Available</h3>
        <p>You need to have access to at least one workspace to create a task.</p>
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="form-button secondary"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="workspaceId" className="form-label">
          Workspace <span className="required">*</span>
        </label>
        <select
          id="workspaceId"
          name="workspaceId"
          value={formData.workspaceId}
          onChange={handleInputChange}
          className="form-select"
          disabled={loading}
          required
        >
          <option value="">Select a workspace</option>
          {workspaces.map(workspace => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
      </div>

      {formData.workspaceId && (
        <div className="form-group">
          <label htmlFor="assignmentId" className="form-label">
            Assignment (Optional)
          </label>
          <select
            id="assignmentId"
            name="assignmentId"
            value={formData.assignmentId}
            onChange={handleInputChange}
            className="form-select"
            disabled={loading || loadingAssignments}
          >
            <option value="">No assignment (standalone task)</option>
            {loadingAssignments ? (
              <option value="">Loading assignments...</option>
            ) : (
              assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Task Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Implement user authentication"
          className="form-input"
          maxLength={255}
          disabled={loading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Detailed description of the task..."
          className="form-textarea"
          rows={4}
          maxLength={5000}
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="taskTypeKey" className="form-label">
            Type
          </label>
          <select
            id="taskTypeKey"
            name="taskTypeKey"
            value={formData.taskTypeKey}
            onChange={handleInputChange}
            className="form-select"
            disabled={loading}
          >
            <option value="DEVELOPMENT">Development</option>
            <option value="BUG">Bug Fix</option>
            <option value="FEATURE">Feature</option>
            <option value="DOCUMENTATION">Documentation</option>
            <option value="TESTING">Testing</option>
            <option value="RESEARCH">Research</option>
            <option value="DESIGN">Design</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="statusKey" className="form-label">
            Status
          </label>
          <select
            id="statusKey"
            name="statusKey"
            value={formData.statusKey}
            onChange={handleInputChange}
            className="form-select"
            disabled={loading}
          >
            <option value="BACKLOG">Backlog</option>
            <option value="TODO">To Do</option>
            <option value="ONGOING">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="form-select"
            disabled={loading}
          >
            <option value={1}>1 - Lowest</option>
            <option value={2}>2 - Low</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4 - High</option>
            <option value={5}>5 - Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="rewardPoints" className="form-label">
            Reward Points
          </label>
          <input
            type="number"
            id="rewardPoints"
            name="rewardPoints"
            value={formData.rewardPoints}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            className="form-input"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="estimatedHours" className="form-label">
            Estimated Hours
          </label>
          <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            step="0.5"
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="titleColor" className="form-label">
            Color
          </label>
          <input
            type="color"
            id="titleColor"
            name="titleColor"
            value={formData.titleColor}
            onChange={handleInputChange}
            className="form-color"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="deadline" className="form-label">
          Deadline
        </label>
        <input
          type="datetime-local"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleInputChange}
          className="form-input"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {error}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="form-button secondary"
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          className="form-button primary"
          disabled={loading || !formData.workspaceId || !formData.title.trim()}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              Creating...
            </>
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;