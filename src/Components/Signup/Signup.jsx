import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import './Signup.css';

const Signup = ({ onClose, switchToLogin, isPopup = true }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    aimRole: '',
    deadline: 90
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.post('/auth/account/create', formData);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Switch to login after successful signup
      setTimeout(() => {
        if (isPopup) {
          switchToLogin();
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    if (isPopup) {
      switchToLogin();
    } else {
      navigate('/login');
    }
  };

  if (isPopup) {
    return (
      <div className="signup-overlay">
        <div className="signup-popup">
          <button className="close-button" onClick={onClose}>&times;</button>
          
          <div className="signup-content">
            <div className="signup-header">
              <h2>Join SwitchBoard!</h2>
              <p className="signup-description">
                Create your account to start your learning journey and track your progress.
              </p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="aimRole">Target Role</label>
                <input
                  type="text"
                  id="aimRole"
                  name="aimRole"
                  value={formData.aimRole}
                  onChange={handleChange}
                  placeholder="e.g., SDE 2, Frontend Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="deadline">Target Timeline (days)</label>
                <input
                  type="number"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min="30"
                  max="365"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="switch-text">
              Already have an account?{' '}
              <button className="text-button" onClick={handleSwitchToLogin}>
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full page version
  return (
    <div className="signup-page">
      {/* Background with organic shapes */}
      <div className="auth-background">
        <div className="organic-blob blob-1"></div>
        <div className="organic-blob blob-2"></div>
        <div className="organic-blob blob-3"></div>
        <div className="organic-blob blob-4"></div>
      </div>

      {/* Navigation */}
      <nav className="auth-nav">
        <div className="auth-nav-brand" onClick={handleBackToHome}>
          <h2>Switch<span className="brand-accent">Board</span></h2>
        </div>
        <button className="auth-nav-back" onClick={handleBackToHome}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div className="auth-container">
        <div className="signup-card">
          <div className="signup-card-header">
            <h1>Create Account</h1>
            <p>Join our platform to start your journey</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <input
                type="text"
                name="aimRole"
                value={formData.aimRole}
                onChange={handleChange}
                placeholder="Career Goal"
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <select
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              >
                <option value={30}>1 Month</option>
                <option value={60}>2 Months</option>
                <option value={90}>3 Months</option>
                <option value={120}>4 Months</option>
                <option value={180}>6 Months</option>
                <option value={365}>1 Year</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="signup-button"
              disabled={loading}
            >
              {loading ? (
                <div className="button-loading">
                  <div className="spinner"></div>
                </div>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>

          <div className="login-prompt">
            <span>Already have an account? </span>
            <button className="login-link" onClick={handleSwitchToLogin}>Sign In →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
