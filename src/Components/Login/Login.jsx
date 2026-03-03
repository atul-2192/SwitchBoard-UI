import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { apiClient } from '../../services/apiClient';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = ({ onClose, switchToSignup, onSuccess, isPopup = true }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      await apiClient.post('/auth/send-otp', { email });
      setShowOtpField(true);
      setSuccess('OTP sent successfully! Please check your email.');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('User not found. Please sign up first.');
        setTimeout(() => {
          if (isPopup) {
            switchToSignup();
          } else {
            navigate('/signup');
          }
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

    if (!otp || otp.trim().length === 0) {
      setError('Please enter the OTP.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/verify-otp', {
        email,
        otp: otp.trim()
      });

      const tokenData = response.data;
      
      if (!tokenData.accessToken) {
        setError('Login failed: No access token received');
        return;
      }

      // Use AuthContext login method to properly update state
      login(tokenData);

      setSuccess('Login successful!');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else if (isPopup) {
          onClose();
          window.location.reload();
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSwitchToSignup = () => {
    if (isPopup) {
      switchToSignup();
    } else {
      navigate('/signup');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      // Call the backend with the Google ID token
      const response = await authService.googleLogin(credentialResponse.credential);
      
      // Use AuthContext login method to properly update state
      login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn || 3600
      });
      
      setSuccess('Google login successful!');
      
      // Check if new user and redirect accordingly
      setTimeout(() => {
        if (response.newUser) {
          // Redirect to onboarding/profile completion
          navigate('/profile');
        } else {
          // Redirect to dashboard
          if (onSuccess) {
            onSuccess();
          } else if (isPopup) {
            onClose();
            window.location.reload();
          } else {
            navigate('/dashboard');
          }
        }
      }, 1500);
      
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setError('Google login failed. Please try again.');
  };

  if (isPopup) {
    return (
      <div className="login-overlay">
        <div className="login-popup">
          {/* Background with organic shapes */}
          <div className="popup-background">
            <div className="organic-blob blob-1"></div>
            <div className="organic-blob blob-2"></div>
            <div className="organic-blob blob-3"></div>
          </div>

          <button className="close-button" onClick={onClose}>&times;</button>
          
          <div className="popup-wrapper">
            {/* Welcome Content */}
            <div className="popup-welcome">
              <div className="popup-welcome-content">
                <h1>Welcome Back to <br /><span className="brand-highlight">SwitchBoard</span></h1>
                <p className="welcome-subtitle">
                  Access your personalized dashboard and continue your learning journey.
                </p>
                <div className="welcome-features">
                  <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <span>Personalized Learning Paths</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <span>Progress Tracking</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🚀</div>
                    <span>Career Goal Achievement</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="popup-form-section">
              <div className="login-header">
                <h2>Sign In</h2>
                <p className="login-description">
                  Enter your email address to receive a verification code
                </p>
              </div>

            <form className="login-form" onSubmit={showOtpField ? handleVerifyOtp : handleSendOtp}>
              <div className="input-group">
                <div className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={showOtpField}
                />
              </div>

              {showOtpField && (
                <div className="input-group">
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength="6"
                    required
                  />
                  <p className="otp-notice">
                    Check your email for the verification code
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
                {loading ? (
                  <div className="button-loading">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  showOtpField ? 'VERIFY & SIGN IN' : 'SEND CODE'
                )}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                theme="outline"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>

            <p className="switch-text">
              New to SwitchBoard?{' '}
              <button className="text-button" onClick={handleSwitchToSignup}>
                Create account
              </button>
            </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full page version
  return (
    <div className="login-page">
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
        <div className="login-wrapper">
          {/* Welcome Content */}
          <div className="login-welcome">
            <div className="welcome-content">
              <h1>Welcome Back to <br /><span className="brand-highlight">SwitchBoard</span></h1>
              <p className="welcome-subtitle">
                Access your personalized dashboard and continue your learning journey.
              </p>
              <div className="welcome-features">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <span>Personalized Learning Paths</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <span>Progress Tracking</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚀</div>
                  <span>Career Goal Achievement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="login-card">
            <div className="login-card-header">
              <h2>Sign In</h2>
              <p>Enter your email address to receive a verification code</p>
            </div>

            <form className="login-form" onSubmit={showOtpField ? handleVerifyOtp : handleSendOtp}>
              <div className="input-group">
                <div className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={showOtpField}
                />
              </div>

              {showOtpField && (
                <div className="input-group">
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength="6"
                    required
                  />
                </div>
              )}



              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="button-loading">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  showOtpField ? 'VERIFY OTP' : 'SEND CODE'
                )}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                theme="outline"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>

          <div className="signup-prompt">
            <span>New to SwitchBoard? </span>
            <button className="signup-link" onClick={handleSwitchToSignup}>Create Account →</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
