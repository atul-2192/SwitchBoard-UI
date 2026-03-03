import React, { useState } from "react";
import Banner from "../../Components/Banner/Banner";    
import Stories from "../../Components/Stories/Stories";
import Login from "../../Components/Login/Login";
import Signup from "../../Components/Signup/Signup";
import FloatingCreateButton from "../../Components/FloatingCreateButton/FloatingCreateButton";
import { useAuth } from "../../context/AuthContext";

import "./Dashboard.css";

export default function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleCreateSuccess = () => {
    // Optionally refresh data or show success message
  };

  return (
      <div className="sb-app">
        <main>
          <Banner />
          <Stories />
        </main>

        {showLogin && (
          <Login 
            onClose={handleCloseModals}
            switchToSignup={handleSignupClick}
          />
        )}
        
        {showSignup && (
          <Signup
            onClose={handleCloseModals}
            switchToLogin={handleLoginClick}
          />
        )}

        {/* Floating Create Button - only show for logged in users */}
        {isAuthenticated && <FloatingCreateButton onSuccess={handleCreateSuccess} />}
      </div>
    // </ThemeProvider>
  );
}

