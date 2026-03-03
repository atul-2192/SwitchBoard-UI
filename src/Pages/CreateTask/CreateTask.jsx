import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import { assignmentService } from '../../services/assignmentService';
import { workspaceService } from '../../services/workspaceService';
import ResponsiveNavbar from '../../Components/ResponsiveNavbar/ResponsiveNavbar';
import Login from '../../Components/Login/Login';
import Signup from '../../Components/Signup/Signup';
import './CreateTask.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Workspaces and Assignments
  const [workspaces, setWorkspaces] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  
  // Form state - Matching API Contract
  const [formData, setFormData] = useState({
    workspaceId: '',
    assignmentId: '',
    assigneeUserId: '',
    reporterUserId: ''
  });

  // Tasks state - for bulk task creation
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(true);
  const [currentTask, setCurrentTask] = useState({
    title: '',
    description: '',
    priority: 3,
    rewardPoints: '',
    estimatedHours: '',
    titleColor: '',
    deadline: '',
    topic: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load workspaces on mount
  useEffect(() => {
    loadWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependencies - just load on mount

  // Load assignments when workspace changes
  useEffect(() => {
    if (formData.workspaceId) {
      loadAssignments(formData.workspaceId);
    } else {
      setAssignments([]);
    }
  }, [formData.workspaceId]);

  const loadWorkspaces = async () => {
    try {
      setLoadingWorkspaces(true);

      
      // Fetch workspaces owned by current user
      // Just send JWT token - API Gateway extracts user ID automatically
      const data = await workspaceService.getWorkspacesByOwner();
      

      setWorkspaces(Array.isArray(data) ? data : []);
    } catch (err) {

      setWorkspaces([]);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  const loadAssignments = async (workspaceId) => {
    try {
      setLoadingAssignments(true);
      const data = await assignmentService.getAssignmentsByWorkspace(workspaceId);
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {

      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Modal handlers
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Reset assignment when workspace changes
    if (name === 'workspaceId') {
      setFormData(prev => ({
        ...prev,
        workspaceId: value,
        assignmentId: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTask = () => {
    // Validate task
    if (!currentTask.title.trim()) {
      alert('Task title is required');
      return;
    }

    const newTask = {
      title: currentTask.title.trim(),
      description: currentTask.description.trim() || undefined,
      priority: parseInt(currentTask.priority),
      rewardPoints: currentTask.rewardPoints ? parseInt(currentTask.rewardPoints) : undefined,
      estimatedHours: currentTask.estimatedHours ? parseFloat(currentTask.estimatedHours) : undefined,
      titleColor: currentTask.titleColor || undefined,
      deadline: currentTask.deadline ? new Date(currentTask.deadline).toISOString() : undefined,
      topic: currentTask.topic.trim() || undefined
    };

    setTasks([...tasks, newTask]);
    
    // Reset task form
    setCurrentTask({
      title: '',
      description: '',
      priority: 3,
      rewardPoints: '',
      estimatedHours: '',
      titleColor: '',
      deadline: '',
      topic: ''
    });
  };

  const handleRemoveTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleEditTask = (index) => {
    const task = tasks[index];
    setCurrentTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      rewardPoints: task.rewardPoints || '',
      estimatedHours: task.estimatedHours || '',
      titleColor: task.titleColor || '',
      deadline: task.deadline ? task.deadline.substring(0, 16) : '',
      topic: task.topic || ''
    });
    handleRemoveTask(index);
    setShowTaskForm(true);
  };

  const validateForm = () => {
    const newErrors = {};

    // Workspace validation
    if (!formData.workspaceId) {
      newErrors.workspaceId = 'Please select a workspace';
    }

    // Assignment validation
    if (!formData.assignmentId) {
      newErrors.assignmentId = 'Please select an assignment';
    }

    // Tasks validation
    if (tasks.length === 0) {
      newErrors.tasks = 'Please add at least one task';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setSubmitError('Please log in to create a task');
      handleLoginClick();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Prepare data matching API contract for addTasksToAssignment
      const taskData = {
        assigneeUserId: formData.assigneeUserId || undefined,
        reporterUserId: formData.reporterUserId || undefined,
        tasks: tasks
      };


      const response = await assignmentService.addTasksToAssignment(formData.assignmentId, taskData);
      

      setSubmitSuccess(true);
      
      // Navigate to kanban board after short delay
      setTimeout(() => {
        navigate('/kanban');
      }, 1500);
    } catch (error) {

      setSubmitError(
        error.message || 
        'Failed to create task. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/kanban');
  };

  return (
    <div className="create-task-page">
      <ResponsiveNavbar
        user={user}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={logout}
      />

      <div className="create-task-container">
        {/* Header */}
        <div className="create-task-header">
          <div className="create-task-header-top">
            <button className="create-task-back-button" onClick={handleCancel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Kanban
            </button>
            <h1 className="create-task-title">Add Tasks to Assignment</h1>
          </div>
          <p className="create-task-description">
            Add one or more tasks to an existing assignment
          </p>
        </div>

        {/* Form */}
        <form className="create-task-form" onSubmit={handleSubmit}>
          {submitError && (
            <div className="form-error-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="form-success-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Tasks added successfully! Redirecting...
            </div>
          )}

          {/* Workspace Selection */}
          <div className="form-group">
            <label htmlFor="workspaceId" className="form-label">
              Workspace <span className="required">*</span>
            </label>
            {loadingWorkspaces ? (
              <div className="loading-indicator">Loading workspaces...</div>
            ) : workspaces.length === 0 ? (
              <div className="no-data-message">
                No workspaces available. Please create a workspace first.
              </div>
            ) : (
              <select
                id="workspaceId"
                name="workspaceId"
                value={formData.workspaceId}
                onChange={handleInputChange}
                className={`form-select ${errors.workspaceId ? 'error' : ''}`}
              >
                <option value="">Select a workspace</option>
                {workspaces.map(workspace => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            )}
            {errors.workspaceId && <span className="error-message">{errors.workspaceId}</span>}
          </div>

          {/* Assignment Selection */}
          <div className="form-group">
            <label htmlFor="assignmentId" className="form-label">
              Assignment <span className="required">*</span>
            </label>
            {!formData.workspaceId ? (
              <div className="info-message">
                Please select a workspace first
              </div>
            ) : loadingAssignments ? (
              <div className="loading-indicator">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="no-data-message">
                No assignments available in this workspace. Please create an assignment first.
              </div>
            ) : (
              <select
                id="assignmentId"
                name="assignmentId"
                value={formData.assignmentId}
                onChange={handleInputChange}
                className={`form-select ${errors.assignmentId ? 'error' : ''}`}
                disabled={!formData.workspaceId}
              >
                <option value="">Select an assignment</option>
                {assignments.map(assignment => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            )}
            {errors.assignmentId && <span className="error-message">{errors.assignmentId}</span>}
          </div>

          {/* Tasks Section */}
          <div className="tasks-section">
            <div className="section-header">
              <h3>Tasks {tasks.length > 0 && `(${tasks.length})`}</h3>
              {tasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="btn-toggle-form"
                >
                  {showTaskForm ? '➖ Hide Form' : '➕ Add Another Task'}
                </button>
              )}
            </div>

            {errors.tasks && <div className="error-banner">{errors.tasks}</div>}

            {/* Task Form */}
            {showTaskForm && (
              <div className="task-form">
                <div className="form-group">
                  <label className="form-label">
                    Task Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentTask.title}
                    onChange={handleTaskInputChange}
                    placeholder="e.g., Install JDK and IDE"
                    className="form-input"
                    maxLength={255}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={currentTask.description}
                    onChange={handleTaskInputChange}
                    placeholder="Describe what needs to be done..."
                    className="form-textarea"
                    rows={3}
                    maxLength={5000}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Priority (1-5)</label>
                    <input
                      type="number"
                      name="priority"
                      value={currentTask.priority}
                      onChange={handleTaskInputChange}
                      min="1"
                      max="5"
                      className="form-input"
                    />
                    <small className="form-hint">1 = Highest, 5 = Lowest</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reward Points</label>
                    <input
                      type="number"
                      name="rewardPoints"
                      value={currentTask.rewardPoints}
                      onChange={handleTaskInputChange}
                      placeholder="e.g., 10"
                      min="0"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Est. Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      value={currentTask.estimatedHours}
                      onChange={handleTaskInputChange}
                      placeholder="e.g., 2.5"
                      min="0"
                      step="0.5"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Topic</label>
                    <input
                      type="text"
                      name="topic"
                      value={currentTask.topic}
                      onChange={handleTaskInputChange}
                      placeholder="e.g., Setup, Basics"
                      className="form-input"
                      maxLength={255}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Title Color</label>
                    <input
                      type="color"
                      name="titleColor"
                      value={currentTask.titleColor}
                      onChange={handleTaskInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={currentTask.deadline}
                      onChange={handleTaskInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddTask}
                  className="btn-add-task"
                >
                  ✅ Add Task to List
                </button>
              </div>
            )}

            {/* Tasks List */}
            {tasks.length > 0 && (
              <div className="tasks-list">
                <h4>Tasks to Add ({tasks.length})</h4>
                {tasks.map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-info">
                      <div className="task-title" style={{ color: task.titleColor || 'inherit' }}>
                        {index + 1}. {task.title}
                      </div>
                      <div className="task-meta">
                        {task.topic && <span className="task-badge">📁 {task.topic}</span>}
                        <span className="task-badge">Priority: {task.priority}</span>
                        {task.rewardPoints && <span className="task-badge">🏆 {task.rewardPoints} pts</span>}
                        {task.estimatedHours && <span className="task-badge">⏱️ {task.estimatedHours}h</span>}
                      </div>
                      {task.description && <div className="task-description">{task.description}</div>}
                    </div>
                    <div className="task-actions">
                      <button
                        type="button"
                        onClick={() => handleEditTask(index)}
                        className="btn-edit-task"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(index)}
                        className="btn-remove-task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optional: Assignee and Reporter */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assigneeUserId" className="form-label">
                Assignee User ID (Optional)
              </label>
              <input
                type="text"
                id="assigneeUserId"
                name="assigneeUserId"
                value={formData.assigneeUserId}
                onChange={handleInputChange}
                placeholder="UUID of user to assign tasks to"
                className="form-input"
              />
              <small className="form-hint">Leave empty to assign later</small>
            </div>

            <div className="form-group">
              <label htmlFor="reporterUserId" className="form-label">
                Reporter User ID (Optional)
              </label>
              <input
                type="text"
                id="reporterUserId"
                name="reporterUserId"
                value={formData.reporterUserId}
                onChange={handleInputChange}
                placeholder="UUID of reporter"
                className="form-input"
              />
              <small className="form-hint">Leave empty to use current user</small>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || loadingWorkspaces || workspaces.length === 0 || (formData.workspaceId && loadingAssignments) || tasks.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Adding Tasks...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Tasks to Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Login 
              onClose={handleCloseModals} 
              switchToSignup={() => {
                setShowLoginModal(false);
                setShowSignupModal(true);
              }} 
            />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Signup 
              onClose={handleCloseModals} 
              switchToLogin={() => {
                setShowSignupModal(false);
                setShowLoginModal(true);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;
