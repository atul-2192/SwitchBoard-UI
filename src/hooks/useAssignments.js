/**
 * useAssignments Hook
 * Custom React hook for assignment management
 */

import { useState, useEffect, useCallback } from 'react';
import { assignmentService } from '../services/assignmentService';

/**
 * Hook to fetch assignments by workspace
 * @param {string} workspaceId - Workspace UUID
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Assignment data and operations
 */
export const useAssignments = (workspaceId, autoFetch = true) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAssignments = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getAssignmentsByWorkspace(workspaceId);
      setAssignments(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (autoFetch && workspaceId) {
      fetchAssignments();
    }
  }, [autoFetch, workspaceId, refreshKey, fetchAssignments]);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    refresh,
    isEmpty: assignments.length === 0 && !loading
  };
};

/**
 * Hook to fetch a specific assignment by ID
 * @param {string} assignmentId - Assignment UUID
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @param {boolean} includeTasks - Whether to include tasks (default: false)
 * @returns {Object} - Assignment data and operations
 */
export const useAssignment = (assignmentId, autoFetch = true, includeTasks = false) => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignment = useCallback(async () => {
    if (!assignmentId) return;

    try {
      setLoading(true);
      setError(null);
      const data = includeTasks
        ? await assignmentService.getAssignmentWithTasks(assignmentId)
        : await assignmentService.getAssignmentById(assignmentId);
      setAssignment(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [assignmentId, includeTasks]);

  useEffect(() => {
    if (autoFetch && assignmentId) {
      fetchAssignment();
    }
  }, [autoFetch, assignmentId, fetchAssignment]);

  return {
    assignment,
    loading,
    error,
    fetchAssignment,
    refresh: fetchAssignment
  };
};

/**
 * Hook for assignment operations (create, update, delete)
 * @returns {Object} - Assignment operation functions and state
 */
export const useAssignmentOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAssignment = useCallback(async (assignmentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await assignmentService.createAssignment(assignmentData);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAssignment = useCallback(async (assignmentId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await assignmentService.updateAssignment(assignmentId, updateData);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAssignment = useCallback(async (assignmentId) => {
    try {
      setLoading(true);
      setError(null);
      await assignmentService.deleteAssignment(assignmentId);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const addTasksToAssignment = useCallback(async (assignmentId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      await assignmentService.addTasksToAssignment(assignmentId, taskData);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTasksFromAssignment = useCallback(async (assignmentId, taskIds) => {
    try {
      setLoading(true);
      setError(null);
      await assignmentService.removeTasksFromAssignment(assignmentId, taskIds);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    addTasksToAssignment,
    removeTasksFromAssignment,
    loading,
    error
  };
};

/**
 * Hook to fetch overdue assignments
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Overdue assignments data
 */
export const useOverdueAssignments = (autoFetch = true) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverdueAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getOverdueAssignments();
      setAssignments(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchOverdueAssignments();
    }
  }, [autoFetch, fetchOverdueAssignments]);

  return {
    assignments,
    loading,
    error,
    fetchOverdueAssignments,
    refresh: fetchOverdueAssignments
  };
};

/**
 * Hook to fetch upcoming assignments
 * @param {string} workspaceId - Workspace UUID
 * @param {number} daysAhead - Number of days to look ahead (default: 7)
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Upcoming assignments data
 */
export const useUpcomingAssignments = (workspaceId, daysAhead = 7, autoFetch = true) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUpcomingAssignments = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getUpcomingAssignments(workspaceId, daysAhead);
      setAssignments(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [workspaceId, daysAhead]);

  useEffect(() => {
    if (autoFetch && workspaceId) {
      fetchUpcomingAssignments();
    }
  }, [autoFetch, workspaceId, daysAhead, fetchUpcomingAssignments]);

  return {
    assignments,
    loading,
    error,
    fetchUpcomingAssignments,
    refresh: fetchUpcomingAssignments
  };
};

export default {
  useAssignments,
  useAssignment,
  useAssignmentOperations,
  useOverdueAssignments,
  useUpcomingAssignments
};
