import React, { useState, useEffect, useCallback } from 'react';
import KanbanBoard from '../../Components/KanbanBoard/KanbanBoard';
import WorkspaceSelector from '../../Components/KanbanBoard/WorkspaceSelector';
import EditTaskModal from '../../Components/KanbanBoard/EditTaskModal';
import FloatingCreateButton from '../../Components/FloatingCreateButton/FloatingCreateButton';
import { assignmentService } from '../../services/assignmentService';
import './KanbanPage.css';

const KanbanPage = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    backlog: 0,
    inProgress: 0,
    completed: 0
  });

  const [filters, setFilters] = useState({
    workspace: '',
    assignment: '',
    status: [],
    priority: [],
    search: '',
    sort: 'updatedAt',
    order: 'desc'
  });

  // Load stats when assignment changes
  useEffect(() => {
    const loadStats = async () => {
      if (!selectedAssessment) {
        setStats({ total: 0, backlog: 0, inProgress: 0, completed: 0 });
        return;
      }

      try {
        const tasks = await assignmentService.getTasksByAssignment(selectedAssessment);
        const newStats = {
          total: tasks.length,
          backlog: tasks.filter(t => !t.statusKey || t.statusKey === 'BACKLOG').length,
          inProgress: tasks.filter(t => t.statusKey === 'ONGOING').length,
          completed: tasks.filter(t => t.statusKey === 'COMPLETED').length
        };
        setStats(newStats);
      } catch (error) {

        // Clear stats on error - no fallback data
        setStats({ total: 0, backlog: 0, inProgress: 0, completed: 0 });
      }
    };

    loadStats();
  }, [selectedAssessment, refreshTrigger]);

  const handleWorkspaceChange = useCallback((workspaceId) => {


    setSelectedWorkspace(workspaceId);

    setSelectedAssessment(''); // Reset assessment when workspace changes
    setFilters(prev => ({ 
      ...prev, 
      workspace: workspaceId,
      assignment: '' // Reset assignment filter when workspace changes
    }));
  }, [selectedWorkspace]); // Include selectedWorkspace in deps for logging

  const handleAssessmentChange = useCallback((assessmentId) => {
    setSelectedAssessment(assessmentId);
    setFilters(prev => ({
      ...prev,
      assignment: assessmentId
    }));
  }, []);

  const handleCreateSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Delete task logic would go here
      // await workspaceService.deleteTask(taskId);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {

    }
  };

  return (
    <div className="kanban-page">
      {/* Banner Section */}
      <div className="kanban-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1 className="page-title">The Modern Workspace for Ambitious Teams.</h1>
            <h2 className="page-subtitle">Built for creators and teams who want clarity, speed, and control over their work.</h2>
            <p className="page-description">
              SwitchBoard helps you organize tasks, track progress, and execute with purpose—beautifully and efficiently.
            </p>
          </div>
          <div className="banner-actions">
            <WorkspaceSelector
              selectedWorkspace={selectedWorkspace}
              onWorkspaceChange={handleWorkspaceChange}
              onAssessmentChange={handleAssessmentChange}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {selectedWorkspace && (
        <div className="kanban-stats">
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.total}</h3>
                <p>Total Tasks</p>
              </div>
            </div>
            <div className="stat-card backlog">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{stats.backlog}</h3>
                <p>Backlog</p>
              </div>
            </div>
            <div className="stat-card in-progress">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <h3>{stats.inProgress}</h3>
                <p>In Progress</p>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.completed}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="kanban-main">
        <KanbanBoard 
          workspaceId={selectedWorkspace}
          assignmentId={selectedAssessment}
          filters={filters}
          refreshTrigger={refreshTrigger}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        task={editingTask}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Floating Create Button */}
      <FloatingCreateButton onSuccess={handleCreateSuccess} />
    </div>
  );
};

export default KanbanPage;