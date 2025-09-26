import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './TaskBuilder.css';

const TaskBuilder = () => {
  const [activeTab, setActiveTab] = useState('assignment');
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    tasks: [],
    userIds: []
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    attachmentUrl: '',
    rewardPoints: '',
    deadline: '',
    titleColor: '#1E90FF'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users. Please try again.');
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [errors, setErrors] = useState({
    assignment: {},
    task: {}
  });

  const validateForm = () => {
    const newErrors = {
      assignment: {},
      task: {}
    };
    
    // Assignment validation
    if (!formData.title.trim()) {
      newErrors.assignment.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.assignment.description = 'Description is required';
    }
    if (!formData.deadline) {
      newErrors.assignment.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.assignment.deadline = 'Deadline cannot be in the past';
    }

    // Tasks validation
    if (formData.tasks.length === 0) {
      newErrors.assignment.tasks = 'At least one task is required';
    }

    // Users validation
    if (formData.userIds.length === 0) {
      newErrors.assignment.users = 'At least one user must be assigned';
    }
    
    // New task validation (if being added)
    if (newTask.title || newTask.description || newTask.deadline || newTask.rewardPoints) {
      if (!newTask.title.trim()) {
        newErrors.task.title = 'Task title is required';
      }
      if (!newTask.description.trim()) {
        newErrors.task.description = 'Task description is required';
      }
      if (!newTask.deadline) {
        newErrors.task.deadline = 'Task deadline is required';
      } else if (new Date(newTask.deadline) < new Date().setHours(0, 0, 0, 0)) {
        newErrors.task.deadline = 'Task deadline cannot be in the past';
      }
      if (!newTask.rewardPoints || newTask.rewardPoints <= 0) {
        newErrors.task.rewardPoints = 'Reward points must be greater than 0';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors.assignment).length && 
           (!Object.values(newErrors.task).length || (!newTask.title && !newTask.description));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      assignment: {
        ...prev.assignment,
        [name]: ''
      }
    }));
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      task: {
        ...prev.task,
        [name]: ''
      }
    }));
  };

  const addTask = () => {
    if (!newTask.title || !newTask.description) return;
    
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...newTask }]
    }));
    
    setNewTask({
      title: '',
      description: '',
      attachmentUrl: '',
      rewardPoints: '',
      deadline: '',
      titleColor: '#1E90FF'
    });
  };

  const removeTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const handleUserSelection = (userId) => {
    setFormData(prev => {
      const userIds = prev.userIds.includes(userId)
        ? prev.userIds.filter(id => id !== userId)
        : [...prev.userIds, userId];
      return { ...prev, userIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:9000/api/assignments/create-with-tasks-and-users',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to create assignment');

      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        deadline: '',
        tasks: [],
        userIds: []
      });

      // Show success message
    } catch (err) {
      setError('Failed to create assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sb-app">
    
      <main className="task-builder">
        <div className="builder-banner">
          <div className="banner-pattern"></div>
          <div className="banner-content">
            <h1>Assignment Builder</h1>
            <p className="banner-description">
              Create and assign tasks to team members. Track progress and manage deadlines efficiently.
            </p>
            <div className="banner-actions">
              <div className="action-card">
                <div className="action-icon">📋</div>
                <div className="action-text">Create Tasks</div>
              </div>
              <div className="action-card">
                <div className="action-icon">👥</div>
                <div className="action-text">Assign Users</div>
              </div>
              <div className="action-card">
                <div className="action-icon">🎯</div>
                <div className="action-text">Set Deadlines</div>
              </div>
            </div>
          </div>
        </div>

        <div className="task-builder-container">
          <div className="tab-container">
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'assignment' ? 'active' : ''}`}
                onClick={() => handleTabChange('assignment')}
              >
                <span className="tab-icon">📝</span>
                Create Assignment
              </button>
              <button 
                className={`tab-btn ${activeTab === 'task' ? 'active' : ''}`}
                onClick={() => handleTabChange('task')}
              >
                <span className="tab-icon">✨</span>
                Create Task
              </button>
            </div>
          </div>

          {activeTab === 'assignment' && (
            <form onSubmit={handleSubmit} className="builder-form">
              <div className="form-section">
                <h2>Assignment Details</h2>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h2>Tasks</h2>
                  <button 
                    type="button" 
                    className="add-task-btn"
                    onClick={addTask}
                  >
                    <span>+</span> Add Task
                  </button>
                </div>

                {/* Task Input Form */}
                <div className="task-input-form">
                  <div className="form-group">
                    <label htmlFor="taskTitle">Task Title</label>
                    <input
                      type="text"
                      id="taskTitle"
                      name="title"
                      value={newTask.title}
                      onChange={handleTaskInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="taskDescription">Task Description</label>
                    <textarea
                      id="taskDescription"
                      name="description"
                      value={newTask.description}
                      onChange={handleTaskInputChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="taskDeadline">Task Deadline</label>
                      <input
                        type="date"
                        id="taskDeadline"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleTaskInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rewardPoints">Reward Points</label>
                      <input
                        type="number"
                        id="rewardPoints"
                        name="rewardPoints"
                        value={newTask.rewardPoints}
                        onChange={handleTaskInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="titleColor">Title Color</label>
                      <input
                        type="color"
                        id="titleColor"
                        name="titleColor"
                        value={newTask.titleColor}
                        onChange={handleTaskInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="attachmentUrl">Attachment URL</label>
                    <input
                      type="url"
                      id="attachmentUrl"
                      name="attachmentUrl"
                      value={newTask.attachmentUrl}
                      onChange={handleTaskInputChange}
                    />
                  </div>
                </div>

                {/* Task List */}
                <div className="task-list">
                  {formData.tasks.map((task, index) => (
                    <div key={index} className="task-card">
                      <div className="task-card-header">
                        <h3 style={{ color: task.titleColor }}>{task.title}</h3>
                        <button 
                          type="button"
                          className="remove-task-btn"
                          onClick={() => removeTask(index)}
                        >
                          ×
                        </button>
                      </div>
                      <p>{task.description}</p>
                      <div className="task-card-footer">
                        <span>🏆 {task.rewardPoints} points</span>
                        <span>⏰ {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>Assign Users</h2>
                <div className="user-selection">
                  <div className="selected-users">
                    {formData.userIds.map(userId => {
                      const user = users.find(u => u.id === userId);
                      return user ? (
                        <div key={userId} className="selected-user-tag">
                          <span>{user.name}</span>
                          <button 
                            type="button"
                            onClick={() => handleUserSelection(userId)}
                          >
                            ×
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="user-dropdown">
                    <button 
                      type="button" 
                      className="dropdown-toggle"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      Select Users
                    </button>
                    {isDropdownOpen && (
                      <div className="dropdown-content">
                        <div className="dropdown-search">
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                          />
                        </div>
                        <div className="dropdown-list">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                              <div 
                                key={user.id}
                                className={`dropdown-item ${formData.userIds.includes(user.id) ? 'selected' : ''}`}
                                onClick={() => handleUserSelection(user.id)}
                              >
                                <div className="user-info">
                                  <div className="user-avatar">{user.name.charAt(0)}</div>
                                  <div className="user-details">
                                    <div className="user-name">{user.name}</div>
                                    {user.email && <div className="user-email">{user.email}</div>}
                                  </div>
                                </div>
                                {formData.userIds.includes(user.id) && (
                                  <span className="selected-check">✓</span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="no-results">No users found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading || formData.tasks.length === 0 || formData.userIds.length === 0}
                >
                  {loading ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TaskBuilder;
