import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import Banner from "../../Components/Banner/Banner";    
import Stories from "../../Components/Stories/Stories";
import Login from "../../Components/Login/Login";
import Signup from "../../Components/Signup/Signup";

import "./Dashboard.css";

export default function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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

  return (
      <div className="sb-app">
        <main>
          <Banner />
          <Stories />
        </main>
        <Footer />

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
      </div>
    // </ThemeProvider>
  );
}

