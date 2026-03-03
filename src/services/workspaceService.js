/**
 * Workspace Service
 * Production-ready API client for Workspace Management
 * Based on API Contract v1.0.0
 * 
 * ⚠️ IMPORTANT: This service ONLY implements endpoints from the official API contract.
 * There is NO CREATE or UPDATE workspace endpoint in the contract.
 * Use activateDefaultWorkspace() for new users.
 */

import { apiClient } from './apiClient';
import {
  handleApiError,
  extractResponseData,
  buildQueryString,
  createUserHeaders,
  logApiRequest,
  logApiResponse,
  logApiError,
  isValidUUID
} from '../utils/apiUtils';

class WorkspaceService {
  constructor() {
    this.basePath = '/workspaces';
  }

  // ============================================
  // WORKSPACE MANAGEMENT
  // ============================================

  /**
   * Activate default workspace for a user (upon first login/account creation)
   * POST /api/v1/workspaces/activate/{userId}
   * 
   * ⚠️ This is the ONLY way to create workspaces according to the API contract.
   * There is no manual workspace creation endpoint.
   * 
   * @param {string} userId - User UUID
   * @returns {Promise<ApiResponse>}
   */
  async activateDefaultWorkspace(userId) {
    try {
      if (!isValidUUID(userId)) {
        throw new Error('Invalid user ID format');
      }

      const endpoint = `${this.basePath}/activate/${userId}`;
      logApiRequest('POST', endpoint);

      const response = await apiClient.post(endpoint);
      
      logApiResponse('POST', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('POST', `${this.basePath}/activate/${userId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Get workspace by ID
   * GET /api/v1/workspaces/{id}
   * @param {string} workspaceId - Workspace UUID
   * @returns {Promise<WorkspaceResponse>}
   */
  async getWorkspaceById(workspaceId) {
    try {
      if (!isValidUUID(workspaceId)) {
        throw new Error('Invalid workspace ID format');
      }

      const endpoint = `${this.basePath}/${workspaceId}`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data; // Direct entity response
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/${workspaceId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Get workspaces owned by current user
   * GET /api/v1/workspaces/owner
   * API Gateway automatically adds X-User-Id from JWT token
   * @returns {Promise<WorkspaceResponse[]>}
   */
  async getWorkspacesByOwner() {
    try {
      const endpoint = `${this.basePath}/owner`;
      
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data; // Array of workspaces
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/owner`, apiError);
      throw apiError;
    }
  }

  /**
   * Get accessible workspaces (owned + shared)
   * GET /api/v1/workspaces/accessible
   * API Gateway automatically adds X-User-Id from JWT token
   * @returns {Promise<WorkspaceResponse[]>}
   */
  async getAccessibleWorkspaces() {
    try {
      const endpoint = `${this.basePath}/accessible`;
      
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data; // Array of workspaces
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/accessible`, apiError);
      throw apiError;
    }
  }

  /**
   * Delete workspace
   * DELETE /api/v1/workspaces/{id}
   * @param {string} workspaceId - Workspace UUID
   * @returns {Promise<ApiResponse>}
   */
  async deleteWorkspace(workspaceId) {
    try {
      if (!isValidUUID(workspaceId)) {
        throw new Error('Invalid workspace ID format');
      }

      const endpoint = `${this.basePath}/${workspaceId}`;
      logApiRequest('DELETE', endpoint);

      const response = await apiClient.delete(endpoint);
      
      logApiResponse('DELETE', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('DELETE', `${this.basePath}/${workspaceId}`, apiError);
      throw apiError;
    }
  }

  // ============================================
  // USER ACCESS MANAGEMENT
  // ============================================

  /**
   * Add user to workspace
   * POST /api/v1/workspaces/{workspaceId}/users/{userId}?accessLevel={level}
   * @param {string} workspaceId - Workspace UUID
   * @param {string} userId - User UUID to add
   * @param {AccessLevel} accessLevel - Access level (VIEWER, EDITOR, ADMIN)
   * @returns {Promise<ApiResponse>}
   */
  async addUserToWorkspace(workspaceId, userId, accessLevel) {
    try {
      if (!isValidUUID(workspaceId) || !isValidUUID(userId)) {
        throw new Error('Invalid workspace ID or user ID format');
      }

      const queryString = buildQueryString({ accessLevel });
      const endpoint = `${this.basePath}/${workspaceId}/users/${userId}${queryString}`;
      
      logApiRequest('POST', endpoint);

      const response = await apiClient.post(endpoint);
      
      logApiResponse('POST', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('POST', `${this.basePath}/${workspaceId}/users/${userId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Remove user from workspace
   * DELETE /api/v1/workspaces/{workspaceId}/users/{userId}
   * @param {string} workspaceId - Workspace UUID
   * @param {string} userId - User UUID to remove
   * @returns {Promise<ApiResponse>}
   */
  async removeUserFromWorkspace(workspaceId, userId) {
    try {
      if (!isValidUUID(workspaceId) || !isValidUUID(userId)) {
        throw new Error('Invalid workspace ID or user ID format');
      }

      const endpoint = `${this.basePath}/${workspaceId}/users/${userId}`;
      logApiRequest('DELETE', endpoint);

      const response = await apiClient.delete(endpoint);
      
      logApiResponse('DELETE', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('DELETE', `${this.basePath}/${workspaceId}/users/${userId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Update user access level
   * PUT /api/v1/workspaces/{workspaceId}/users/{userId}/access?accessLevel={level}
   * @param {string} workspaceId - Workspace UUID
   * @param {string} userId - User UUID
   * @param {AccessLevel} accessLevel - New access level
   * @returns {Promise<ApiResponse>}
   */
  async updateUserAccessLevel(workspaceId, userId, accessLevel) {
    try {
      if (!isValidUUID(workspaceId) || !isValidUUID(userId)) {
        throw new Error('Invalid workspace ID or user ID format');
      }

      const queryString = buildQueryString({ accessLevel });
      const endpoint = `${this.basePath}/${workspaceId}/users/${userId}/access${queryString}`;
      
      logApiRequest('PUT', endpoint);

      const response = await apiClient.put(endpoint);
      
      logApiResponse('PUT', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('PUT', `${this.basePath}/${workspaceId}/users/${userId}/access`, apiError);
      throw apiError;
    }
  }

  /**
   * Get workspace users
   * GET /api/v1/workspaces/{workspaceId}/users
   * @param {string} workspaceId - Workspace UUID
   * @returns {Promise<string[]>} - Array of user UUIDs
   */
  async getWorkspaceUsers(workspaceId) {
    try {
      if (!isValidUUID(workspaceId)) {
        throw new Error('Invalid workspace ID format');
      }

      const endpoint = `${this.basePath}/${workspaceId}/users`;
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data; // Array of user UUIDs
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `${this.basePath}/${workspaceId}/users`, apiError);
      throw apiError;
    }
  }

  // ============================================
  // CONVENIENCE METHODS
  // ============================================

  /**
   * Get current user's workspaces (alias for getWorkspacesByOwner)
   * API Gateway automatically adds user ID from JWT token
   * @returns {Promise<WorkspaceResponse[]>}
   */
  async getCurrentUserWorkspaces() {
    return this.getWorkspacesByOwner();
  }

  /**
   * Get all workspaces accessible to user (owned + shared)
   * API Gateway automatically adds user ID from JWT token
   * @returns {Promise<WorkspaceResponse[]>}
   */
  async getAllUserWorkspaces() {
    return this.getAccessibleWorkspaces();
  }

  /**
   * Check if user has access to workspace
   * @param {string} workspaceId - Workspace UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>}
   */
  async hasUserAccess(workspaceId, userId) {
    try {
      const users = await this.getWorkspaceUsers(workspaceId);
      return users.includes(userId);
    } catch (error) {

      return false;
    }
  }

  /**
   * Get workspace with full details (including users)
   * @param {string} workspaceId - Workspace UUID
   * @returns {Promise<Object>} - Workspace with users array
   */
  async getWorkspaceWithUsers(workspaceId) {
    try {
      const [workspace, users] = await Promise.all([
        this.getWorkspaceById(workspaceId),
        this.getWorkspaceUsers(workspaceId)
      ]);

      return {
        ...workspace,
        users
      };
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  }

  /**
   * Bulk add users to workspace
   * @param {string} workspaceId - Workspace UUID
   * @param {Array<{userId: string, accessLevel: AccessLevel}>} userAccess - Array of user access configs
   * @returns {Promise<Object>} - Results with success and failed arrays
   */
  async bulkAddUsers(workspaceId, userAccess) {
    const results = {
      success: [],
      failed: []
    };

    for (const { userId, accessLevel } of userAccess) {
      try {
        await this.addUserToWorkspace(workspaceId, userId, accessLevel);
        results.success.push(userId);
      } catch (error) {
        results.failed.push({ userId, error: error.message });
      }
    }

    return results;
  }

  /**
   * Bulk remove users from workspace
   * @param {string} workspaceId - Workspace UUID
   * @param {string[]} userIds - Array of user UUIDs
   * @returns {Promise<Object>} - Results with success and failed arrays
   */
  async bulkRemoveUsers(workspaceId, userIds) {
    const results = {
      success: [],
      failed: []
    };

    for (const userId of userIds) {
      try {
        await this.removeUserFromWorkspace(workspaceId, userId);
        results.success.push(userId);
      } catch (error) {
        results.failed.push({ userId, error: error.message });
      }
    }

    return results;
  }

  // ============================================
  // ASSIGNMENT METHODS (DELEGATED)
  // ============================================

  /**
   * Get assignments by workspace
   * Delegates to assignmentService
   * GET /api/v1/assignments/workspace/{workspaceId}
   * @param {string} workspaceId - Workspace UUID
   * @returns {Promise<AssignmentResponse[]>}
   */
  async getAssignmentsByWorkspace(workspaceId) {
    try {
      if (!isValidUUID(workspaceId)) {
        throw new Error('Invalid workspace ID format');
      }

      const endpoint = `/assignments/workspace/${workspaceId}`;
      
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('GET', `/assignments/workspace/${workspaceId}`, apiError);
      throw apiError;
    }
  }

  /**
   * Health check endpoint
   * GET /api/v1/health or /api/v1/ping
   * @returns {Promise<Object>}
   */
  async healthCheck() {
    try {
      const endpoint = '/health';
      logApiRequest('GET', endpoint);

      const response = await apiClient.get(endpoint);
      
      logApiResponse('GET', endpoint, response.data);
      return response.data;
    } catch (error) {
      // Try alternative ping endpoint
      try {
        const pingEndpoint = '/ping';
        const pingResponse = await apiClient.get(pingEndpoint);
        return pingResponse.data;
      } catch (pingError) {
        const apiError = handleApiError(error);
        logApiError('GET', '/health', apiError);
        throw apiError;
      }
    }
  }
}

// Create and export singleton instance
const workspaceService = new WorkspaceService();
export { workspaceService };
export default workspaceService;
