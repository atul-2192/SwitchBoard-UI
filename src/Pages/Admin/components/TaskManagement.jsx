import React, { useState, useEffect } from 'react';
import { workspaceService } from '../../../services/workspaceService';
import { assignmentService } from '../../../services/assignmentService';
import { taskService } from '../../../services/taskService';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [formData, setFormData] = useState({
    workspaceId: '',
    assignmentId: '',
    parentTaskId: '',
    assigneeUserId: '',
    reporterUserId: '',
    title: '',
    description: '',
    taskTypeKey: 'DEVELOPMENT',
    statusKey: 'TODO',
    priority: 3,
    rewardPoints: 0,
    estimatedHours: 0,
    spentHours: 0,
    titleColor: '#2196F3',
    position: 1,
    deadline: '',
    tagIds: []
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadAssignments();
      setSelectedAssignment(''); // Reset assignment when workspace changes
      setTasks([]); // Clear tasks when workspace changes
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    if (selectedAssignment) {
      loadTasks();
    } else {
      setTasks([]); // Clear tasks when no assignment selected
    }
  }, [selectedAssignment]);

  const loadWorkspaces = async () => {
    try {
      const response = await workspaceService.getAllWorkspaces();
      setWorkspaces(response.content || response || []);
    } catch (error) {
      showMessage('Failed to load workspaces', 'error');
    }
  };

  const loadTasks = async () => {
    if (!selectedAssignment) return;
    
    setLoading(true);
    try {
      const tasksData = await assignmentService.getTasksByAssignment(selectedAssignment);
      setTasks(tasksData || []);
    } catch (error) {
      showMessage('Failed to load tasks', 'error');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    if (!selectedWorkspace) return;
    
    try {
      const assignmentsData = await workspaceService.getAssignmentsByWorkspace(selectedWorkspace);
      setAssignments(assignmentsData || []);
    } catch (error) {

      setAssignments([]);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.workspaceId.trim()) {
      errors.workspaceId = 'Workspace is required';
    }

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must be less than 255 characters';
    }

    if (formData.description && formData.description.length > 5000) {
      errors.description = 'Description must be less than 5000 characters';
    }

    if (formData.priority < 1 || formData.priority > 5) {
      errors.priority = 'Priority must be between 1 and 5';
    }

    if (formData.rewardPoints < 0) {
      errors.rewardPoints = 'Reward points cannot be negative';
    }

    if (formData.estimatedHours < 0) {
      errors.estimatedHours = 'Estimated hours cannot be negative';
    }

    if (formData.spentHours < 0) {
      errors.spentHours = 'Spent hours cannot be negative';
    }

    // Validate UUID format for user IDs if provided
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (formData.assigneeUserId && !uuidRegex.test(formData.assigneeUserId)) {
      errors.assigneeUserId = 'Invalid UUID format';
    }

    if (formData.reporterUserId && !uuidRegex.test(formData.reporterUserId)) {
      errors.reporterUserId = 'Invalid UUID format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        priority: parseInt(formData.priority),
        rewardPoints: parseFloat(formData.rewardPoints),
        estimatedHours: parseFloat(formData.estimatedHours),
        spentHours: parseFloat(formData.spentHours),
        position: parseFloat(formData.position),
        deadline: formData.deadline || null,
        assigneeUserId: formData.assigneeUserId || null,
        reporterUserId: formData.reporterUserId || null,
        assignmentId: formData.assignmentId || null,
        parentTaskId: formData.parentTaskId || null
      };

      if (editingTask) {
        await workspaceService.updateTask(editingTask.id, taskData);
        showMessage('Task updated successfully', 'success');
      } else {
        await workspaceService.createTask(taskData);
        showMessage('Task created successfully', 'success');
      }
      
      resetForm();
      await loadTasks();
    } catch (error) {
      showMessage(error.message || 'Failed to save task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      workspaceId: task.workspaceId || '',
      assignmentId: task.assignmentId || '',
      parentTaskId: task.parentTaskId || '',
      assigneeUserId: task.assigneeUserId || '',
      reporterUserId: task.reporterUserId || '',
      title: task.title || '',
      description: task.description || '',
      taskTypeKey: task.taskTypeKey || 'DEVELOPMENT',
      statusKey: task.statusKey || task.status || 'TODO',
      priority: task.priority || 3,
      rewardPoints: task.rewardPoints || 0,
      estimatedHours: task.estimatedHours || 0,
      spentHours: task.spentHours || 0,
      titleColor: task.titleColor || '#2196F3',
      position: task.position || 1,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      tagIds: task.tagIds || []
    });
    setSelectedWorkspace(task.workspaceId);
    setShowForm(true);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await workspaceService.deleteTask(task.id);
      showMessage('Task deleted successfully', 'success');
      await loadTasks();
    } catch (error) {
      showMessage(error.message || 'Failed to delete task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (task, newStatus) => {
    setLoading(true);
    try {
      await workspaceService.updateTaskStatus(task.id, newStatus);
      showMessage('Task status updated successfully', 'success');
      await loadTasks();
    } catch (error) {
      showMessage(error.message || 'Failed to update task status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      workspaceId: selectedWorkspace,
      assignmentId: '',
      parentTaskId: '',
      assigneeUserId: '',
      reporterUserId: '',
      title: '',
      description: '',
      taskTypeKey: 'DEVELOPMENT',
      statusKey: 'TODO',
      priority: 3,
      rewardPoints: 0,
      estimatedHours: 0,
      spentHours: 0,
      titleColor: '#2196F3',
      position: 1,
      deadline: '',
      tagIds: []
    });
    setFormErrors({});
    setEditingTask(null);
    setShowForm(false);
  };

  const getPriorityLabel = (priority) => {
    const labels = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Critical', 5: 'Urgent' };
    return labels[priority] || 'Medium';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'BACKLOG': 'Backlog',
      'TODO': 'To Do',
      'ONGOING': 'In Progress',
      'COMPLETED': 'Completed'
    };
    return labels[status] || status;
  };

  return (
    <div className="task-management">
      {message && (
        <div className={`message message-${message.type}`}>
          <span>{message.type === 'error' ? '❌' : '✅'}</span>
          {message.text}
        </div>
      )}

      <div className="admin-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">✅</span>
            Task Management
          </h2>
          <div className="action-buttons">
            <select
              className="form-select"
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              style={{ marginRight: '12px' }}
            >
              <option value="">Select Workspace</option>
              {workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <select
              className="form-select"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              style={{ marginRight: '12px' }}
              disabled={!selectedWorkspace}
            >
              <option value="">Select Assignment</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
              disabled={loading || !selectedAssignment}
            >
              {showForm ? '📋 View List' : '➕ Create Task'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="task-form">
            <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Workspace <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.workspaceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, workspaceId: e.target.value }))}
                  required
                >
                  <option value="">Select Workspace</option>
                  {workspaces.map(workspace => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
                {formErrors.workspaceId && <div className="form-error">{formErrors.workspaceId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Assignment</label>
                <select
                  className="form-select"
                  value={formData.assignmentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignmentId: e.target.value }))}
                >
                  <option value="">No Assignment</option>
                  {assignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  maxLength={255}
                  required
                />
                {formErrors.title && <div className="form-error">{formErrors.title}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.statusKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, statusKey: e.target.value }))}
                >
                  <option value="BACKLOG">Backlog</option>
                  <option value="TODO">To Do</option>
                  <option value="ONGOING">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - High</option>
                  <option value={4}>4 - Critical</option>
                  <option value={5}>5 - Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Task Type</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.taskTypeKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, taskTypeKey: e.target.value }))}
                  placeholder="e.g., DEVELOPMENT, TESTING, DOCUMENTATION"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assignee User ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.assigneeUserId}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigneeUserId: e.target.value }))}
                  placeholder="Enter assignee UUID"
                />
                {formErrors.assigneeUserId && <div className="form-error">{formErrors.assigneeUserId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Reporter User ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.reporterUserId}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporterUserId: e.target.value }))}
                  placeholder="Enter reporter UUID"
                />
                {formErrors.reporterUserId && <div className="form-error">{formErrors.reporterUserId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Reward Points</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.rewardPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, rewardPoints: e.target.value }))}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Hours</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Title Color</label>
                <input
                  type="color"
                  className="form-input"
                  value={formData.titleColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleColor: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description"
                maxLength={5000}
                rows={4}
              />
              {formErrors.description && <div className="form-error">{formErrors.description}</div>}
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Saving...' : (editingTask ? '💾 Update' : '➕ Create')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {!showForm && selectedAssignment && (
          <div className="task-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
                <span style={{ fontSize: '48px' }}>📝</span>
                <p>No tasks found in this workspace</p>
                <p>Click "Create Task" to get started</p>
              </div>
            ) : (
              <div className="item-list">
                {tasks.map(task => (
                  <div key={task.id} className="item-card">
                    <div className="item-header">
                      <h3 className="item-title" style={{ color: task.titleColor }}>
                        {task.title}
                      </h3>
                      <div className="item-actions">
                        <select
                          className="form-select"
                          value={task.statusKey || task.status}
                          onChange={(e) => handleStatusUpdate(task, e.target.value)}
                          style={{ marginRight: '8px', fontSize: '12px', padding: '4px 8px' }}
                        >
                          <option value="BACKLOG">Backlog</option>
                          <option value="TODO">To Do</option>
                          <option value="ONGOING">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleEdit(task)}
                          disabled={loading}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(task)}
                          disabled={loading}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p style={{ margin: '8px 0', color: 'var(--sb-sub)' }}>
                        {task.description.length > 150 
                          ? task.description.substring(0, 150) + '...'
                          : task.description
                        }
                      </p>
                    )}

                    <div className="item-meta">
                      <span className={`status-badge status-${(task.statusKey || task.status || 'todo').toLowerCase()}`}>
                        {getStatusLabel(task.statusKey || task.status)}
                      </span>
                      <span className={`priority-badge priority-${task.priority}`}>
                        Priority {task.priority} - {getPriorityLabel(task.priority)}
                      </span>
                      {task.assigneeUserId && <span>👤 {task.assigneeUserId}</span>}
                      {task.rewardPoints > 0 && <span>🏆 {task.rewardPoints} pts</span>}
                      {task.estimatedHours > 0 && <span>⏱️ {task.estimatedHours}h estimated</span>}
                      {task.deadline && (
                        <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>
                      )}
                      {task.createdAt && (
                        <span>📅 Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!showForm && !selectedWorkspace && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
            <span style={{ fontSize: '48px' }}>🏢</span>
            <p>Please select a workspace to view and manage tasks</p>
          </div>
        )}

        {!showForm && selectedWorkspace && !selectedAssignment && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--sb-sub)' }}>
            <span style={{ fontSize: '48px' }}>📋</span>
            <p>Please select an assignment to view its tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;