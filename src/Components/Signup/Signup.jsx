import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = ({ onClose, switchToLogin }) => {
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
      await axios.post('http://localhost:9000/api/users/create', formData);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Switch to login after successful signup
      setTimeout(() => {
        switchToLogin();
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

  return (
    <div className="signup-overlay">
      <div className="signup-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <h2>Create Account</h2>
        <p className="description">
          Join our platform to start your learning journey and track your progress.
        </p>

        <form onSubmit={handleSubmit}>
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
          <button className="text-button" onClick={switchToLogin}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
