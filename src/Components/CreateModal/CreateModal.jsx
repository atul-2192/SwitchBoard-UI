import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkspaceForm from './WorkspaceForm';
import './CreateModal.css';

const CreateModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeSelector, setShowTypeSelector] = useState(true);

  // Reset modal state when closing/opening
  useEffect(() => {
    if (isOpen) {
      setSelectedType(null);
      setShowTypeSelector(true);
      // Prevent body scroll when modal is open
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleTypeSelect = (type) => {
    // Navigate to dedicated pages for assignment and task
    if (type === 'assignment') {
      onClose(); // Close modal first
      navigate('/create-assignment');
      return;
    }
    
    if (type === 'task') {
      onClose(); // Close modal first
      navigate('/create-task');
      return;
    }
    
    // For workspace, show the inline form (no dedicated page)
    setSelectedType(type);
    setShowTypeSelector(false);
  };

  const handleBack = () => {
    setSelectedType(null);
    setShowTypeSelector(true);
  };

  const handleSuccess = () => {
    setSelectedType(null);
    setShowTypeSelector(true);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-modal-header">
          <h2>
            {showTypeSelector ? 'Create New' : 
             selectedType === 'workspace' ? 'Create Workspace' :
             selectedType === 'assignment' ? 'Create Assignment' :
             'Create Task'}
          </h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="create-modal-content">
          {showTypeSelector && (
            <div className="type-selector">
              <p className="type-selector-description">
                What would you like to create?
              </p>
              
              <div className="type-options">
                <button 
                  className="type-option"
                  onClick={() => handleTypeSelect('workspace')}
                >
                  <div className="type-icon workspace-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 7H21V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="type-content">
                    <h3>Workspace</h3>
                    <p>A container for organizing assignments and tasks</p>
                  </div>
                </button>

                <button 
                  className="type-option"
                  onClick={() => handleTypeSelect('assignment')}
                >
                  <div className="type-icon assignment-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="type-content">
                    <h3>Assignment</h3>
                    <p>A collection of related tasks forming a larger objective</p>
                  </div>
                </button>

                <button 
                  className="type-option"
                  onClick={() => handleTypeSelect('task')}
                >
                  <div className="type-icon task-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="type-content">
                    <h3>Task</h3>
                    <p>An individual work item that can be tracked and assigned</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {!showTypeSelector && selectedType === 'workspace' && (
            <div className="form-container">
              <WorkspaceForm onSuccess={handleSuccess} onCancel={handleBack} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;