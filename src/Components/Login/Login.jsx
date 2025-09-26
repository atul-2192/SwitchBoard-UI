import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onClose, switchToSignup, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:9000/auth/send-otp', { email });
      setShowOtpField(true);
      setSuccess('OTP sent successfully! Please check your email.');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('User not found. Please sign up first.');
        setTimeout(() => {
          switchToSignup();
        }, 2000);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:9000/auth/verify-otp', {
        email,
        code: otp
      });

      // Store the JWT token
      localStorage.setItem('token', response.data.token);
      setSuccess('Login successful!');
      
      // Close the popup and call onSuccess after successful login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
          window.location.reload(); // Refresh to update UI if no onSuccess handler
        }
      }, 1500);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <h2>Welcome Back!</h2>
        <p className="description">
          Login to access your personalized dashboard and track your progress.
        </p>

        <form onSubmit={showOtpField ? handleVerifyOtp : handleSendOtp}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={showOtpField}
            />
          </div>

          {showOtpField && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
              />
              <p className="otp-notice">
                ⚠️ OTP is valid for 5 minutes. Do not share it with anyone.
              </p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (showOtpField ? 'Verify OTP' : 'Send OTP')}
          </button>
        </form>

        <p className="switch-text">
          New to the platform?{' '}
          <button className="text-button" onClick={switchToSignup}>
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
