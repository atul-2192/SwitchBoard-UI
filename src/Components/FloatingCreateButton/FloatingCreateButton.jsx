import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingCreateButton.css';

const FloatingCreateButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create');
  };

  return (
    <button 
      className="floating-create-button"
      onClick={handleClick}
      title="Create new assignment, task, or interview experience"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default FloatingCreateButton;