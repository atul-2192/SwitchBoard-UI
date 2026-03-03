import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ResponsiveNavbar from '../../Components/ResponsiveNavbar/ResponsiveNavbar';
import './CreateSelection.css';

const CreateSelection = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSelection = (type) => {
    if (type === 'assignment') {
      navigate('/create-assignment');
    } else if (type === 'task') {
      navigate('/create-task');
    }
  };

  const handleBack = () => {
    navigate('/kanban');
  };

  return (
    <div className="create-selection-page">
      <ResponsiveNavbar
        user={user}
        onLogout={logout}
      />

      <div className="create-selection-container">
        {/* Header */}
        <div className="create-selection-header">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="page-main-title">What would you like to create?</h1>
          <p className="page-description">
            Choose the type of item you want to create
          </p>
        </div>

        {/* Selection Cards */}
        <div className="selection-grid">
          {/* Assignment Card */}
          <button className="selection-card" onClick={() => handleSelection('assignment')}>
            <div className="card-icon assignment-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="card-title">Create Assignment</h2>
            <p className="card-description">
              A collection of related tasks forming a larger objective. Organize your work into structured assignments.
            </p>
            <div className="card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Task Card */}
          <button className="selection-card" onClick={() => handleSelection('task')}>
            <div className="card-icon task-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="card-title">Create Task</h2>
            <p className="card-description">
              An individual work item that can be tracked and assigned. Break down your assignments into actionable tasks.
            </p>
            <div className="card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSelection;
