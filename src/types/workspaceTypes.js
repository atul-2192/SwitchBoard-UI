/**
 * Workspace Service API Types
 * Based on API Contract v1.0.0
 * Last Updated: January 3, 2026
 */

// ============================================
// ENUM TYPES
// ============================================

/**
 * Workspace Type Enum
 * @typedef {'PRIVATE' | 'PUBLIC'} WorkspaceType
 */
export const WorkspaceType = {
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC'
};

/**
 * Access Level Enum
 * @typedef {'VIEWER' | 'EDITOR' | 'ADMIN'} AccessLevel
 */
export const AccessLevel = {
  VIEWER: 'VIEWER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
};

/**
 * Assignment Type Enum
 * @typedef {'HOMEWORK' | 'PROJECT' | 'QUIZ' | 'EXAM' | 'PRACTICE' | 'READING'} AssignmentType
 */
export const AssignmentType = {
  HOMEWORK: 'HOMEWORK',
  PROJECT: 'PROJECT',
  QUIZ: 'QUIZ',
  EXAM: 'EXAM',
  PRACTICE: 'PRACTICE',
  READING: 'READING'
};

/**
 * Task Status Enum
 * @typedef {'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'} TaskStatus
 */
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

/**
 * Error Code Enum
 * @typedef {'RESOURCE_NOT_FOUND' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'UNEXPECTED_ERROR' | 'INTERNAL_SERVER_ERROR'} ErrorCode
 */
export const ErrorCode = {
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};

// ============================================
// RESPONSE TYPES (JSDoc)
// ============================================

/**
 * Generic API Response
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Human-readable message
 * @property {*} data - Response payload (can be null)
 * @property {string|null} errorCode - Error code if failed
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {string} path - API endpoint path
 */

/**
 * API Error Response
 * @typedef {Object} ApiError
 * @property {false} success - Always false for errors
 * @property {string} message - Error message
 * @property {null} data - Always null for errors
 * @property {ErrorCode} errorCode - Specific error code
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {string} path - API endpoint path
 */

/**
 * Workspace Response
 * @typedef {Object} WorkspaceResponse
 * @property {string} id - Workspace UUID
 * @property {string} name - Workspace name (max 255 chars)
 * @property {string|null} description - Workspace description (max 5000 chars)
 * @property {WorkspaceType} workspaceType - PRIVATE or PUBLIC
 * @property {string} ownerUserId - Owner's UUID
 * @property {string[]} accessUserIds - Array of user UUIDs with access
 * @property {number} userAccessCount - Number of users with access
 * @property {string} createdAt - ISO 8601 datetime
 * @property {string} updatedAt - ISO 8601 datetime
 */

/**
 * Assignment Response
 * @typedef {Object} AssignmentResponse
 * @property {string} id - Assignment UUID
 * @property {string} title - Assignment title (max 255 chars)
 * @property {string|null} description - Assignment description (max 5000 chars)
 * @property {AssignmentType} assignmentTypeKey - Type of assignment
 * @property {number|null} totalRewardPoints - Total reward points
 * @property {number|null} totalEstimatedHours - Estimated hours
 * @property {string|null} deadline - ISO 8601 datetime
 * @property {number} totalTasks - Total number of tasks
 * @property {number} completedTasks - Number of completed tasks
 * @property {number} pendingTasks - Number of pending tasks
 * @property {number} completionPercentage - Completion percentage (0-100)
 * @property {string} createdAt - ISO 8601 datetime
 * @property {string} updatedAt - ISO 8601 datetime
 * @property {string} createdBy - Creator's UUID
 * @property {string|null} updatedBy - Updater's UUID
 * @property {TaskResponse[]|null} tasks - Array of tasks (can be null)
 */

/**
 * Task Response
 * @typedef {Object} TaskResponse
 * @property {string} id - Task UUID
 * @property {string|null} assignmentId - Parent assignment UUID
 * @property {string|null} assigneeUserId - Assignee's UUID
 * @property {string|null} reporterUserId - Reporter's UUID
 * @property {string} title - Task title (max 255 chars)
 * @property {string|null} description - Task description (max 5000 chars)
 * @property {TaskStatus} statusKey - Current status
 * @property {number|null} priority - Priority (1-5)
 * @property {number|null} rewardPoints - Reward points
 * @property {number|null} estimatedHours - Estimated hours
 * @property {string|null} titleColor - Hex color code
 * @property {string|null} deadline - ISO 8601 datetime
 * @property {string|null} startedAt - ISO 8601 datetime
 * @property {string|null} completedAt - ISO 8601 datetime
 * @property {string} createdAt - ISO 8601 datetime
 * @property {string} updatedAt - ISO 8601 datetime
 * @property {number} orderNumber - Display order
 * @property {string|null} topic - Task topic/category
 * @property {number|null} commentCount - Number of comments
 */

/**
 * Sort Info
 * @typedef {Object} SortInfo
 * @property {boolean} sorted - Whether results are sorted
 * @property {boolean} unsorted - Whether results are unsorted
 * @property {boolean} empty - Whether sort is empty
 */

