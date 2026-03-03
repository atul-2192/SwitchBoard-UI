import React, { useState, useEffect } from 'react';
import { workspaceService } from '../../../services/workspaceService';

const UserManagement = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    userId: '',
    accessLevel: 'READ'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadWorkspaceUsers();
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

  const loadWorkspaceUsers = async () => {
    if (!selectedWorkspace) return;
    
    setLoading(true);
    try {
      const userIds = await workspaceService.getWorkspaceUsers(selectedWorkspace);
      
      // Get workspace details to show access levels
      const workspace = workspaces.find(w => w.id === selectedWorkspace);
      
      // Create user objects with access levels
      const users = userIds.map(userId => {
        let accessLevel = 'READ'; // default
        
        if (workspace) {
          if (workspace.ownerUserId === userId) {
            accessLevel = 'OWNER';
          } else if (workspace.adminAccessUserIds && workspace.adminAccessUserIds.includes(userId)) {
            accessLevel = 'ADMIN';
          } else if (workspace.writeAccessUserIds && workspace.writeAccessUserIds.includes(userId)) {
            accessLevel = 'WRITE';
          } else {
            accessLevel = 'READ';
          }
        }
        
        return {
          userId,
          accessLevel,
          isOwner: workspace && workspace.ownerUserId === userId
        };
      });
      
      setWorkspaceUsers(users);
    } catch (error) {
      showMessage('Failed to load workspace users', 'error');
      setWorkspaceUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateAddUser = () => {
    const errors = {};
    
    if (!newUserData.userId.trim()) {
      errors.userId = 'User ID is required';
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (newUserData.userId && !uuidRegex.test(newUserData.userId)) {
      errors.userId = 'Invalid UUID format';
    }

    // Check if user already exists
    if (workspaceUsers.find(user => user.userId === newUserData.userId)) {
      errors.userId = 'User already has access to this workspace';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!validateAddUser()) {
      return;
    }

    setLoading(true);
    try {
      await workspaceService.addUserToWorkspace(
        selectedWorkspace, 
        newUserData.userId, 
        newUserData.accessLevel
      );
      
      showMessage('User added successfully', 'success');
      setNewUserData({ userId: '', accessLevel: 'READ' });
      setFormErrors({});
      setShowAddUser(false);
      await loadWorkspaceUsers();
    } catch (error) {
      showMessage(error.message || 'Failed to add user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserAccess = async (userId, newAccessLevel) => {
    setLoading(true);
    try {
      await workspaceService.updateUserAccess(selectedWorkspace, userId, newAccessLevel);
      showMessage('User access updated successfully', 'success');
      await loadWorkspaceUsers();
    } catch (error) {
      showMessage(error.message || 'Failed to update user access', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId, isOwner) => {
    if (isOwner) {
      showMessage('Cannot remove workspace owner', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove this user from the workspace?`)) {
      return;
    }

    setLoading(true);
    try {
      await workspaceService.removeUserFromWorkspace(selectedWorkspace, userId);
      showMessage('User removed successfully', 'success');
      await loadWorkspaceUsers();
    } catch (error) {
      showMessage(error.message || 'Failed to remove user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getAccessLevelColor = (accessLevel) => {
    const colors = {
      'OWNER': '#9C27B0',
      'ADMIN': '#F44336',
      'WRITE': '#FF9800',
      'READ': '#4CAF50'
    };
    return colors[accessLevel] || colors['read'];
  };

  const getAccessLevelLabel = (accessLevel) => {
    const labels = {
      'OWNER': 'Owner',
      'ADMIN': 'Admin',
      'WRITE': 'Write',
      'read': 'Read'
    };
    return labels[accessLevel] || accessLevel;
  };

  return (
    <div className="user-management">
      {message && (
        <div className={`message message-${message.type}`}>
          <span>{message.type === 'error' ? '❌' : '✅'}</span>
          {message.text}
        </div>
      )}

      <div className="admin-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">👥</span>
            User Management
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
              onClick={() => setShowAddUser(!showAddUser)}
              disabled={loading || !selectedWorkspace}
            >
              {showAddUser ? '📋 View Users' : '➕ Add User'}
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <form onSubmit={handleAddUser} className="add-user-form" style={{ marginBottom: '24px' }}>
            <h3>Add User to Workspace</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  User ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newUserData.userId}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="Enter user UUID"
                  required
                />
                {formErrors.userId && <div className="form-error">{formErrors.userId}</div>}
                <div className="form-help">Enter a valid UUID for the user</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Access Level <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={newUserData.accessLevel}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, accessLevel: e.target.value }))}
                  required
                >
                  <option value="READ">Read - View only access</option>
                  <option value="WRITE">Write - Can create and edit content</option>
                  <option value="ADMIN">Admin - Full administrative access</option>
                </select>
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Adding...' : '➕ Add User'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowAddUser(false);
                  setNewUserData({ userId: '', accessLevel: 'READ' });
                  setFormErrors({});
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Users List */}
        {!showAddUser && selectedWorkspace && (
          <div className="users-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : workspaceUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
                <span style={{ fontSize: '48px' }}>👥</span>
                <p>No users found in this workspace</p>
                <p>Click "Add User" to grant access to users</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--sb-bg)', borderRadius: '8px', border: '1px solid var(--sb-border)' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Access Levels:</h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--sb-sub)' }}>
                    <span><span style={{ color: getAccessLevelColor('OWNER') }}>●</span> Owner - Workspace creator</span>
                    <span><span style={{ color: getAccessLevelColor('ADMIN') }}>●</span> Admin - Full access</span>
                    <span><span style={{ color: getAccessLevelColor('WRITE') }}>●</span> Write - Create/edit content</span>
                    <span><span style={{ color: getAccessLevelColor('read') }}>●</span> Read - View only</span>
                  </div>
                </div>

                <div className="item-list">
                  {workspaceUsers.map(user => (
                    <div key={user.userId} className="item-card">
                      <div className="item-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <span style={{ fontSize: '20px' }}>👤</span>
                          <div>
                            <h3 className="item-title" style={{ margin: '0 0 4px 0' }}>
                              {user.userId}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span 
                                className="status-badge"
                                style={{ 
                                  background: `${getAccessLevelColor(user.accessLevel)}20`,
                                  color: getAccessLevelColor(user.accessLevel),
                                  border: `1px solid ${getAccessLevelColor(user.accessLevel)}40`
                                }}
                              >
                                {getAccessLevelLabel(user.accessLevel)}
                              </span>
                              {user.isOwner && (
                                <span style={{ fontSize: '12px', color: 'var(--sb-sub)' }}>
                                  👑 Workspace Owner
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="item-actions">
                          {!user.isOwner && (
                            <>
                              <select
                                className="form-select"
                                value={user.accessLevel}
                                onChange={(e) => handleUpdateUserAccess(user.userId, e.target.value)}
                                disabled={loading}
                                style={{ marginRight: '8px', fontSize: '12px', padding: '6px 8px' }}
                              >
                                <option value="READ">Read</option>
                                <option value="WRITE">Write</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                              <button 
                                className="btn btn-danger"
                                onClick={() => handleRemoveUser(user.userId, user.isOwner)}
                                disabled={loading}
                              >
                                🗑️ Remove
                              </button>
                            </>
                          )}
                          {user.isOwner && (
                            <div style={{ 
                              padding: '8px 12px', 
                              background: 'rgba(156, 39, 176, 0.1)', 
                              color: '#9C27B0',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              Cannot modify owner
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="item-meta">
                        <span>🏢 Workspace Access</span>
                        <span>🔑 {getAccessLevelLabel(user.accessLevel)} Level</span>
                        {user.isOwner && <span>👑 Owner Privileges</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!showAddUser && !selectedWorkspace && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
            <span style={{ fontSize: '48px' }}>🏢</span>
            <p>Please select a workspace to view and manage users</p>
            <p>User management allows you to control who can access each workspace and their permission levels</p>
          </div>
        )}

        {/* Workspace Info */}
        {selectedWorkspace && !showAddUser && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--sb-bg)', borderRadius: '8px', border: '1px solid var(--sb-border)' }}>
            {(() => {
              const workspace = workspaces.find(w => w.id === selectedWorkspace);
              return workspace ? (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
                    Workspace: {workspace.name}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '14px', color: 'var(--sb-sub)' }}>
                    <div>👤 Owner: {workspace.ownerUserId}</div>
                    <div>👁️ Visibility: {workspace.visibility}</div>
                    <div>👥 Total Users: {workspaceUsers.length}</div>
                    <div>📊 Tasks: {workspace.taskCount || 0}</div>
                    <div>📋 Assignments: {workspace.assignmentCount || 0}</div>
                    {workspace.createdAt && (
                      <div>📅 Created: {new Date(workspace.createdAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;