/**
 * Roadmap Service
 * Production-ready API client for Roadmap Management
 * Based on API Contract v1.0.0
 */

import { apiClient } from './apiClient';
import {
  handleApiError,
  createUserHeaders,
  logApiRequest,
  logApiResponse,
  logApiError,
  isValidUUID
} from '../utils/apiUtils';

class RoadmapService {
  constructor() {
    this.basePath = '/roadmap';
  }

  // ============================================
  // ROADMAP OPERATIONS
  // ============================================

  /**
   * Add roadmap assignment to workspace
   * POST /api/roadmap/add-assignment
   * @param {RoadmapAssignmentRequest} roadmapData - Roadmap assignment data
   * @param {string} userId - User UUID (optional, auto-fetched if not provided)
   * @returns {Promise<ApiResponse>}
   */
  async addRoadmapAssignment(roadmapData, userId = null) {
    try {
      if (!isValidUUID(roadmapData.workspaceId)) {
        throw new Error('Invalid workspace ID format');
      }

      const endpoint = `${this.basePath}/add-assignment`;
      const headers = createUserHeaders(userId);
      
      logApiRequest('POST', endpoint, { roadmapData, headers });

      const response = await apiClient.post(endpoint, roadmapData, { headers });
      
      logApiResponse('POST', endpoint, response.data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      logApiError('POST', `${this.basePath}/add-assignment`, apiError);
      throw apiError;
    }
  }

  // ============================================
  // CONVENIENCE METHODS
  // ============================================

  /**
   * Create roadmap from template
   * @param {string} workspaceId - Workspace UUID
   * @param {Object} template - Roadmap template
   * @param {string} userId - User UUID (optional)
   * @returns {Promise<ApiResponse>}
   */
  async createRoadmapFromTemplate(workspaceId, template, userId = null) {
    const roadmapData = {
      workspaceId,
      roadmapData: {
        title: template.title || 'Learning Roadmap',
        description: template.description || '',
        tasks: template.tasks || []
      }
    };

    return this.addRoadmapAssignment(roadmapData, userId);
  }

  /**
   * Create custom learning roadmap
   * @param {string} workspaceId - Workspace UUID
   * @param {string} title - Roadmap title
   * @param {string} description - Roadmap description
   * @param {Array<TaskDto>} tasks - Array of tasks
   * @param {string} userId - User UUID (optional)
   * @returns {Promise<ApiResponse>}
   */
  async createCustomRoadmap(workspaceId, title, description, tasks, userId = null) {
    const roadmapData = {
      workspaceId,
      roadmapData: {
        title,
        description,
        tasks
      }
    };

    return this.addRoadmapAssignment(roadmapData, userId);
  }
}

// Create and export singleton instance
const roadmapService = new RoadmapService();
export { roadmapService };
export default roadmapService;
