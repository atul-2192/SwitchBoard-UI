/**
 * useWorkspaces Hook
 * Custom React hook for workspace management
 * 
 * ⚠️ API GATEWAY: The API Gateway (port 8080) automatically extracts user ID from JWT token.
 * No need to manually pass user IDs - the gateway adds X-User-Id header automatically.
 */

import { useState, useEffect, useCallback } from 'react';
import { workspaceService } from '../services/workspaceService';

/**
 * Hook to fetch and manage user's workspaces
 * API Gateway automatically adds user ID from JWT token
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Workspace data and operations
 */
export const useWorkspaces = (autoFetch = true) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user's workspaces (API Gateway adds user ID from JWT)
  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workspaceService.getWorkspacesByOwner();
      setWorkspaces(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch accessible workspaces (owned + shared, API Gateway adds user ID from JWT)
  const fetchAccessibleWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workspaceService.getAccessibleWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh workspaces
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Auto-fetch on mount and when refreshKey changes
  useEffect(() => {
    if (autoFetch) {
      fetchWorkspaces();
    }
  }, [autoFetch, refreshKey, fetchWorkspaces]);

  return {
    workspaces,
    loading,
    error,
    fetchWorkspaces,
    fetchAccessibleWorkspaces,
    refresh,
    isEmpty: workspaces.length === 0 && !loading
  };
};

/**
 * Hook to fetch a specific workspace by ID
 * @param {string} workspaceId - Workspace UUID
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Workspace data and operations
 */
export const useWorkspace = (workspaceId, autoFetch = true) => {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkspace = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await workspaceService.getWorkspaceById(workspaceId);
      setWorkspace(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (autoFetch && workspaceId) {
      fetchWorkspace();
    }
  }, [autoFetch, workspaceId, fetchWorkspace]);

  return {
    workspace,
    loading,
    error,
    fetchWorkspace,
    refresh: fetchWorkspace
  };
};

/**
 * Hook for workspace operations (create, update, delete)
 * @returns {Object} - Workspace operation functions and state
 */
export const useWorkspaceOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteWorkspace = useCallback(async (workspaceId) => {
    try {
      setLoading(true);
      setError(null);
      await workspaceService.deleteWorkspace(workspaceId);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const addUserToWorkspace = useCallback(async (workspaceId, userId, accessLevel) => {
    try {
      setLoading(true);
      setError(null);
      await workspaceService.addUserToWorkspace(workspaceId, userId, accessLevel);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeUserFromWorkspace = useCallback(async (workspaceId, userId) => {
    try {
      setLoading(true);
      setError(null);
      await workspaceService.removeUserFromWorkspace(workspaceId, userId);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserAccessLevel = useCallback(async (workspaceId, userId, accessLevel) => {
    try {
      setLoading(true);
      setError(null);
      await workspaceService.updateUserAccessLevel(workspaceId, userId, accessLevel);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteWorkspace,
    addUserToWorkspace,
    removeUserFromWorkspace,
    updateUserAccessLevel,
    loading,
    error
  };
};

/**
 * Hook to fetch workspace users
 * @param {string} workspaceId - Workspace UUID
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Users data and operations
 */
export const useWorkspaceUsers = (workspaceId, autoFetch = true) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await workspaceService.getWorkspaceUsers(workspaceId);
      setUsers(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (autoFetch && workspaceId) {
      fetchUsers();
    }
  }, [autoFetch, workspaceId, fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    refresh: fetchUsers
  };
};

export default {
  useWorkspaces,
  useWorkspace,
  useWorkspaceOperations,
  useWorkspaceUsers
};
