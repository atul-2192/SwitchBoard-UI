import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from "./Pages/LandingPage/LandingPage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import Portfolio from "./Pages/Portfolio/Portfolio";
import Roadmap from "./Pages/Roadmap/Roadmap";
import KanbanPage from "./Pages/KanbanPage/KanbanPage";
import InterviewExperience from "./Pages/InterviewExperience/InterviewExperience";
import InterviewDetail from "./Components/InterviewDetail/InterviewDetail";
import CreateInterview from "./Pages/CreateInterview/CreateInterview";
import CreateAssignment from "./Pages/CreateAssignment/CreateAssignment";
import CreateTask from "./Pages/CreateTask/CreateTask";
import CreateSelection from "./Pages/CreateSelection/CreateSelection";
import ResponsiveNavbar from "./Components/ResponsiveNavbar/ResponsiveNavbar";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { authService } from './services/authService';
import './App.css';

// Google OAuth Client ID - Must be loaded from environment variables
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function AppContent() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const location = useLocation();
  const { isAuthenticated, loading, logout: authLogout } = useAuth();

  // Check authentication status on app load
  useEffect(() => {
    // Set up auth failure callback to handle token expiration
    authService.setAuthFailureCallback((reason) => {
      authLogout();
      // Optional: Show login popup automatically
      // setShowLoginPopup(true);
    });
  }, [authLogout]);

  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };

  const handleLoginClose = () => {
    setShowLoginPopup(false);
  };

  const handleSwitchToSignup = () => {
    setShowLoginPopup(false);
    setShowSignupPopup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupPopup(false);
    setShowLoginPopup(true);
  };

  const handleSignupClose = () => {
    setShowSignupPopup(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
  };

  const handleLogout = () => {
    authLogout(); // Use AuthContext logout method
    // Redirect to home page
    window.location.href = '/';
  };

  // Convert path to activePage format
  const getActivePage = (pathname) => {
    switch (pathname) {
      case '/':
        return 'home';
      case '/dashboard':
        return 'dashboard';
      case '/roadmap':
        return 'roadmap';
      case '/kanban':
        return 'kanban';
      case '/profile':
        return 'profile';
      case '/portfolio':
        return 'portfolio';
      case '/interview-experiences':
        return 'interviews';
      case '/login':
        return 'login';
      case '/signup':
        return 'signup';
      default:
        if (pathname.startsWith('/interview-experiences/')) {
          return 'interviews';
        }
        return 'home';
    }
  };

  // Determine if navbar should be shown
  const shouldShowNavbar = () => {
    const hiddenPaths = ['/', '/login', '/signup'];
    return !hiddenPaths.includes(location.pathname);
  };

  // Show loading state while checking authentication
  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  return (
    <>
      {shouldShowNavbar() && (
        <ResponsiveNavbar 
          onLoginClick={handleLoginClick}
          onSignupClick={() => setShowSignupPopup(true)}
          onLogout={handleLogout}
        />
      )}
      <Routes>
        <Route path="/" element={<LandingPage onLoginClick={handleLoginClick} onSignupClick={() => setShowSignupPopup(true)} onLogout={handleLogout} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:userId" element={<Portfolio />} />
        <Route path="/interview-experiences" element={<InterviewExperience />} />
        <Route path="/interview-experiences/:id" element={<InterviewDetail />} />
        <Route path="/create" element={<CreateSelection />} />
        <Route path="/create-interview" element={<CreateInterview />} />
        <Route path="/create-assignment" element={<CreateAssignment />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/login" element={<Login onSuccess={handleLoginSuccess} isPopup={false} />} />
        <Route path="/signup" element={<Signup isPopup={false} />} />
      </Routes>
      
      {/* Global Footer */}
      <Footer />
      
      {/* Login Popup */}
      {showLoginPopup && (
        <Login 
          onClose={handleLoginClose} 
          switchToSignup={handleSwitchToSignup}
          onSuccess={handleLoginSuccess}
        />
      )}
      
      {/* Signup Popup */}
      {showSignupPopup && (
        <Signup 
          onClose={handleSignupClose} 
          switchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  );
}

function App() {
  // Show error if Google Client ID is not configured
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === '') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          maxWidth: '600px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <h1 style={{ color: '#e53e3e', marginTop: 0 }}>⚠️ Configuration Error</h1>
          <h2 style={{ color: '#2d3748' }}>Google Client ID Not Found</h2>
          <p style={{ color: '#4a5568', lineHeight: 1.6 }}>
            The Google OAuth Client ID is not configured. Please follow these steps:
          </p>
          <ol style={{ color: '#4a5568', lineHeight: 1.8 }}>
            <li>Make sure <code style={{background: '#f7fafc', padding: '2px 6px', borderRadius: '4px'}}>REACT_APP_GOOGLE_CLIENT_ID</code> is in your <code style={{background: '#f7fafc', padding: '2px 6px', borderRadius: '4px'}}>.env.local</code> file</li>
            <li>The file should contain:<br/>
              <pre style={{background: '#2d3748', color: '#68d391', padding: '15px', borderRadius: '8px', marginTop: '10px', overflow: 'auto'}}>
                REACT_APP_GOOGLE_CLIENT_ID=932645065631-tts3uj2pk4o7dgepgbhamkvolroiim2t.apps.googleusercontent.com
              </pre>
            </li>
            <li><strong>Restart the development server:</strong><br/>
              <pre style={{background: '#2d3748', color: '#90cdf4', padding: '15px', borderRadius: '8px', marginTop: '10px'}}>
                npm start
              </pre>
            </li>
          </ol>
          <p style={{ color: '#e53e3e', fontWeight: 'bold', marginTop: '20px' }}>
            ⚠️ Environment variables are only loaded when the server starts!
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
