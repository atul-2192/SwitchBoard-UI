/**
 * Centralized exports for all React hooks
 * Import all hooks from a single location
 */

// Workspace hooks
export {
  useWorkspaces,
  useWorkspace,
  useWorkspaceOperations,
  useWorkspaceUsers
} from './useWorkspaces';

// Assignment hooks
export {
  useAssignments,
  useAssignment,
  useAssignmentOperations,
  useOverdueAssignments,
  useUpcomingAssignments
} from './useAssignments';

// Task hooks
export {
  useTasks,
  useTask,
  useTaskOperations,
  useTasksByStatus,
  useOverdueTasks,
  useUpcomingTasks,
  useHighPriorityTasks,
  useTaskStatistics
} from './useTasks';
