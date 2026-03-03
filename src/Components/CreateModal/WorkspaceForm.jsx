import React, { useState } from 'react';
import { workspaceService } from '../../services/workspaceService';
import { useAuth } from '../../context/AuthContext';
import './Forms.css';

/**
 * ⚠️ IMPORTANT: This form activates a default workspace (cannot create custom workspaces)
 * According to API Contract v1.0.0, workspaces cannot be manually created.
 * The backend creates a default workspace when activateDefaultWorkspace() is called.
 */
const WorkspaceForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError('User authentication required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ Use the ONLY valid way to create workspace according to API contract
      await workspaceService.activateDefaultWorkspace(user.id);
      
      // Fetch the newly created default workspace
      const workspaces = await workspaceService.getWorkspacesByOwner(user.id);
      
      if (workspaces && workspaces.length > 0) {
        // Return the most recently created workspace
        const newestWorkspace = workspaces.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        onSuccess(newestWorkspace);
      } else {
        setError('Workspace activated but could not be retrieved');
      }
    } catch (err) {

      setError(err.message || 'Failed to activate workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '20px' }}>ℹ️</span>
          <div>
            <strong style={{ display: 'block', marginBottom: '4px' }}>
              Activating Default Workspace
            </strong>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              The backend will create a default workspace for you automatically.
              You cannot customize the workspace name or settings during creation.
            </p>
          </div>
        </div>
      </div>

      <div className="form-group">
        <p style={{ color: 'var(--sb-sub)', marginBottom: '20px' }}>
          Click the button below to activate your default workspace. 
          The backend will configure it with default settings.
        </p>
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
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              Activating...
            </>
          ) : (
            '✨ Activate Workspace'
          )}
        </button>
      </div>
    </form>
  );
};

export default WorkspaceForm;