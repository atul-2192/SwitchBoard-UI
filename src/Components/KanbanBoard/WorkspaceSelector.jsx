import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './WorkspaceSelector.css';
import { userWorkspaceService } from '../../services/userWorkspaceService';

const WorkspaceSelector = ({ selectedWorkspace, onWorkspaceChange, onCreateClick, onAssessmentChange }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [assessmentDropdownOpen, setAssessmentDropdownOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const hasInitialized = useRef(false);
  const isLoadingWorkspaces = useRef(false);
  const workspaceDropdownRef = useRef(null);
  const assessmentDropdownRef = useRef(null);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      // Load assessments when workspace changes
      loadAssessments(selectedWorkspace);
      setSelectedAssessment(''); // Reset assessment selection
      // Notify parent of assessment reset
      if (onAssessmentChange) {
        onAssessmentChange('');
      }
    }
  }, [selectedWorkspace]);

  // Handle click outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setWorkspaceDropdownOpen(false);
      }
      if (assessmentDropdownRef.current && !assessmentDropdownRef.current.contains(event.target)) {
        setAssessmentDropdownOpen(false);
      }
    };

    // Fallback: Handle clicks on dropdown options directly
    const handleDropdownOptionClick = (event) => {
      const dropdownOption = event.target.closest('.dropdown-option');
      if (dropdownOption) {

        const workspaceId = dropdownOption.getAttribute('data-workspace-id');
        const assessmentId = dropdownOption.getAttribute('data-assessment-id');
        
        if (workspaceId) {

          onWorkspaceChange(workspaceId);
          setWorkspaceDropdownOpen(false);
        } else if (assessmentId) {

          setSelectedAssessment(assessmentId);
          setAssessmentDropdownOpen(false);
          if (onAssessmentChange) {
            onAssessmentChange(assessmentId);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleDropdownOptionClick, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleDropdownOptionClick, true);
    };
  }, [onWorkspaceChange, onAssessmentChange]);

  const loadWorkspaces = async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingWorkspaces.current) return;
    
    try {
      setLoading(true);
      isLoadingWorkspaces.current = true;
      

      
      // Initialize user workspaces (creates defaults if they don't exist)
      const userWorkspaces = await userWorkspaceService.initializeUserWorkspaces();
      setWorkspaces(userWorkspaces);
      



      
      // Select first workspace if none selected - use a flag to prevent infinite calls
      // ONLY initialize on first load, don't override user selections
      if (!selectedWorkspace && userWorkspaces.length > 0 && !hasInitialized.current) {
        hasInitialized.current = true;

        onWorkspaceChange(userWorkspaces[0].id);
      } else {

      }
    } catch (error) {

      // Fallback to mock data
      setWorkspaces([
        {
          id: 'personal-workspace',
          name: '🏠 Personal Workspace',
          workspaceType: 'PERSONAL',
          description: 'Your private workspace for personal tasks'
        },
        {
          id: 'roadmaps-workspace', 
          name: '🗺️ Learning Roadmaps',
          workspaceType: 'ROADMAPS',
          description: 'Track your learning journey'
        },
        {
          id: 'group-workspace',
          name: '👥 Group Projects',
          workspaceType: 'GROUP_PROJECT',
          description: 'Collaborate with others'
        }
      ]);
    } finally {
      setLoading(false);
      isLoadingWorkspaces.current = false;
    }
  };

  const loadAssessments = async (workspaceId) => {
    try {
      // Use the actual API to load assessments/assignments for the workspace
      const assignments = await userWorkspaceService.getWorkspaceAssignments(workspaceId);
      
      // Transform assignments to match our assessment format
      const formattedAssessments = assignments.map(assignment => ({
        id: assignment.id,
        name: assignment.title || assignment.name,
        description: assignment.description || 'No description available',
        type: assignment.type || 'Assignment',
        status: assignment.status || 'Active',
        dueDate: assignment.dueDate,
        createdAt: assignment.createdAt
      }));
      
      setAssessments(formattedAssessments);
    } catch (error) {

      // Only fall back to empty array, no mock data
      setAssessments([]);
    }
  };

  const calculateDropdownPosition = (ref) => {
    if (!ref.current) return { top: 0, left: 0, width: 0 };
    
    const selectElement = ref.current.querySelector('.workspace-select');
    if (!selectElement) return { top: 0, left: 0, width: 0 };
    
    const rect = selectElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Ensure minimum width and adjust for mobile
    const dropdownWidth = Math.max(rect.width, 250);
    
    // Calculate left position, ensure it doesn't go off screen
    let left = rect.left;
    if (left + dropdownWidth > viewportWidth) {
      left = viewportWidth - dropdownWidth - 10; // 10px margin
    }
    if (left < 10) {
      left = 10; // 10px margin from left edge
    }
    
    // Calculate top position, ensure dropdown fits in viewport
    let top = rect.bottom + 8;
    const dropdownMaxHeight = 280;
    if (top + dropdownMaxHeight > viewportHeight) {
      // Show dropdown above the select element if no space below
      top = rect.top - dropdownMaxHeight - 8;
      if (top < 10) {
        // If still not enough space above, show below with scroll
        top = rect.bottom + 8;
      }
    }
    
    return {
      top: Math.max(10, top),
      left: left,
      width: dropdownWidth
    };
  };

  const getWorkspaceTypeInfo = (workspaceType) => {
    return userWorkspaceService.getWorkspaceTypeInfo(workspaceType);
  };

  const selectedWorkspaceData = useMemo(() => {
    const workspace = workspaces.find(ws => ws.id === selectedWorkspace);




    return workspace;
  }, [workspaces, selectedWorkspace]);
  
  const selectedAssessmentData = useMemo(() => 
    assessments.find(assessment => assessment.id === selectedAssessment), 
    [assessments, selectedAssessment]
  );

  if (loading) {
    return (
      <div className="workspace-selector loading">
        <div className="selector-loading">
          <div className="loading-spinner"></div>
          <span>Loading workspaces...</span>
        </div>
      </div>
    );
  }

  const handleWorkspaceDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newOpen = !workspaceDropdownOpen;
    setWorkspaceDropdownOpen(newOpen);
    setAssessmentDropdownOpen(false); // Close other dropdown
    if (newOpen) {
      setTimeout(() => {
        const position = calculateDropdownPosition(workspaceDropdownRef);
        setDropdownPosition(position);

      }, 0);
    }
  };

  const handleAssessmentDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newOpen = !assessmentDropdownOpen;
    setAssessmentDropdownOpen(newOpen);
    setWorkspaceDropdownOpen(false); // Close other dropdown
    if (newOpen) {
      setTimeout(() => {
        const position = calculateDropdownPosition(assessmentDropdownRef);
        setDropdownPosition(position);

      }, 0);
    }
  };

  return (
    <div className="workspace-selector">
      {/* Workspace Dropdown */}
      <div className={`workspace-dropdown ${workspaceDropdownOpen ? 'dropdown-open' : ''}`} ref={workspaceDropdownRef}>
        <div className="dropdown-trigger" onClick={handleWorkspaceDropdownClick}>
          <div className="workspace-select">
            {selectedWorkspaceData ? (
              <>
                <span className="selected-workspace-icon">
                  {getWorkspaceTypeInfo(selectedWorkspaceData.workspaceType).icon}
                </span>
                <span className="selected-workspace-name">
                  {selectedWorkspaceData.name || getWorkspaceTypeInfo(selectedWorkspaceData.workspaceType).name}
                </span>
              </>
            ) : (
              <span>Select Workspace</span>
            )}
            <span className={`dropdown-arrow ${workspaceDropdownOpen ? 'open' : ''}`}>
              {workspaceDropdownOpen ? '▲' : '▼'}
            </span>
          </div>
        </div>
        
        {workspaceDropdownOpen && createPortal(
          <div 
            className="dropdown-menu" 
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 999999
            }}
          >
            {workspaces.map(workspace => {
              const typeInfo = getWorkspaceTypeInfo(workspace.workspaceType);
              const isSelected = workspace.id === selectedWorkspace;
              
              return (
                <div
                  key={workspace.id}
                  className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();


                    onWorkspaceChange(workspace.id);
                    setWorkspaceDropdownOpen(false);
                  }}
                  onMouseDown={(e) => {

                    e.preventDefault();
                    e.stopPropagation();
                    onWorkspaceChange(workspace.id);
                    setWorkspaceDropdownOpen(false);
                  }}
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  data-workspace-id={workspace.id}
                  role="button"
                  tabIndex={0}
                >
                  <span className="option-icon" style={{ color: typeInfo.color, pointerEvents: 'none' }}>
                    {typeInfo.icon}
                  </span>
                  <div className="option-content" style={{ pointerEvents: 'none' }}>
                    <span className="option-name" style={{ pointerEvents: 'none' }}>
                      {workspace.name || typeInfo.name}
                    </span>
                    <span className="option-description" style={{ pointerEvents: 'none' }}>
                      {workspace.description || typeInfo.description}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="selected-check" style={{ pointerEvents: 'none' }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>,
          document.body
        )}
      </div>

      {/* Assessment Dropdown */}
      {selectedWorkspace && (
        <div className={`assessment-dropdown ${assessmentDropdownOpen ? 'dropdown-open' : ''}`} ref={assessmentDropdownRef}>
          <div className="dropdown-trigger" onClick={handleAssessmentDropdownClick}>
            <div className="workspace-select">
              {selectedAssessmentData ? (
                <>
                  <span className="selected-workspace-icon">📋</span>
                  <span className="selected-workspace-name">
                    {selectedAssessmentData.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="selected-workspace-icon">🎯</span>
                  <span>Select Assessment</span>
                </>
              )}
              <span className={`dropdown-arrow ${assessmentDropdownOpen ? 'open' : ''}`}>
                {assessmentDropdownOpen ? '▲' : '▼'}
              </span>
            </div>
          </div>
          
          {assessmentDropdownOpen && createPortal(
            <div 
              className="dropdown-menu"
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 999999
              }}
            >
              {assessments.map(assessment => {
                const isSelected = assessment.id === selectedAssessment;
                
                return (
                  <div
                    key={assessment.id}
                    className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();


                      setSelectedAssessment(assessment.id);
                      setAssessmentDropdownOpen(false);
                      // Notify parent component of assessment change
                      if (onAssessmentChange) {
                        onAssessmentChange(assessment.id);
                      }
                    }}
                    onMouseDown={(e) => {

                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedAssessment(assessment.id);
                      setAssessmentDropdownOpen(false);
                      if (onAssessmentChange) {
                        onAssessmentChange(assessment.id);
                      }
                    }}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    data-assessment-id={assessment.id}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="option-icon" style={{ pointerEvents: 'none' }}>📋</span>
                    <div className="option-content" style={{ pointerEvents: 'none' }}>
                      <span className="option-name" style={{ pointerEvents: 'none' }}>
                        {assessment.name}
                      </span>
                      <span className="option-description" style={{ pointerEvents: 'none' }}>
                        {assessment.description}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="selected-check" style={{ pointerEvents: 'none' }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>,
            document.body
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;