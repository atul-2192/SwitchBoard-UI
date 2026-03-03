/**
 * Assignment Service
 * Production-ready API client for Assignment Management
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

class AssignmentService {
  constructor() {
    this.basePath = '/assignments';
  }

  // ============================================
  // ASSIGNMENT CRUD OPERATIONS
  // ============================================

  /**
   * Create a new assignment
   * POST /api/v1/assignments
   * @param {AssignmentCreateRequest} assignmentData - Assignment data
   * @returns {Promise<ApiResponse<AssignmentResponse>>}
   */
  async createAssignment(assignmentData) {
    try {
      const endpoint = this.basePath;
      logApiRequest('POST', endpoint, assignmentData);

      const response = await apiClient.post(endpoint, assignmentData);
      
      logApiResponse('POST', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('POST', this.basePath, apiError);
      throw apiError;
    }
  }

  /**
   * Get assignment by ID
   * GET /api/v1/assignments/{id}
   * @param {string} assignmentId - Assignment UUID
   * @returns {Promise<AssignmentResponse>}
   */
  async getAssignmentById(assignmentId) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const endpoint = `${this.basePath}/${assignmentId}`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/${assignmentId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Get all assignments (paginated)
   * GET /api/v1/assignments?page=0&size=20&sort=createdAt,desc
   * @param {PaginationParams} params - Pagination parameters
   * @returns {Promise<PageableResponse<AssignmentResponse>>}
   */
  async getAllAssignments(params = {}) {
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
   * Get assignments by workspace
   * GET /api/v1/assignments/workspace/{workspaceId}
   * @param {string} workspaceId - Workspace UUID
   * @returns {Promise<AssignmentResponse[]>}
   */
  async getAssignmentsByWorkspace(workspaceId) {
    try {
      if (!isValidUUID(workspaceId)) {
        throw new Error('Invalid workspace ID format');
      }

      const endpoint = `${this.basePath}/workspace/${workspaceId}`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/workspace/${workspaceId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Get overdue assignments
   * GET /api/v1/assignments/overdue
   * @returns {Promise<AssignmentResponse[]>}
   */
  async getOverdueAssignments() {
    try {
      const endpoint = `${this.basePath}/overdue`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/overdue`, apiError);
      throw apiError;
    }
  }

  /**
   * Update assignment
   * PUT /api/v1/assignments/{id}
   * @param {string} assignmentId - Assignment UUID
   * @param {AssignmentUpdateRequest} updateData - Update data
   * @returns {Promise<ApiResponse<AssignmentResponse>>}
   */
  async updateAssignment(assignmentId, updateData) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const endpoint = `${this.basePath}/${assignmentId}`;
      logApiRequest('PUT', endpoint, updateData);

      const response = await apiClient.put(endpoint, updateData);
      
      logApiResponse('PUT', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('PUT', `${this.basePath}/${assignmentId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Delete assignment
   * DELETE /api/v1/assignments/{id}
   * @param {string} assignmentId - Assignment UUID
   * @returns {Promise<ApiResponse>}
   */
  async deleteAssignment(assignmentId) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const endpoint = `${this.basePath}/${assignmentId}`;
      logApiRequest('DELETE', endpoint);

      const response = await apiClient.delete(endpoint);
      
      logApiResponse('DELETE', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('DELETE', `${this.basePath}/${assignmentId}`, apiError);
      throw apiError;
    }
  }

  // ============================================
  // ASSIGNMENT-TASK RELATIONSHIP
  // ============================================

  /**
   * Get tasks by assignment
   * GET /api/v1/assignments/{id}/tasks
   * @param {string} assignmentId - Assignment UUID
   * @returns {Promise<TaskResponse[]>}
   */
  async getTasksByAssignment(assignmentId) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const endpoint = `${this.basePath}/${assignmentId}/tasks`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      // Log detailed response information







      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/${assignmentId}/tasks`, apiError);
      throw apiError;
    }
  }

  /**
   * Add tasks to assignment
   * POST /api/v1/assignments/{id}/tasks
   * @param {string} assignmentId - Assignment UUID
   * @param {TaskCreateRequest} taskData - Task data
   * @returns {Promise<ApiResponse>}
   */
  async addTasksToAssignment(assignmentId, taskData) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const endpoint = `${this.basePath}/${assignmentId}/tasks`;
      logApiRequest('POST', endpoint, taskData);

      const response = await apiClient.post(endpoint, taskData);
      
      logApiResponse('POST', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('POST', `${this.basePath}/${assignmentId}/tasks`, apiError);
      throw apiError;
    }
  }

  /**
   * Remove tasks from assignment
   * DELETE /api/v1/assignments/{id}/tasks
   * @param {string} assignmentId - Assignment UUID
   * @param {RemoveTasksRequest} taskIds - Task IDs to remove
   * @returns {Promise<ApiResponse>}
   */
  async removeTasksFromAssignment(assignmentId, taskIds) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const endpoint = `${this.basePath}/${assignmentId}/tasks`;
      logApiRequest('DELETE', endpoint, { taskIds });

      const response = await apiClient.delete(endpoint, {
        data: { taskIds }
      });
      
      logApiResponse('DELETE', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('DELETE', `${this.basePath}/${assignmentId}/tasks`, apiError);
      throw apiError;
    }
  }

  // ============================================
  // USER ASSIGNMENT OPERATIONS
  // ============================================

  /**
   * Assign users to all tasks in assignment
   * POST /api/v1/assignments/{id}/assign-users?userIds={id1}&userIds={id2}
   * @param {string} assignmentId - Assignment UUID
   * @param {string[]} userIds - Array of user UUIDs
   * @param {string} currentUserId - User performing the assignment (for X-User-Id header)
   * @returns {Promise<ApiResponse>}
   */
  async assignUsersToAllTasks(assignmentId, userIds, currentUserId = null) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const queryString = buildQueryString({ userIds });
      const endpoint = `${this.basePath}/${assignmentId}/assign-users${queryString}`;
      const headers = createUserHeaders(currentUserId);
      
      logApiRequest('POST', endpoint, { userIds, headers });

      const response = await apiClient.post(endpoint, null, { headers });
      
      logApiResponse('POST', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('POST', `${this.basePath}/${assignmentId}/assign-users`, apiError);
      throw apiError;
    }
  }

  /**
   * Unassign users from all tasks in assignment
   * DELETE /api/v1/assignments/{id}/unassign-users?userIds={id1}&userIds={id2}
   * @param {string} assignmentId - Assignment UUID
   * @param {string[]} userIds - Array of user UUIDs
   * @returns {Promise<ApiResponse>}
   */
  async unassignUsersFromAllTasks(assignmentId, userIds) {
    try {
      if (!isValidUUID(assignmentId)) {
        throw new Error('Invalid assignment ID format');
      }

      const queryString = buildQueryString({ userIds });
      const endpoint = `${this.basePath}/${assignmentId}/unassign-users${queryString}`;
      
      logApiRequest('DELETE', endpoint, { userIds });

      const response = await apiClient.delete(endpoint);
      
      logApiResponse('DELETE', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('DELETE', `${this.basePath}/${assignmentId}/unassign-users`, apiError);
      throw apiError;
    }
  }

  // ============================================
  // CONVENIENCE METHODS
  // ============================================

  /**
   * Get assignment with all tasks
   * @param {string} assignmentId - Assignment UUID
   * @returns {Promise<Object>} - Assignment with tasks array
   */
  async getAssignmentWithTasks(assignmentId) {
    try {
      const [assignment, tasks] = await Promise.all([
        this.getAssignmentById(assignmentId),
        this.getTasksByAssignment(assignmentId)
      ]);

      return {
        ...assignment,
        tasks
      };
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Create assignment with tasks in one call
   * @param {AssignmentCreateRequest} assignmentData - Assignment and task data
   * @returns {Promise<ApiResponse<AssignmentResponse>>}
   */
  async createAssignmentWithTasks(assignmentData) {
    return this.createAssignment(assignmentData);
  }

  /**
   * Get assignments by type
   * @param {string} workspaceId - Workspace UUID
   * @param {AssignmentType} assignmentType - Assignment type
   * @returns {Promise<AssignmentResponse[]>}
   */
  async getAssignmentsByType(workspaceId, assignmentType) {
    try {
      const assignments = await this.getAssignmentsByWorkspace(workspaceId);
      return assignments.filter(a => a.assignmentTypeKey === assignmentType);
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Get assignments by completion status
   * @param {string} workspaceId - Workspace UUID
   * @param {boolean} completed - Filter by completion status
   * @returns {Promise<AssignmentResponse[]>}
   */
  async getAssignmentsByCompletion(workspaceId, completed = false) {
    try {
      const assignments = await this.getAssignmentsByWorkspace(workspaceId);
      return assignments.filter(a => 
        completed ? a.completionPercentage === 100 : a.completionPercentage < 100
      );
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Get upcoming assignments (with deadlines)
   * @param {string} workspaceId - Workspace UUID
   * @param {number} daysAhead - Number of days to look ahead
   * @returns {Promise<AssignmentResponse[]>}
   */
  async getUpcomingAssignments(workspaceId, daysAhead = 7) {
    try {
      const assignments = await this.getAssignmentsByWorkspace(workspaceId);
      const now = new Date();
      const futureDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));

      return assignments.filter(a => {
        if (!a.deadline) return false;
        const deadline = new Date(a.deadline);
        return deadline >= now && deadline <= futureDate;
      }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Add single task to assignment
   * @param {string} assignmentId - Assignment UUID
   * @param {TaskDto} task - Single task data
   * @param {string} assigneeUserId - Assignee UUID
   * @param {string} reporterUserId - Reporter UUID
   * @returns {Promise<ApiResponse>}
   */
  async addSingleTask(assignmentId, task, assigneeUserId = null, reporterUserId = null) {
    const taskData = {
      assigneeUserId,
      reporterUserId,
      tasks: [task]
    };

    return this.addTasksToAssignment(assignmentId, taskData);
  }
}

// Create and export singleton instance
const assignmentService = new AssignmentService();
export { assignmentService };
export default assignmentService;
