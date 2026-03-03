/**
 * useTasks Hook
 * Custom React hook for task management
 */

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { getCurrentUserId } from '../utils/apiUtils';

/**
 * Hook to fetch tasks assigned to current user
 * @param {string} userId - User UUID (optional, auto-fetched if not provided)
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Task data and operations
 */
export const useTasks = (userId = null, autoFetch = true) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const effectiveUserId = userId || getCurrentUserId();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasksAssignedToMe(effectiveUserId);
      setTasks(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (autoFetch && effectiveUserId) {
      fetchTasks();
    }
  }, [autoFetch, effectiveUserId, refreshKey, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    refresh,
    isEmpty: tasks.length === 0 && !loading
  };
};

/**
 * Hook to fetch a specific task by ID
 * @param {string} taskId - Task UUID
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Task data and operations
 */
export const useTask = (taskId, autoFetch = true) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTaskById(taskId);
      setTask(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (autoFetch && taskId) {
      fetchTask();
    }
  }, [autoFetch, taskId, fetchTask]);

  return {
    task,
    loading,
    error,
    fetchTask,
    refresh: fetchTask
  };
};

/**
 * Hook for task operations (update, delete, status changes)
 * @returns {Object} - Task operation functions and state
 */
export const useTaskOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await taskService.updateTask(taskId, updateData);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      setLoading(true);
      setError(null);
      const result = await taskService.updateTaskStatus(taskId, status);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const markTaskInProgress = useCallback(async (taskId) => {
    return updateTaskStatus(taskId, 'IN_PROGRESS');
  }, [updateTaskStatus]);

  const markTaskCompleted = useCallback(async (taskId) => {
    return updateTaskStatus(taskId, 'DONE');
  }, [updateTaskStatus]);

  const markTaskTodo = useCallback(async (taskId) => {
    return updateTaskStatus(taskId, 'TODO');
  }, [updateTaskStatus]);

  const cancelTask = useCallback(async (taskId) => {
    return updateTaskStatus(taskId, 'CANCELLED');
  }, [updateTaskStatus]);

  const assignTask = useCallback(async (taskId, assigneeId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await taskService.assignTask(taskId, assigneeId);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(taskId);
      return { success: true };
    } catch (err) {
      setError(err);

      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateTask,
    updateTaskStatus,
    markTaskInProgress,
    markTaskCompleted,
    markTaskTodo,
    cancelTask,
    assignTask,
    deleteTask,
    loading,
    error
  };
};

/**
 * Hook to fetch tasks by status
 * @param {TaskStatus} status - Task status (TODO, IN_PROGRESS, DONE, CANCELLED)
 * @param {string} userId - User UUID (optional)
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Filtered tasks data
 */
export const useTasksByStatus = (status, userId = null, autoFetch = true) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveUserId = userId || getCurrentUserId();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasksByStatus(effectiveUserId, status);
      setTasks(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [effectiveUserId, status]);

  useEffect(() => {
    if (autoFetch && status) {
      fetchTasks();
    }
  }, [autoFetch, status, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    refresh: fetchTasks
  };
};

/**
 * Hook to fetch overdue tasks
 * @param {string} userId - User UUID (optional)
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Overdue tasks data
 */
export const useOverdueTasks = (userId = null, autoFetch = true) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveUserId = userId || getCurrentUserId();

  const fetchOverdueTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getOverdueTasks(effectiveUserId);
      setTasks(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    if (autoFetch) {
      fetchOverdueTasks();
    }
  }, [autoFetch, fetchOverdueTasks]);

  return {
    tasks,
    loading,
    error,
    fetchOverdueTasks,
    refresh: fetchOverdueTasks
  };
};

/**
 * Hook to fetch upcoming tasks
 * @param {number} daysAhead - Number of days to look ahead (default: 7)
 * @param {string} userId - User UUID (optional)
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Upcoming tasks data
 */
export const useUpcomingTasks = (daysAhead = 7, userId = null, autoFetch = true) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveUserId = userId || getCurrentUserId();

  const fetchUpcomingTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getUpcomingTasks(effectiveUserId, daysAhead);
      setTasks(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [effectiveUserId, daysAhead]);

  useEffect(() => {
    if (autoFetch) {
      fetchUpcomingTasks();
    }
  }, [autoFetch, daysAhead, fetchUpcomingTasks]);

  return {
    tasks,
    loading,
    error,
    fetchUpcomingTasks,
    refresh: fetchUpcomingTasks
  };
};

/**
 * Hook to fetch high priority tasks
 * @param {string} userId - User UUID (optional)
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - High priority tasks data
 */
export const useHighPriorityTasks = (userId = null, autoFetch = true) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveUserId = userId || getCurrentUserId();

  const fetchHighPriorityTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getHighPriorityTasks(effectiveUserId);
      setTasks(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    if (autoFetch) {
      fetchHighPriorityTasks();
    }
  }, [autoFetch, fetchHighPriorityTasks]);

  return {
    tasks,
    loading,
    error,
    fetchHighPriorityTasks,
    refresh: fetchHighPriorityTasks
  };
};

/**
 * Hook to fetch task statistics
 * @param {string} userId - User UUID (optional)
 * @param {boolean} autoFetch - Whether to auto-fetch on mount (default: true)
 * @returns {Object} - Task statistics data
 */
export const useTaskStatistics = (userId = null, autoFetch = true) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveUserId = userId || getCurrentUserId();

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTaskStatistics(effectiveUserId);
      setStatistics(data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    if (autoFetch) {
      fetchStatistics();
    }
  }, [autoFetch, fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    fetchStatistics,
    refresh: fetchStatistics
  };
};

export default {
  useTasks,
  useTask,
  useTaskOperations,
  useTasksByStatus,
  useOverdueTasks,
  useUpcomingTasks,
  useHighPriorityTasks,
  useTaskStatistics
};
