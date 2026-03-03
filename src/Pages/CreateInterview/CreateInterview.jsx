import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createInterview } from '../../services/interviewExperienceService';
import { getFormOptions } from '../../types/interviewTypes';
import ResponsiveNavbar from '../../Components/ResponsiveNavbar/ResponsiveNavbar';
import Login from '../../Components/Login/Login';
import Signup from '../../Components/Signup/Signup';
import './CreateInterview.css';
import './CreateInterviewCoffeeTheme.css';

const CreateInterview = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const formOptions = getFormOptions();
  
  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Form state - Updated to match new API contract
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    companyName: '',
    role: '',
    interviewType: 'ON_CAMPUS',
    experienceLevel: 'FRESHER',
    outcome: 'WAITING',
    numberOfRounds: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    // Number of rounds validation (optional but must be valid if provided)
    if (formData.numberOfRounds && formData.numberOfRounds !== '') {
      const rounds = parseInt(formData.numberOfRounds);
      if (isNaN(rounds) || rounds < 1 || rounds > 10) {
        newErrors.numberOfRounds = 'Number of rounds must be between 1 and 10';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setSubmitError('Please log in to create an interview experience');
      handleLoginClick();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data matching new API contract
      const interviewData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        companyName: formData.companyName.trim(),
        role: formData.role.trim(),
        interviewType: formData.interviewType,
        experienceLevel: formData.experienceLevel,
        outcome: formData.outcome,
        numberOfRounds: formData.numberOfRounds ? parseInt(formData.numberOfRounds) : null
      };


      const response = await createInterview(interviewData);
      
      // Success - navigate to the interview list page
      navigate('/interview-experiences');
    } catch (error) {


      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        'Failed to create interview experience. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/interview-experiences');
  };

  return (
    <div className="create-interview-page">
      <ResponsiveNavbar
        user={user}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={logout}
      />

      <div className="create-interview-container">
        {/* Header */}
        <div className="create-interview-header">
          <div className="header-top">
            <button className="back-button" onClick={handleCancel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Interviews
            </button>
            <h1 className="page-main-title">Share Your Interview Experience</h1>
          </div>
          <p className="page-description">
            Help others prepare for their interviews by sharing your experience
          </p>
        </div>

        {/* Form */}
        <form className="create-interview-form" onSubmit={handleSubmit}>
          {submitError && (
            <div className="form-error-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {submitError}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Interview Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., SDE-1 Interview at Google"
              className={`form-input ${errors.title ? 'error' : ''}`}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            <span className="char-count">{formData.title.length}/100</span>
          </div>

          {/* Company */}
          <div className="form-group">
            <label htmlFor="companyName" className="form-label">
              Company Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="e.g., Google, Microsoft, Amazon"
              className={`form-input ${errors.companyName ? 'error' : ''}`}
            />
            {errors.companyName && <span className="error-message">{errors.companyName}</span>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role/Position <span className="required">*</span>
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Software Development Engineer - 1, Frontend Developer"
              className={`form-input ${errors.role ? 'error' : ''}`}
            />
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {/* Interview Type, Experience Level, Outcome - Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="interviewType" className="form-label">
                Interview Type <span className="required">*</span>
              </label>
              <select
                id="interviewType"
                name="interviewType"
                value={formData.interviewType}
                onChange={handleInputChange}
                className="form-input"
              >
                {formOptions.interviewTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel" className="form-label">
                Experience Level <span className="required">*</span>
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="form-input"
              >
                {formOptions.experienceLevels.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="outcome" className="form-label">
                Outcome <span className="required">*</span>
              </label>
              <select
                id="outcome"
                name="outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                className="form-input"
              >
                {formOptions.outcomes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Number of Rounds */}
          <div className="form-group">
            <label htmlFor="numberOfRounds" className="form-label">
              Number of Rounds <span className="optional">(Optional)</span>
            </label>
            <input
              type="number"
              id="numberOfRounds"
              name="numberOfRounds"
              value={formData.numberOfRounds}
              onChange={handleInputChange}
              placeholder="e.g., 3, 4, 5"
              className={`form-input ${errors.numberOfRounds ? 'error' : ''}`}
              min="1"
              max="10"
            />
            {errors.numberOfRounds && <span className="error-message">{errors.numberOfRounds}</span>}
            <span className="help-text">Enter a number between 1 and 10</span>
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Interview Experience <span className="required">*</span>
            </label>
            <div className="content-help">
              <p>Share your detailed interview experience. You can use Markdown for formatting:</p>
              <ul>
                <li><strong>Headings:</strong> ## Round 1: Technical Interview</li>
                <li><strong>Lists:</strong> - Bullet points or 1. Numbered lists</li>
                <li><strong>Code:</strong> Wrap code in `backticks` or ```triple backticks```</li>
                <li><strong>Bold:</strong> **bold text**</li>
              </ul>
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Share your interview experience in detail...&#10;&#10;Include:&#10;- Interview rounds and their format&#10;- Questions asked (technical, behavioral, HR)&#10;- Your preparation strategy&#10;- Tips for future candidates&#10;- Overall experience and insights"
              className={`form-textarea ${errors.content ? 'error' : ''}`}
              rows={15}
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
            <span className="char-count">{formData.content.length} characters (minimum 10)</span>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  Publishing...
                </>
              ) : (
                'Publish Experience'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <Login
          onClose={handleCloseModals}
          switchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          onSuccess={(userData) => {
            handleCloseModals();
          }}
          isPopup={true}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <Signup
          onClose={handleCloseModals}
          switchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          onSuccess={(userData) => {
            handleCloseModals();
          }}
          isPopup={true}
        />
      )}
    </div>
  );
};

export default CreateInterview;
