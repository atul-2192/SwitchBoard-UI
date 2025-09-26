import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roadmap.css';
import './premium-tasks.css';
import './fixed-layout.css';

const Roadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9001/api/Roadmap');
        
        console.log('API Response received');
        
        // Process the response to break circular references
        const processedData = processApiResponse(response.data);
        
        // Check if the processed data is an array
        if (Array.isArray(processedData)) {
          console.log('Processed data is an array with length:', processedData.length);
          setRoadmaps(processedData);
          if (processedData.length > 0) {
            setSelectedRoadmap(processedData[0]);
          }
        } else {
          console.log('Processed data is a single object');
          // If it's a single object, convert it to an array
          setRoadmaps([processedData]);
          setSelectedRoadmap(processedData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
        setError('Failed to load roadmaps. Please try again later.');
        setLoading(false);
      }
    };

    // Function to process the API response and remove circular references
    const processApiResponse = (data) => {
      // If it's an array, process each item
      if (Array.isArray(data)) {
        return data.map(item => processApiResponse(item));
      }
      
      // If it's not an object or is null, return as is
      if (!data || typeof data !== 'object') {
        return data;
      }
      
      // Create a new object without circular references
      const processedObject = {};
      
      // Copy all properties except those that might cause circular references
      Object.keys(data).forEach(key => {
        if (key === 'assignment') {
          // Skip the assignment property to break the circular reference
          return;
        } else if (key === 'tasks' && Array.isArray(data[key])) {
          // Process each task to remove circular references
          processedObject[key] = data[key].map(task => {
            const { assignment, ...taskWithoutAssignment } = task;
            return taskWithoutAssignment;
          });
        } else {
          processedObject[key] = data[key];
        }
      });
      
      return processedObject;
    };

    fetchRoadmaps();
  }, []);

  // Log the state whenever it changes to help debug
  useEffect(() => {
    console.log('Roadmaps state:', roadmaps);
    console.log('Selected roadmap:', selectedRoadmap);
  }, [roadmaps, selectedRoadmap]);

  const handleRoadmapSelect = (roadmap) => {
    setSelectedRoadmap(roadmap);
    setSelectedTasks([]);
  };

  const handleTaskSelect = (task) => {
    if (selectedTasks.some(t => t.title === task.title)) {
      // If task is already selected, remove it
      setSelectedTasks(selectedTasks.filter(t => t.title !== task.title));
    } else {
      // Otherwise add it
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRoadmap && selectedRoadmap.tasks) {
      setSelectedTasks([...selectedRoadmap.tasks]);
    }
  };

  const handleReset = () => {
    setSelectedTasks([]);
  };

  const handleAddToWorkspace = () => {
    // This functionality will be implemented later
    console.log('Tasks to add to workspace:', selectedTasks);
    alert(`Selected ${selectedTasks.length} tasks for your workspace!`);
  };

  const isTaskSelected = (task) => {
    return selectedTasks.some(t => t.title === task.title);
  };

  if (loading) {
    return (
      <div className="roadmap-container">
        <div className="roadmap-loading">
          <div className="loader"></div>
          <p>Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-container">
        <div className="roadmap-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If there are no roadmaps after loading
  if (!roadmaps || !Array.isArray(roadmaps) || roadmaps.length === 0) {
    return (
      <div className="roadmap-container">
        <div className="roadmap-banner light-banner">
          <div className="banner-content">
            <span className="banner-tag">Learning Journey</span>
            <h1>Find Your Perfect Roadmap</h1>
            <p>Discover structured learning paths designed to help you master new skills at your own pace.</p>
            <div className="banner-quote">
              <blockquote>"The expert in anything was once a beginner."</blockquote>
              <cite>— Helen Hayes</cite>
            </div>
          </div>
          <div className="banner-illustration">
            <div className="illustration-element elem-1"></div>
            <div className="illustration-element elem-2"></div>
            <div className="illustration-element elem-3"></div>
            <div className="illustration-element elem-4"></div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No Roadmaps Available</h3>
          <p>There are no roadmaps available at the moment. Please check back later.</p>
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-container">
      {/* Banner Section */}
      <div className="roadmap-banner light-banner">
        <div className="banner-content">
          <span className="banner-tag">Learning Journey</span>
          <h1>Find Your Perfect Roadmap</h1>
          <p>Discover structured learning paths designed to help you master new skills at your own pace.</p>
          <div className="banner-quote">
            <blockquote>"The expert in anything was once a beginner."</blockquote>
            <cite>— Helen Hayes</cite>
          </div>
        </div>
        <div className="banner-illustration">
          <div className="illustration-element elem-1"></div>
          <div className="illustration-element elem-2"></div>
          <div className="illustration-element elem-3"></div>
          <div className="illustration-element elem-4"></div>
        </div>
      </div>

      {/* Roadmap Selection */}
      <div className="roadmap-selection">
        <div className="roadmap-selection-header">
          <h2>Available Roadmaps</h2>
          <p>Choose a learning path that fits your goals and interests</p>
        </div>
        <div className="roadmap-cards">
          {Array.isArray(roadmaps) && roadmaps.length > 0 ? (
            roadmaps.map((roadmap, index) => {
              // Calculate statistics for this roadmap
              const taskCount = roadmap.tasks && Array.isArray(roadmap.tasks) ? roadmap.tasks.length : 0;
              const totalDays = roadmap.tasks && Array.isArray(roadmap.tasks) ? 
                roadmap.tasks.reduce((total, task) => total + (parseInt(task.daysToComplete) || 0), 0) : 0;
              
              // Generate a random icon for each roadmap
              const icons = ['📊', '🚀', '💡', '🛠️', '📱', '🔍', '📘', '💻'];
              const icon = icons[index % icons.length];
              
              return (
                <div 
                  key={index}
                  className={`roadmap-card ${selectedRoadmap && selectedRoadmap.title === roadmap.title ? 'active' : ''}`}
                  onClick={() => handleRoadmapSelect(roadmap)}
                >
                  <div className="roadmap-card-icon">{icon}</div>
                  <h3>{roadmap.title || 'Untitled Roadmap'}</h3>
                  <p>{roadmap.description 
                    ? (roadmap.description.length > 120 
                       ? roadmap.description.substring(0, 120) + "..." 
                       : roadmap.description)
                    : "No description available"}</p>
                  <div className="roadmap-card-footer">
                    <span className="roadmap-card-stat">{taskCount} Tasks</span>
                    <span className="roadmap-card-stat">{totalDays} Days</span>
                    {selectedRoadmap && selectedRoadmap.title === roadmap.title && 
                      <span className="roadmap-card-selected">Selected</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-roadmaps">
              <p>No roadmaps available. Please check back later.</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Roadmap Details */}
      {selectedRoadmap && (
        <div className="selected-roadmap">
          <div className="selected-roadmap-header">
            <h2>{selectedRoadmap.title}</h2>
            <p>{selectedRoadmap.description}</p>
          </div>

          <div className="selected-roadmap-stats">
            <div className="roadmap-stat">
              <span className="stat-value">
                {selectedRoadmap.tasks && Array.isArray(selectedRoadmap.tasks) ? selectedRoadmap.tasks.length : 0}
              </span>
              <span className="stat-label">Tasks</span>
            </div>
            <div className="roadmap-stat">
              <span className="stat-value">
                {selectedRoadmap.tasks && Array.isArray(selectedRoadmap.tasks) ? 
                  selectedRoadmap.tasks.reduce((total, task) => total + (parseInt(task.daysToComplete) || 0), 0) : 0}
              </span>
              <span className="stat-label">Days</span>
            </div>
            <div className="roadmap-stat">
              <span className="stat-value">
                {selectedRoadmap.tasks && Array.isArray(selectedRoadmap.tasks) ? 
                  selectedRoadmap.tasks.reduce((total, task) => total + (parseInt(task.rewardPoints) || 0), 0) : 0}
              </span>
              <span className="stat-label">Points</span>
            </div>
          </div>

          {/* Tasks Window */}
          <div className="tasks-window-container">
            <h3>Tasks in this Roadmap</h3>
            <p>Select tasks to add to your workspace</p>
            
            <div className="tasks-window premium-tasks-grid">
              {selectedRoadmap.tasks && Array.isArray(selectedRoadmap.tasks) && selectedRoadmap.tasks.length > 0 ? (
                selectedRoadmap.tasks.map((task, index) => {
                  // Get difficulty level based on titleColor
                  const getDifficultyLevel = (color) => {
                    if (!color) return 'Beginner';
                    
                    const colorMap = {
                      'red': 'Hard',
                      'orange': 'Medium',
                      'green': 'Easy'
                    };
                    
                    return colorMap[color.toLowerCase()] || 'Beginner';
                  };
                  
                  // Get color class based on titleColor
                  const getColorClass = (color) => {
                    if (!color) return 'green-task';
                    
                    const colorMap = {
                      'red': 'red-task',
                      'orange': 'orange-task',
                      'green': 'green-task',
                      'blue': 'blue-task',
                      'purple': 'purple-task'
                    };
                    
                    return colorMap[color.toLowerCase()] || 'green-task';
                  };
                  
                  // Get the difficulty level and color class
                  const difficultyLevel = getDifficultyLevel(task.titleColor);
                  const colorClass = getColorClass(task.titleColor);
                  
                  return (
                    <div 
                      key={index}
                      className={`roadmap-task-wrapper ${colorClass} ${isTaskSelected(task) ? 'selected' : ''}`}
                      onClick={() => handleTaskSelect(task)}
                    >
                      {isTaskSelected(task) && (
                        <div className="task-selected-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        </div>
                      )}
                      <div className="task-tile roadmap-task">
                        <div className="task-header">
                          <h3 className="task-title">{task.title || 'Untitled Task'}</h3>
                          <span className={`task-status pending`}>
                            {task.topic || 'General'}
                          </span>
                        </div>
                        
                       
                        
                        <div className="task-meta">
                          <span className="task-meta-item">
                            <i>⏰</i>
                            {task.daysToComplete || 0} {(task.daysToComplete || 0) === 1 ? 'day' : 'days'}
                          </span>
                          <span className="task-meta-item">
                            <i>📅</i>
                            {difficultyLevel}
                          </span>
                        </div>
                        
                        <p className="task-description">{task.description || 'No description available'}</p>
                        
                        <div className="task-footer">
                          <div className="task-reward">
                            <i>🏆</i>
                            {task.rewardPoints || 0} Points
                          </div>
                          <div className="task-select-indicator">
                            {isTaskSelected(task) ? 'Selected' : 'Click to Select'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-tasks">
                  <p>No tasks available in this roadmap.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="roadmap-actions">
            <button 
              className="btn btn--ghost"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button 
              className="btn btn--ghost"
              onClick={handleReset}
            >
              Reset
            </button>
            <button 
              className="btn btn--primary"
              onClick={handleAddToWorkspace}
              disabled={selectedTasks.length === 0}
            >
              Add to Workspace ({selectedTasks.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;