import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import './Forms.css';

const AssignmentForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [formData, setFormData] = useState({
    workspaceId: '',
    title: '',
    description: '',
    assignmentTypeKey: 'CUSTOM',
    totalRewardPoints: 0,
    totalEstimatedHours: 0,
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorkspaces();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.workspaceId) {
      setError('Please select a workspace');
      return;
    }

    if (!formData.title.trim()) {
      setError('Assignment title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        workspaceId: formData.workspaceId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        assignmentTypeKey: formData.assignmentTypeKey,
        totalRewardPoints: formData.totalRewardPoints,
        totalEstimatedHours: formData.totalEstimatedHours,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        taskIds: [],
        newTasks: []
      };

      const response = await apiClient.post('/assignments', payload);
      
      if (response.data.success) {
        onSuccess(response.data.data);
      } else {
        setError(response.data.message || 'Failed to create assignment');
      }
    } catch (err) {

      setError(err.response?.data?.message || 'Failed to create assignment');
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
        <div className="empty-icon">📋</div>
        <h3>No Workspaces Available</h3>
        <p>You need to have access to at least one workspace to create an assignment.</p>
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

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Assignment Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Java Fundamentals Module"
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
          placeholder="Brief description of the assignment objectives..."
          className="form-textarea"
          rows={4}
          maxLength={5000}
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="assignmentTypeKey" className="form-label">
            Type
          </label>
          <select
            id="assignmentTypeKey"
            name="assignmentTypeKey"
            value={formData.assignmentTypeKey}
            onChange={handleInputChange}
            className="form-select"
            disabled={loading}
          >
            <option value="CUSTOM">Custom Assignment</option>
            <option value="ROADMAP">Roadmap Assignment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="totalRewardPoints" className="form-label">
            Reward Points
          </label>
          <input
            type="number"
            id="totalRewardPoints"
            name="totalRewardPoints"
            value={formData.totalRewardPoints}
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
          <label htmlFor="totalEstimatedHours" className="form-label">
            Estimated Hours
          </label>
          <input
            type="number"
            id="totalEstimatedHours"
            name="totalEstimatedHours"
            value={formData.totalEstimatedHours}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            step="0.5"
            className="form-input"
            disabled={loading}
          />
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
            'Create Assignment'
          )}
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;