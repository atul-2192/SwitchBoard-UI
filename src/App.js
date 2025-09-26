import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import LeaderBoard from "./Pages/LeaderBoard/LeaderBoard";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import Portfolio from "./Pages/Portfolio/Portfolio";
import AssignmentPage from "./Pages/Assignments/Assignment";
import TaskBuilder from "./Pages/TaskBuilder/TaskBuilder";
import Roadmap from "./Pages/Roadmap/Roadmap";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
    setIsLoggedIn(true);
    setShowLoginPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Convert path to activePage format
  const getActivePage = (pathname) => {
    switch (pathname) {
      case '/':
        return 'dashboard';
      case '/leaderboard':
        return 'leaderboard';
      case '/assignments':
        return 'assignments';
      case '/taskbuilder':
        return 'taskbuilder';
      case '/roadmap':
        return 'roadmap';
      case '/profile':
        return 'profile';
      case '/portfolio':
        return 'portfolio';
      default:
        return 'dashboard';
    }
  };

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLoginClick={handleLoginClick} 
        activePage={getActivePage(location.pathname)}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/assignments" element={<AssignmentPage />} />
        <Route path="/taskbuilder" element={<TaskBuilder />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:userId" element={<Portfolio />} />
      </Routes>
      
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
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
