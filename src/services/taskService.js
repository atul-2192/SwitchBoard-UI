/**
 * Task Service
 * Production-ready API client for Task Management
 * Based on API Contract v1.0.0
 */

import { apiClient } from './apiClient';
import {
  handleApiError,
  buildQueryString,
  createUserHeaders,
  logApiRequest,
  logApiResponse,
  logApiError,
  isValidUUID
} from '../utils/apiUtils';

class TaskService {
  constructor() {
    this.basePath = '/tasks';
  }

  // ============================================
  // TASK CRUD OPERATIONS
  // ============================================

  /**
   * Get task by ID
   * GET /api/v1/tasks/{id}
   * @param {string} taskId - Task UUID
   * @returns {Promise<TaskResponse>}
   */
  async getTaskById(taskId) {
    try {
      if (!isValidUUID(taskId)) {
        throw new Error('Invalid task ID format');
      }

      const endpoint = `${this.basePath}/${taskId}`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/${taskId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Get all tasks (paginated)
   * GET /api/v1/tasks?page=0&size=20&sort=createdAt,desc
   * @param {PaginationParams} params - Pagination parameters
   * @returns {Promise<PageableResponse<TaskResponse>>}
   */
  async getAllTasks(params = {}) {
    try {
      const queryString = buildQueryString(params);
      const endpoint = `${this.basePath}${queryString}`;
      
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', this.basePath, apiError);
      throw apiError;
    }
  }

  /**
   * Get tasks by assignment
   * GET /api/v1/tasks/assignment/{assignmentId}
   * @param {string} assignmentId - Assignment UUID
   * @returns {Promise<TaskResponse[]>}
   */
  async getTasksByAssignment(assignmentId) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const endpoint = `${this.basePath}/assignment/${assignmentId}`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/assignment/${assignmentId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Create a new task
   * POST /api/v1/assignments/{assignmentId}/tasks
   * @param {Object} taskData - Task creation data
   * @param {string} taskData.assignmentId - Assignment UUID
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description (optional)
   * @param {string} taskData.priority - Priority level
   * @param {string} taskData.statusKey - Status key (optional, defaults to TODO)
   * @param {number} taskData.rewardPoints - Reward points (optional)
   * @param {number} taskData.estimatedHours - Estimated hours (optional)
   * @param {string} taskData.deadline - Deadline ISO string (optional)
   * @returns {Promise<TaskResponse>}
   */
  async createTask(taskData) {
    try {
      const { assignmentId, ...restData } = taskData;
      
      if (!assignmentId) {
        throw new Error('Assignment ID is required');
      }

      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      if (!restData.title || !restData.title.trim()) {
        throw new Error('Task title is required');
      }

      const endpoint = `/assignments/${assignmentId}/tasks`;
      logApiRequest('POST', endpoint, restData);

      const response = await apiClient.post(endpoint, restData);
      
      logApiResponse('POST', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('POST', '/assignments/{id}/tasks', apiError);
      throw apiError;
    }
  }

  /**
   * Get tasks assigned to me
   * GET /api/v1/tasks/assigned-to-me
   * @param {string} userId - User UUID (optional, auto-fetched if not provided)
   * @returns {Promise<TaskResponse[]>}
   */
  async getTasksAssignedToMe(userId = null) {
    try {
      const endpoint = `${this.basePath}/assigned-to-me`;
      const headers = createUserHeaders(userId);
      
      logApiRequest('GET', endpoint, headers);

      const response = await apiClient.get(endpoint, { headers });
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/assigned-to-me`, apiError);
      throw apiError;
    }
  }

  /**
   * Get tasks created by me
   * GET /api/v1/tasks/created-by-me
   * @param {string} userId - User UUID (optional, auto-fetched if not provided)
   * @returns {Promise<TaskResponse[]>}
   */
  async getTasksCreatedByMe(userId = null) {
    try {
      const endpoint = `${this.basePath}/created-by-me`;
      const headers = createUserHeaders(userId);
      
      logApiRequest('GET', endpoint, headers);

      const response = await apiClient.get(endpoint, { headers });
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/created-by-me`, apiError);
      throw apiError;
    }
  }

  /**
   * Update task
   * PUT /api/v1/tasks/{id}
   * @param {string} taskId - Task UUID
   * @param {TaskUpdateRequest} updateData - Update data
   * @returns {Promise<ApiResponse<TaskResponse>>}
   */
  async updateTask(taskId, updateData) {
    try {
      if (!isValidUUID(taskId)) {
        throw new Error('Invalid task ID format');
      }

      const endpoint = `${this.basePath}/${taskId}`;
      logApiRequest('PUT', endpoint, updateData);

      const response = await apiClient.put(endpoint, updateData);
      
      logApiResponse('PUT', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('PUT', `${this.basePath}/${taskId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Update task status
   * PUT /api/v1/tasks/{id}/status?status={status}
   * @param {string} taskId - Task UUID
   * @param {TaskStatus} status - New status (TODO, IN_PROGRESS, DONE, CANCELLED)
   * @returns {Promise<ApiResponse<TaskResponse>>}
   */
  async updateTaskStatus(taskId, status) {
    try {
      if (!isValidUUID(taskId)) {
        throw new Error('Invalid task ID format');
      }

      const queryString = buildQueryString({ status });
      const endpoint = `${this.basePath}/${taskId}/status${queryString}`;
      
      logApiRequest('PUT', endpoint, { status });

      const response = await apiClient.put(endpoint);
      
      logApiResponse('PUT', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('PUT', `${this.basePath}/${taskId}/status`, apiError);
      throw apiError;
    }
  }

  /**
   * Assign task to user
   * PUT /api/v1/tasks/{id}/assign?assigneeId={userId}
   * @param {string} taskId - Task UUID
   * @param {string} assigneeId - User UUID to assign
   * @returns {Promise<ApiResponse<TaskResponse>>}
   */
  async assignTask(taskId, assigneeId) {
    try {
      if (!isValidUUID(taskId) || !isValidUUID(assigneeId)) {
        throw new Error('Invalid task ID or assignee ID format');
      }

      const queryString = buildQueryString({ assigneeId });
      const endpoint = `${this.basePath}/${taskId}/assign${queryString}`;
      
      logApiRequest('PUT', endpoint, { assigneeId });

      const response = await apiClient.put(endpoint);
      
      logApiResponse('PUT', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('PUT', `${this.basePath}/${taskId}/assign`, apiError);
      throw apiError;
    }
  }

  /**
   * Delete task
   * DELETE /api/v1/tasks/{id}
   * @param {string} taskId - Task UUID
   * @returns {Promise<ApiResponse>}
   */
  async deleteTask(taskId) {
    try {
      if (!isValidUUID(taskId)) {
        throw new Error('Invalid task ID format');
      }

      const endpoint = `${this.basePath}/${taskId}`;
      logApiRequest('DELETE', endpoint);

      const response = await apiClient.delete(endpoint);
      
      logApiResponse('DELETE', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('DELETE', `${this.basePath}/${taskId}`, apiError);
      throw apiError;
    }
  }

  // ============================================
  // CONVENIENCE METHODS
  // ============================================

  /**
   * Mark task as in progress
   * @param {string} taskId - Task UUID
   * @returns {Promise<ApiResponse<TaskResponse>>}
   */
  async markTaskInProgress(taskId) {
    return this.updateTaskStatus(taskId, 'IN_PROGRESS');
  }

  /**
   * Mark task as completed
   * @param {string} taskId - Task UUID
   * @returns {Promise<ApiResponse<TaskResponse>>}
   */
  async markTaskCompleted(taskId) {
    return this.updateTaskStatus(taskId, 'DONE');
  }

  /**
   * Mark task as todo
   * @param {string} taskId - Task UUID
   * @returns {Promise<ApiResponse<TaskResponse>>}
   */
  async markTaskTodo(taskId) {
    return this.updateTaskStatus(taskId, 'TODO');
  }

  /**
   * Cancel task
   * @param {string} taskId - Task UUID
   * @returns {Promise<ApiResponse<TaskResponse>>}
   */
  async cancelTask(taskId) {
    return this.updateTaskStatus(taskId, 'CANCELLED');
  }

  /**
   * Get tasks by status
   * @param {string} userId - User UUID (optional)
   * @param {TaskStatus} status - Task status
   * @returns {Promise<TaskResponse[]>}
   */
  async getTasksByStatus(userId = null, status) {
    try {
      const tasks = await this.getTasksAssignedToMe(userId);
      return tasks.filter(task => task.statusKey === status);
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Get tasks by priority
   * @param {string} userId - User UUID (optional)
   * @param {number} priority - Priority level (1-5)
   * @returns {Promise<TaskResponse[]>}
   */
  async getTasksByPriority(userId = null, priority) {
    try {
      const tasks = await this.getTasksAssignedToMe(userId);
      return tasks.filter(task => task.priority === priority);
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Get high priority tasks
   * @param {string} userId - User UUID (optional)
   * @returns {Promise<TaskResponse[]>}
   */
  async getHighPriorityTasks(userId = null) {
    try {
      const tasks = await this.getTasksAssignedToMe(userId);
      return tasks.filter(task => task.priority && task.priority >= 4)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Get overdue tasks
   * @param {string} userId - User UUID (optional)
   * @returns {Promise<TaskResponse[]>}
   */
  async getOverdueTasks(userId = null) {
    try {
      const tasks = await this.getTasksAssignedToMe(userId);
      const now = new Date();
      
      return tasks.filter(task => {
        if (!task.deadline) return false;
        return new Date(task.deadline) < now && task.statusKey !== 'DONE';
      }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Get upcoming tasks (with deadlines)
   * @param {string} userId - User UUID (optional)
   * @param {number} daysAhead - Number of days to look ahead
   * @returns {Promise<TaskResponse[]>}
   */
  async getUpcomingTasks(userId = null, daysAhead = 7) {
    try {
      const tasks = await this.getTasksAssignedToMe(userId);
      const now = new Date();
      const futureDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));

      return tasks.filter(task => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        return deadline >= now && deadline <= futureDate && task.statusKey !== 'DONE';
      }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Get tasks by topic
   * @param {string} userId - User UUID (optional)
   * @param {string} topic - Task topic
   * @returns {Promise<TaskResponse[]>}
   */
  async getTasksByTopic(userId = null, topic) {
    try {
      const tasks = await this.getTasksAssignedToMe(userId);
      return tasks.filter(task => task.topic === topic);
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Bulk update task statuses
   * @param {Array<{taskId: string, status: TaskStatus}>} updates - Array of task updates
   * @returns {Promise<Object>} - Results with success and failed arrays
   */
  async bulkUpdateTaskStatuses(updates) {
    const results = {
      success: [],
      failed: []
    };

    for (const { taskId, status } of updates) {
      try {
        await this.updateTaskStatus(taskId, status);
        results.success.push(taskId);
      } catch (error) {
        results.failed.push({ taskId, error: error.message });
      }
    }

    return results;
  }

  /**
   * Bulk assign tasks
   * @param {string[]} taskIds - Array of task UUIDs
   * @param {string} assigneeId - User UUID to assign
   * @returns {Promise<Object>} - Results with success and failed arrays
   */
  async bulkAssignTasks(taskIds, assigneeId) {
    const results = {
      success: [],
      failed: []
    };

    for (const taskId of taskIds) {
      try {
        await this.assignTask(taskId, assigneeId);
        results.success.push(taskId);
      } catch (error) {
        results.failed.push({ taskId, error: error.message });
      }
    }

    return results;
  }

  /**
   * Bulk delete tasks
   * @param {string[]} taskIds - Array of task UUIDs
   * @returns {Promise<Object>} - Results with success and failed arrays
   */
  async bulkDeleteTasks(taskIds) {
    const results = {
      success: [],
      failed: []
    };

    for (const taskId of taskIds) {
      try {
        await this.deleteTask(taskId);
        results.success.push(taskId);
      } catch (error) {
        results.failed.push({ taskId, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get task statistics for user
   * @param {string} userId - User UUID (optional)
   * @returns {Promise<Object>} - Task statistics
   */
  async getTaskStatistics(userId = null) {
    try {
      const tasks = await this.getTasksAssignedToMe(userId);
      
      const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.statusKey === 'TODO').length,
        inProgress: tasks.filter(t => t.statusKey === 'IN_PROGRESS').length,
        done: tasks.filter(t => t.statusKey === 'DONE').length,
        cancelled: tasks.filter(t => t.statusKey === 'CANCELLED').length,
        overdue: 0,
        dueToday: 0,
        dueThisWeek: 0,
        highPriority: tasks.filter(t => t.priority && t.priority >= 4).length,
        totalRewardPoints: tasks.reduce((sum, t) => sum + (t.rewardPoints || 0), 0),
        totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)
      };

      const now = new Date();
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);
      const weekEnd = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

      tasks.forEach(task => {
        if (!task.deadline || task.statusKey === 'DONE') return;
        const deadline = new Date(task.deadline);
        
        if (deadline < now) {
          stats.overdue++;
        } else if (deadline <= todayEnd) {
          stats.dueToday++;
        } else if (deadline <= weekEnd) {
          stats.dueThisWeek++;
        }
      });

      stats.completionRate = stats.total > 0 
        ? Math.round((stats.done / stats.total) * 100) 
        : 0;

      return stats;
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }
}

// Create and export singleton instance
const taskService = new TaskService();
export { taskService };
export default taskService;
