import React, { useState, useEffect } from 'react';
import { workspaceService } from '../../../services/workspaceService';

/**
 * ⚠️ IMPORTANT: Workspace Management (Limited Functionality)
 * 
 * According to the API Contract v1.0.0:
 * - ❌ Cannot CREATE workspaces (no POST /workspaces endpoint)
 * - ❌ Cannot UPDATE workspaces (no PUT /workspaces/{id} endpoint)
 * - ✅ Can only ACTIVATE default workspace for users
 * - ✅ Can DELETE workspaces
 * - ✅ Can manage workspace users (add/remove/update access)
 */
const WorkspaceManagement = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showActivateForm, setShowActivateForm] = useState(false);
  const [activateUserId, setActivateUserId] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Load workspaces on component mount
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const response = await workspaceService.getAllWorkspaces();
      setWorkspaces(response.content || response || []);
    } catch (error) {
      showMessage('Failed to load workspaces', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateUserId = (userId) => {
    const errors = {};
    
    if (!userId.trim()) {
      errors.userId = 'User ID is required';
      return errors;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(userId)) {
      errors.userId = 'Invalid UUID format';
    }

    return errors;
  };

  /**
   * Activate default workspace for a user (ONLY way to create workspaces)
   */
  const handleActivateWorkspace = async (e) => {
    e.preventDefault();
    
    const errors = validateUserId(activateUserId);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await workspaceService.activateDefaultWorkspace(activateUserId);
      showMessage('Default workspace activated successfully for user', 'success');
      setActivateUserId('');
      setShowActivateForm(false);
      await loadWorkspaces();
    } catch (error) {
      showMessage(error.message || 'Failed to activate workspace', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workspace) => {
    if (!window.confirm(`Are you sure you want to delete "${workspace.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await workspaceService.deleteWorkspace(workspace.id);
      showMessage('Workspace deleted successfully', 'success');
      await loadWorkspaces();
    } catch (error) {
      showMessage(error.message || 'Failed to delete workspace', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-management">
      {/* Messages */}
      {message && (
        <div className={`message message-${message.type}`}>
          <span>{message.type === 'error' ? '❌' : '✅'}</span>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="admin-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">🏢</span>
            Workspace Management
          </h2>
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => setShowActivateForm(!showActivateForm)}
              disabled={loading}
            >
              {showActivateForm ? '📋 View List' : '✨ Activate Workspace for User'}
            </button>
          </div>
        </div>

        {/* API Contract Notice */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <strong style={{ display: 'block', marginBottom: '8px' }}>API Contract Limitations</strong>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                According to the API contract, you <strong>cannot manually create or edit</strong> workspaces.
                <br />
                ✅ You can only <strong>activate default workspaces</strong> for users (backend creates them automatically)
                <br />
                ✅ You can <strong>delete workspaces</strong> and <strong>manage user access</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Activate Workspace Form */}
        {showActivateForm && (
          <form onSubmit={handleActivateWorkspace} className="workspace-form" style={{
            backgroundColor: 'var(--sb-background-lightest)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3>✨ Activate Default Workspace</h3>
            <p style={{ color: 'var(--sb-sub)', marginBottom: '20px' }}>
              This will activate a default workspace for the specified user (if they don't already have one).
            </p>
            
            <div className="form-group">
              <label className="form-label">
                User ID <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={activateUserId}
                onChange={(e) => setActivateUserId(e.target.value)}
                placeholder="Enter user UUID (e.g., 550e8400-e29b-41d4-a716-446655440000)"
                required
              />
              {formErrors.userId && <div className="form-error">{formErrors.userId}</div>}
              <div className="form-help">Enter the UUID of the user who needs a default workspace</div>
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Activating...' : '✨ Activate Workspace'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowActivateForm(false);
                  setActivateUserId('');
                  setFormErrors({});
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Workspace List */}
        {!showActivateForm && (
          <div className="workspace-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading workspaces...</p>
              </div>
            ) : workspaces.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
                <span style={{ fontSize: '48px' }}>📁</span>
                <p>No workspaces found</p>
                <p>Activate a workspace for users to get started</p>
              </div>
            ) : (
              <div className="item-list">
                {workspaces.map(workspace => (
                  <div key={workspace.id} className="item-card">
                    <div className="item-header">
                      <h3 className="item-title">{workspace.name}</h3>
                      <div className="item-actions">
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(workspace)}
                          disabled={loading}
                          title="Delete workspace permanently"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    {workspace.description && (
                      <p style={{ margin: '8px 0', color: 'var(--sb-sub)' }}>
                        {workspace.description}
                      </p>
                    )}

                    <div className="item-meta">
                      <span className={`status-badge ${workspace.workspaceType ? workspace.workspaceType.toLowerCase() : 'private'}`}>
                        {workspace.workspaceType || 'PRIVATE'}
                      </span>
                      <span>👤 Owner: {workspace.ownerUserId}</span>
                      <span>� {workspace.userAccessCount || 0} shared users</span>
                      {workspace.createdAt && (
                        <span>📅 Created: {new Date(workspace.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceManagement;