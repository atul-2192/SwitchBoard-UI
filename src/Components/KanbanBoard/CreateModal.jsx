import React, { useState, useEffect } from 'react';
import './CreateModal.css';
import { userWorkspaceService } from '../../services/userWorkspaceService';

const CreateModal = ({ isOpen, onClose, workspaceId, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('assignment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Assignment form data
  const [assignmentData, setAssignmentData] = useState({
    name: '',
    description: '',
    deadline: '',
    assignmentType: 'CUSTOM',
    tasks: [{ title: '', description: '', priority: 2 }]
  });
  
  // Task form data
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 2,
    estimatedHours: '',
    rewardPoints: '',
    deadline: '',
    tags: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setError('');
      setFormErrors({});
    }
  }, [isOpen]);

  const resetForm = () => {
    setAssignmentData({
      name: '',
      description: '',
      deadline: '',
      assignmentType: 'CUSTOM',
      tasks: [{ title: '', description: '', priority: 2 }]
    });
    setTaskData({
      title: '',
      description: '',
      priority: 2,
      estimatedHours: '',
      rewardPoints: '',
      deadline: '',
      tags: ''
    });
  };

  // Validation functions
  const validateAssignment = () => {
    const errors = {};
    
    if (!assignmentData.name.trim()) {
      errors.name = 'Assignment name is required';
    } else if (assignmentData.name.length < 3) {
      errors.name = 'Assignment name must be at least 3 characters';
    } else if (assignmentData.name.length > 100) {
      errors.name = 'Assignment name must be less than 100 characters';
    }

    if (assignmentData.description && assignmentData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (assignmentData.deadline) {
      const deadline = new Date(assignmentData.deadline);
      if (deadline <= new Date()) {
        errors.deadline = 'Deadline must be in the future';
      }
    }

    // Validate tasks
    assignmentData.tasks.forEach((task, index) => {
      if (!task.title.trim()) {
        errors[`task_${index}_title`] = 'Task title is required';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTask = () => {
    const errors = {};
    
    if (!taskData.title.trim()) {
      errors.title = 'Task title is required';
    } else if (taskData.title.length < 3) {
      errors.title = 'Task title must be at least 3 characters';
    } else if (taskData.title.length > 200) {
      errors.title = 'Task title must be less than 200 characters';
    }

    if (taskData.description && taskData.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    if (taskData.estimatedHours) {
      const hours = parseFloat(taskData.estimatedHours);
      if (isNaN(hours) || hours <= 0 || hours > 1000) {
        errors.estimatedHours = 'Please enter a valid number of hours (1-1000)';
      }
    }

    if (taskData.rewardPoints) {
      const points = parseInt(taskData.rewardPoints);
      if (isNaN(points) || points < 0 || points > 10000) {
        errors.rewardPoints = 'Please enter valid reward points (0-10000)';
      }
    }

    if (taskData.deadline) {
      const deadline = new Date(taskData.deadline);
      if (deadline <= new Date()) {
        errors.deadline = 'Deadline must be in the future';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle assignment form changes
  const handleAssignmentChange = (field, value) => {
    setAssignmentData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear related error
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle task form changes
  const handleTaskChange = (field, value) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear related error
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle assignment task changes
  const handleAssignmentTaskChange = (taskIndex, field, value) => {
    setAssignmentData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, index) => 
        index === taskIndex 
          ? { ...task, [field]: value }
          : task
      )
    }));
    
    // Clear related error
    const errorKey = `task_${taskIndex}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  // Add new task to assignment
  const addAssignmentTask = () => {
    setAssignmentData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { title: '', description: '', priority: 2 }]
    }));
  };

  // Remove task from assignment
  const removeAssignmentTask = (taskIndex) => {
    setAssignmentData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, index) => index !== taskIndex)
    }));
  };

  // Handle assignment submission
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAssignment()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create assignment
      const assignment = await userWorkspaceService.createAssignment(workspaceId, {
        name: assignmentData.name,
        description: assignmentData.description,
        deadline: assignmentData.deadline || null,
        assignmentType: assignmentData.assignmentType
      });

      // Create tasks for the assignment
      for (const task of assignmentData.tasks) {
        if (task.title.trim()) {
          await userWorkspaceService.createTask(workspaceId, {
            title: task.title,
            description: task.description,
            priority: task.priority
          }, assignment.id);
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      if (error.message.includes('fetch')) {
        setError('Demo Mode: Backend API not available. In a real application, this assignment would be created.');
      } else {
        setError(error.message || 'Failed to create assignment');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle task submission
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateTask()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const task = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        estimatedHours: taskData.estimatedHours ? parseFloat(taskData.estimatedHours) : null,
        rewardPoints: taskData.rewardPoints ? parseInt(taskData.rewardPoints) : null,
        deadline: taskData.deadline || null,
        tags: taskData.tags ? taskData.tags.split(',').map(tag => ({ name: tag.trim() })) : []
      };

      await userWorkspaceService.createTask(workspaceId, task);
      onSuccess();
      onClose();
    } catch (error) {
      if (error.message.includes('fetch')) {
        setError('Demo Mode: Backend API not available. In a real application, this task would be created.');
      } else {
        setError(error.message || 'Failed to create task');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="modal-icon">✨</span>
            Create New Content
          </h2>
          <button className="close-btn" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'assignment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignment')}
          >
            <span className="tab-icon">📋</span>
            Assignment
          </button>
          <button 
            className={`tab-btn ${activeTab === 'task' ? 'active' : ''}`}
            onClick={() => setActiveTab('task')}
          >
            <span className="tab-icon">✅</span>
            Quick Task
          </button>
        </div>

        <div className="modal-content">
          {/* Assignment Form */}
          {activeTab === 'assignment' && (
            <form onSubmit={handleAssignmentSubmit} className="create-form">
              <div className="form-section">
                <h3>Assignment Details</h3>
                
                <div className="form-group">
                  <label className="form-label">
                    Assignment Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={assignmentData.name}
                    onChange={(e) => handleAssignmentChange('name', e.target.value)}
                    placeholder="Enter assignment name"
                    maxLength={100}
                  />
                  {formErrors.name && <div className="form-error">{formErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={assignmentData.description}
                    onChange={(e) => handleAssignmentChange('description', e.target.value)}
                    placeholder="Describe the assignment goals and requirements"
                    rows={3}
                    maxLength={500}
                  />
                  {formErrors.description && <div className="form-error">{formErrors.description}</div>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={assignmentData.assignmentType}
                      onChange={(e) => handleAssignmentChange('assignmentType', e.target.value)}
                    >
                      <option value="CUSTOM">Custom Assignment</option>
                      <option value="ROADMAP">Roadmap Assignment</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={assignmentData.deadline}
                      onChange={(e) => handleAssignmentChange('deadline', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    {formErrors.deadline && <div className="form-error">{formErrors.deadline}</div>}
                  </div>
                </div>
              </div>

              {/* Assignment Tasks */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Tasks</h3>
                  <button 
                    type="button" 
                    className="add-task-btn"
                    onClick={addAssignmentTask}
                  >
                    <span>+</span> Add Task
                  </button>
                </div>

                {assignmentData.tasks.map((task, index) => (
                  <div key={index} className="task-form-item">
                    <div className="task-header">
                      <span className="task-number">Task {index + 1}</span>
                      {assignmentData.tasks.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-task-btn"
                          onClick={() => removeAssignmentTask(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        value={task.title}
                        onChange={(e) => handleAssignmentTaskChange(index, 'title', e.target.value)}
                        placeholder="Task title"
                        maxLength={200}
                      />
                      {formErrors[`task_${index}_title`] && (
                        <div className="form-error">{formErrors[`task_${index}_title`]}</div>
                      )}
                    </div>

                    <div className="form-grid">
                      <textarea
                        className="form-textarea"
                        value={task.description}
                        onChange={(e) => handleAssignmentTaskChange(index, 'description', e.target.value)}
                        placeholder="Task description"
                        rows={2}
                        maxLength={500}
                      />
                      <select
                        className="form-select"
                        value={task.priority}
                        onChange={(e) => handleAssignmentTaskChange(index, 'priority', parseInt(e.target.value))}
                      >
                        <option value={1}>Low Priority</option>
                        <option value={2}>Medium Priority</option>
                        <option value={3}>High Priority</option>
                        <option value={4}>Critical</option>
                        <option value={5}>Urgent</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          )}

          {/* Task Form */}
          {activeTab === 'task' && (
            <form onSubmit={handleTaskSubmit} className="create-form">
              <div className="form-section">
                <h3>Task Details</h3>
                
                <div className="form-group">
                  <label className="form-label">
                    Task Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={taskData.title}
                    onChange={(e) => handleTaskChange('title', e.target.value)}
                    placeholder="Enter task title"
                    maxLength={200}
                  />
                  {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={taskData.description}
                    onChange={(e) => handleTaskChange('description', e.target.value)}
                    placeholder="Describe what needs to be done"
                    rows={4}
                    maxLength={1000}
                  />
                  {formErrors.description && <div className="form-error">{formErrors.description}</div>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={taskData.priority}
                      onChange={(e) => handleTaskChange('priority', parseInt(e.target.value))}
                    >
                      <option value={1}>Low Priority</option>
                      <option value={2}>Medium Priority</option>
                      <option value={3}>High Priority</option>
                      <option value={4}>Critical</option>
                      <option value={5}>Urgent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Hours</label>
                    <input
                      type="number"
                      className="form-input"
                      value={taskData.estimatedHours}
                      onChange={(e) => handleTaskChange('estimatedHours', e.target.value)}
                      placeholder="e.g. 4.5"
                      min="0.5"
                      max="1000"
                      step="0.5"
                    />
                    {formErrors.estimatedHours && <div className="form-error">{formErrors.estimatedHours}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reward Points</label>
                    <input
                      type="number"
                      className="form-input"
                      value={taskData.rewardPoints}
                      onChange={(e) => handleTaskChange('rewardPoints', e.target.value)}
                      placeholder="e.g. 50"
                      min="0"
                      max="10000"
                    />
                    {formErrors.rewardPoints && <div className="form-error">{formErrors.rewardPoints}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={taskData.deadline}
                      onChange={(e) => handleTaskChange('deadline', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    {formErrors.deadline && <div className="form-error">{formErrors.deadline}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-input"
                    value={taskData.tags}
                    onChange={(e) => handleTaskChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas (e.g. Frontend, React, UI)"
                    maxLength={200}
                  />
                  <div className="form-help">Separate multiple tags with commas</div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;