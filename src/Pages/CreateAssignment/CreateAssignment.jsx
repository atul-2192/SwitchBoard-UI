import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assignmentService } from '../../services/assignmentService';
import { workspaceService } from '../../services/workspaceService';
import ResponsiveNavbar from '../../Components/ResponsiveNavbar/ResponsiveNavbar';
import Login from '../../Components/Login/Login';
import Signup from '../../Components/Signup/Signup';
import './CreateAssignment.css';

const CreateAssignment = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  

  
  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Workspaces
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  
  // Form state - Matching API Contract
  const [formData, setFormData] = useState({
    workspaceId: '',
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    totalPoints: ''
  });
  
  // Tasks state - for creating tasks with assignment
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
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
    
    if (name === 'workspaceId') {

      const selectedWorkspace = workspaces.find(w => w.id === value);

    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      ...currentTask,
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
    setShowTaskForm(false);
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

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must not exceed 255 characters';
    }

    // Description validation (optional but has max length)
    if (formData.description && formData.description.length > 5000) {
      newErrors.description = 'Description must not exceed 5000 characters';
    }

    // Total points validation (optional but must be valid)
    if (formData.totalPoints !== '') {
      const points = parseInt(formData.totalPoints);
      if (isNaN(points) || points < 0) {
        newErrors.totalPoints = 'Total points must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setSubmitError('Please log in to create an assignment');
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
      // Prepare data matching API contract
      const assignmentData = {
        workspaceId: formData.workspaceId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        assignmentTypeKey: 'CUSTOM', // Always set as CUSTOM
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        totalPoints: formData.totalPoints ? parseInt(formData.totalPoints) : undefined
      };

      // Add tasks if any
      if (tasks.length > 0) {
        assignmentData.newTasks = {
          tasks: tasks
        };
      }






      
      const response = await assignmentService.createAssignment(assignmentData);
      

      setSubmitSuccess(true);
      
      // Navigate to kanban board after short delay
      setTimeout(() => {
        navigate('/kanban');
      }, 1500);
    } catch (error) {

      setSubmitError(
        error.message || 
        'Failed to create assignment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/kanban');
  };

  return (
    <div className="CreateAssignment-page">
      <ResponsiveNavbar
        user={user}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={logout}
      />

      <div className="CreateAssignment-container">
        {/* Header */}
        <div className="CreateAssignment-header">
          <div className="CreateAssignment-header-top">
            <button className="CreateAssignment-back-button" onClick={handleCancel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Kanban
            </button>
            <h1 className="CreateAssignment-title">Create New Assignment</h1>
          </div>
          <p className="CreateAssignment-description">
            Organize your tasks by creating a structured assignment
          </p>
        </div>

        {/* Form */}
        <form className="CreateAssignment-form" onSubmit={handleSubmit}>
          {submitError && (
            <div className="CreateAssignment-form-error-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="CreateAssignment-form-success-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Assignment created successfully! Redirecting...
            </div>
          )}

          {/* Workspace Selection */}
          <div className="CreateAssignment-form-group">
            <label htmlFor="workspaceId" className="CreateAssignment-form-label">
              Workspace <span className="CreateAssignment-required">*</span>
            </label>
            {loadingWorkspaces ? (
              <div className="CreateAssignment-loading-indicator">Loading workspaces...</div>
            ) : workspaces.length === 0 ? (
              <div className="CreateAssignment-no-workspaces-message">
                No workspaces available. Please create a workspace first.
              </div>
            ) : (
              <select
                id="workspaceId"
                name="workspaceId"
                value={formData.workspaceId}
                onChange={handleInputChange}
                className={`CreateAssignment-form-select ${errors.workspaceId ? 'error' : ''}`}
              >
                <option value="">Select a workspace</option>
                {workspaces.map(workspace => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            )}
            {errors.workspaceId && <span className="CreateAssignment-error-message">{errors.workspaceId}</span>}
          </div>

          {/* Title */}
          <div className="CreateAssignment-form-group">
            <label htmlFor="title" className="CreateAssignment-form-label">
              Assignment Title <span className="CreateAssignment-required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Java Fundamentals Week 1, React Components Practice"
              className={`CreateAssignment-form-input ${errors.title ? 'error' : ''}`}
              maxLength={255}
            />
            {errors.title && <span className="CreateAssignment-error-message">{errors.title}</span>}
            <span className="CreateAssignment-char-count">{formData.title.length}/255</span>
          </div>

          {/* Description */}
          <div className="CreateAssignment-form-group">
            <label htmlFor="description" className="CreateAssignment-form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this assignment covers and what the learner should achieve..."
              className={`CreateAssignment-form-textarea ${errors.description ? 'error' : ''}`}
              rows={6}
              maxLength={5000}
            />
            {errors.description && <span className="CreateAssignment-error-message">{errors.description}</span>}
            <span className="CreateAssignment-char-count">{formData.description.length}/5000</span>
          </div>

          {/* Start Date and Due Date - Row */}
          <div className="CreateAssignment-form-row">
            <div className="CreateAssignment-form-group">
              <label htmlFor="startDate" className="CreateAssignment-form-label">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`CreateAssignment-form-input ${errors.startDate ? 'error' : ''}`}
              />
              {errors.startDate && <span className="CreateAssignment-error-message">{errors.startDate}</span>}
            </div>

            <div className="CreateAssignment-form-group">
              <label htmlFor="dueDate" className="CreateAssignment-form-label">
                Due Date
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={`CreateAssignment-form-input ${errors.dueDate ? 'error' : ''}`}
              />
              {errors.dueDate && <span className="CreateAssignment-error-message">{errors.dueDate}</span>}
            </div>
          </div>

          {/* Total Points */}
          <div className="CreateAssignment-form-group">
            <label htmlFor="totalPoints" className="CreateAssignment-form-label">
              Total Points
            </label>
            <input
              type="number"
              id="totalPoints"
              name="totalPoints"
              value={formData.totalPoints}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              className={`CreateAssignment-form-input ${errors.totalPoints ? 'error' : ''}`}
              min="0"
            />
            {errors.totalPoints && <span className="CreateAssignment-error-message">{errors.totalPoints}</span>}
          </div>

          {/* Tasks Section */}
          <div className="CreateAssignment-tasks-section">
            <div className="CreateAssignment-section-header">
              <h3>Tasks (Optional)</h3>
              <button
                type="button"
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="CreateAssignment-btn-add-task"
              >
                {showTaskForm ? '❌ Cancel' : '➕ Add Task'}
              </button>
            </div>

            {/* Task Form */}
            {showTaskForm && (
              <div className="CreateAssignment-task-form">
                <div className="CreateAssignment-form-group">
                  <label className="CreateAssignment-form-label">
                    Task Title <span className="CreateAssignment-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentTask.title}
                    onChange={handleTaskInputChange}
                    placeholder="e.g., Install JDK and IDE"
                    className="CreateAssignment-form-input"
                    maxLength={255}
                  />
                </div>

                <div className="CreateAssignment-form-group">
                  <label className="CreateAssignment-form-label">Description</label>
                  <textarea
                    name="description"
                    value={currentTask.description}
                    onChange={handleTaskInputChange}
                    placeholder="Describe what needs to be done..."
                    className="CreateAssignment-form-textarea"
                    rows={3}
                    maxLength={5000}
                  />
                </div>

                <div className="CreateAssignment-form-row">
                  <div className="CreateAssignment-form-group">
                    <label className="CreateAssignment-form-label">Priority (1-5)</label>
                    <input
                      type="number"
                      name="priority"
                      value={currentTask.priority}
                      onChange={handleTaskInputChange}
                      min="1"
                      max="5"
                      className="CreateAssignment-form-input"
                    />
                  </div>

                  <div className="CreateAssignment-form-group">
                    <label className="CreateAssignment-form-label">Reward Points</label>
                    <input
                      type="number"
                      name="rewardPoints"
                      value={currentTask.rewardPoints}
                      onChange={handleTaskInputChange}
                      placeholder="e.g., 10"
                      min="0"
                      className="CreateAssignment-form-input"
                    />
                  </div>

                  <div className="CreateAssignment-form-group">
                    <label className="CreateAssignment-form-label">Est. Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      value={currentTask.estimatedHours}
                      onChange={handleTaskInputChange}
                      placeholder="e.g., 2.5"
                      min="0"
                      step="0.5"
                      className="CreateAssignment-form-input"
                    />
                  </div>
                </div>

                <div className="CreateAssignment-form-row">
                  <div className="CreateAssignment-form-group">
                    <label className="CreateAssignment-form-label">Topic</label>
                    <input
                      type="text"
                      name="topic"
                      value={currentTask.topic}
                      onChange={handleTaskInputChange}
                      placeholder="e.g., Setup, Basics"
                      className="CreateAssignment-form-input"
                      maxLength={255}
                    />
                  </div>

                  <div className="CreateAssignment-form-group">
                    <label className="CreateAssignment-form-label">Title Color</label>
                    <input
                      type="color"
                      name="titleColor"
                      value={currentTask.titleColor}
                      onChange={handleTaskInputChange}
                      className="CreateAssignment-form-input"
                    />
                  </div>

                  <div className="CreateAssignment-form-group">
                    <label className="CreateAssignment-form-label">Deadline</label>
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={currentTask.deadline}
                      onChange={handleTaskInputChange}
                      className="CreateAssignment-form-input"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddTask}
                  className="CreateAssignment-btn-save-task"
                >
                  ✅ Add Task to List
                </button>
              </div>
            )}

            {/* Tasks List */}
            {tasks.length > 0 && (
              <div className="CreateAssignment-tasks-list">
                <h4>Tasks to Create ({tasks.length})</h4>
                {tasks.map((task, index) => (
                  <div key={index} className="CreateAssignment-task-item">
                    <div className="CreateAssignment-task-info">
                      <div className="CreateAssignment-task-title" style={{ color: task.titleColor || 'inherit' }}>
                        {index + 1}. {task.title}
                      </div>
                      <div className="CreateAssignment-task-meta">
                        {task.topic && <span className="CreateAssignment-task-badge">📁 {task.topic}</span>}
                        <span className="CreateAssignment-task-badge">Priority: {task.priority}</span>
                        {task.rewardPoints && <span className="CreateAssignment-task-badge">🏆 {task.rewardPoints} pts</span>}
                        {task.estimatedHours && <span className="CreateAssignment-task-badge">⏱️ {task.estimatedHours}h</span>}
                      </div>
                    </div>
                    <div className="CreateAssignment-task-actions">
                      <button
                        type="button"
                        onClick={() => handleEditTask(index)}
                        className="CreateAssignment-btn-edit-task"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(index)}
                        className="CreateAssignment-btn-remove-task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="CreateAssignment-form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="CreateAssignment-btn-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="CreateAssignment-btn-submit"
              disabled={isSubmitting || loadingWorkspaces || workspaces.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="CreateAssignment-loading-spinner"></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="CreateAssignment-modal-overlay" onClick={handleCloseModals}>
          <div className="CreateAssignment-modal-content" onClick={(e) => e.stopPropagation()}>
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
        <div className="CreateAssignment-modal-overlay" onClick={handleCloseModals}>
          <div className="CreateAssignment-modal-content" onClick={(e) => e.stopPropagation()}>
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

export default CreateAssignment;