/**
 * Pageable Info
 * @typedef {Object} PageableInfo
 * @property {SortInfo} sort - Sort information
 * @property {number} pageNumber - Current page (0-indexed)
 * @property {number} pageSize - Items per page
 * @property {number} offset - Current offset
 * @property {boolean} paged - Whether pagination is enabled
 * @property {boolean} unpaged - Whether pagination is disabled
 */

/**
 * Pageable Response
 * @typedef {Object} PageableResponse
 * @property {Array} content - Page content
 * @property {PageableInfo} pageable - Pagination info
 * @property {number} totalPages - Total number of pages
 * @property {number} totalElements - Total number of elements
 * @property {boolean} last - Whether this is the last page
 * @property {boolean} first - Whether this is the first page
 * @property {number} numberOfElements - Number of elements in current page
 * @property {number} size - Page size
 * @property {number} number - Current page number
 * @property {SortInfo} sort - Sort information
 * @property {boolean} empty - Whether page is empty
 */

// ============================================
// REQUEST TYPES (JSDoc)
// ============================================

/**
 * Workspace Create Request
 * @typedef {Object} WorkspaceCreateRequest
 * @property {string} name - Workspace name (required, max 255 chars)
 * @property {string} [description] - Workspace description (max 5000 chars)
 * @property {WorkspaceType} [workspaceType] - PRIVATE or PUBLIC
 */

/**
 * Task DTO
 * @typedef {Object} TaskDto
 * @property {string} title - Task title (required, max 255 chars)
 * @property {string} [description] - Task description (max 5000 chars)
 * @property {number} [priority] - Priority (1-5)
 * @property {number} [rewardPoints] - Reward points
 * @property {number} [estimatedHours] - Estimated hours
 * @property {TaskStatus} [statusKey] - Task status
 * @property {string} [titleColor] - Hex color code
 * @property {string} [deadline] - ISO 8601 datetime
 * @property {string} [topic] - Task topic/category
 */

/**
 * Task Create Request
 * @typedef {Object} TaskCreateRequest
 * @property {string} [assigneeUserId] - Assignee's UUID
 * @property {string} [reporterUserId] - Reporter's UUID
 * @property {TaskDto[]} tasks - Array of task DTOs
 */

/**
 * Assignment Create Request
 * @typedef {Object} AssignmentCreateRequest
 * @property {string} workspaceId - Workspace UUID (required)
 * @property {string} title - Assignment title (required, max 255 chars)
 * @property {string} [description] - Assignment description (max 5000 chars)
 * @property {AssignmentType} assignmentTypeKey - Assignment type (required)
 * @property {number} [totalRewardPoints] - Total reward points
 * @property {number} [totalEstimatedHours] - Estimated hours
 * @property {string} [deadline] - ISO 8601 datetime
 * @property {TaskCreateRequest} [newTasks] - Tasks to create with assignment
 */

/**
 * Assignment Update Request
 * @typedef {Object} AssignmentUpdateRequest
 * @property {string} [title] - Updated title (max 255 chars)
 * @property {string} [description] - Updated description (max 5000 chars)
 * @property {AssignmentType} [assignmentTypeKey] - Updated type
 * @property {number} [totalRewardPoints] - Updated reward points
 * @property {number} [totalEstimatedHours] - Updated estimated hours
 * @property {string} [deadline] - Updated deadline (ISO 8601 datetime)
 */

/**
 * Task Update Request
 * @typedef {Object} TaskUpdateRequest
 * @property {string} [assigneeUserId] - Assignee's UUID
 * @property {string} [reporterUserId] - Reporter's UUID
 * @property {TaskDto[]} tasks - Array of task updates
 */

/**
 * Remove Tasks Request
 * @typedef {Object} RemoveTasksRequest
 * @property {string[]} taskIds - Array of task UUIDs to remove
 */

/**
 * Roadmap Data
 * @typedef {Object} RoadmapData
 * @property {string} title - Roadmap title
 * @property {string} description - Roadmap description
 * @property {TaskDto[]} tasks - Array of tasks
 */

/**
 * Roadmap Assignment Request
 * @typedef {Object} RoadmapAssignmentRequest
 * @property {string} workspaceId - Workspace UUID
 * @property {RoadmapData} roadmapData - Roadmap data
 */

// ============================================
// HELPER TYPES
// ============================================

/**
 * Pagination Parameters
 * @typedef {Object} PaginationParams
 * @property {number} [page] - Page number (0-indexed, default: 0)
 * @property {number} [size] - Page size (default: 20)
 * @property {string} [sort] - Sort field and direction (e.g., 'createdAt,desc')
 */

/**
 * User Header
 * @typedef {Object} UserHeader
 * @property {string} userId - User UUID for X-User-Id header
 */

// ============================================
// EXPORTS
// ============================================

export default {
  WorkspaceType,
  AccessLevel,
  AssignmentType,
  TaskStatus,
  ErrorCode
};
