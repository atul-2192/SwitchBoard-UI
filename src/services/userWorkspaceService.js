import { workspaceService } from './workspaceService';

/**
 * Service for managing user's default workspace
 * 
 * ⚠️ IMPORTANT: According to the API contract, workspaces CANNOT be manually created.
 * The backend automatically creates a default workspace when activateDefaultWorkspace() is called.
 * 
 * ⚠️ API GATEWAY: The API Gateway (port 8080) automatically extracts user ID from JWT token.
 * No need to manually pass user IDs - the gateway adds X-User-Id header automatically.
 */
export const userWorkspaceService = {
  
  /**
   * Initialize user's default workspace (call on first login/signup)
   * This will activate the user's default workspace created by the backend.
   * API Gateway automatically extracts user ID from JWT token.
   */
  async initializeUserWorkspaces() {
    try {
      // First, check if user already has workspaces
      // API Gateway will automatically add user ID from JWT
      const userWorkspaces = await workspaceService.getCurrentUserWorkspaces();
      
      // If user already has workspaces, just return them
      if (userWorkspaces && userWorkspaces.length > 0) {
        return this.sortWorkspacesByType(userWorkspaces);
      }

      // ✅ Use the ONLY valid way to create workspace according to API contract
      // This activates the default workspace (backend creates it automatically)
      // Note: activateDefaultWorkspace still needs userId parameter in URL path
      // We'll need to get it from localStorage or context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        throw new Error('User ID not found. Please login first.');
      }

      await workspaceService.activateDefaultWorkspace(user.id);

      // Fetch the newly created default workspace
      const newWorkspaces = await workspaceService.getCurrentUserWorkspaces();
      return this.sortWorkspacesByType(newWorkspaces);
      
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get user's workspaces in the correct order
   * API Gateway automatically adds user ID from JWT token
   */
  async getUserWorkspaces() {
    try {
      const userWorkspaces = await workspaceService.getWorkspacesByOwner();
      return this.sortWorkspacesByType(userWorkspaces);
    } catch (error) {

      return [];
    }
  },

  /**
   * Sort workspaces (simple sort by creation date)
   * Note: Backend determines workspace configuration
   */
  sortWorkspacesByType(workspaces) {
    if (!workspaces || workspaces.length === 0) return [];
    
    // Sort by creation date (newest first)
    return workspaces.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  },

  /**
   * ⚠️ DEPRECATED - Workspace types are determined by backend
   * This method is kept for backward compatibility but may return generic info
   */
  getWorkspaceTypeInfo(type) {
    // Return generic workspace info since backend controls workspace configuration
    return {
      icon: '📁',
      name: type || 'Workspace',
      color: '#6B7C93',
      description: 'Workspace'
    };
  },

  /**
   * Create a new assignment in a workspace
   */
  async createAssignment(workspaceId, assignmentData) {
    try {
      return await workspaceService.createAssignment({
        ...assignmentData,
        workspaceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {

      throw error;
    }
  },

  /**
   * Create a new task in a workspace
   */
  async createTask(workspaceId, taskData, assignmentId = null) {
    try {
      return await workspaceService.createTask({
        ...taskData,
        workspaceId,
        assignmentId,
        status: taskData.status || 'BACKLOG',
        priority: taskData.priority || 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get assignments for a workspace
   */
  async getWorkspaceAssignments(workspaceId) {
    try {
      return await workspaceService.getAssignmentsByWorkspace(workspaceId);
    } catch (error) {

      return [];
    }
  },

  /**
   * ⚠️ REMOVED - Cannot manually create workspaces per API contract
   * Workspaces are created automatically by the backend via activateDefaultWorkspace()
   * 
   * @deprecated Workspace creation limits are not applicable
   */
  async canCreateWorkspace(userId) {

    return false; // Manual workspace creation not allowed
  },

  /**
   * Get workspace statistics
   * Note: Tasks are fetched by assignment, not workspace
   * This only returns assignment count
   */
  async getWorkspaceStats(workspaceId) {
    try {
      const assignments = await this.getWorkspaceAssignments(workspaceId);

      return {
        totalTasks: 0, // Tasks should be fetched by assignment ID
        totalAssignments: assignments.length,
        tasksByStatus: { backlog: 0, ongoing: 0, completed: 0 },
        completionRate: 0
      };
    } catch (error) {

      return {
        totalTasks: 0,
        totalAssignments: 0,
        tasksByStatus: { backlog: 0, ongoing: 0, completed: 0 },
        completionRate: 0
      };
    }
  }
};

export default userWorkspaceService;