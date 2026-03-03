import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './ResponsiveNavbar.css';

const ResponsiveNavbar = ({ onLoginClick, onSignupClick, onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'show' : ''}`} onClick={closeMobileMenu}></div>
      
      {/* Navigation */}
      <nav className="responsive-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" onClick={closeMobileMenu}>
              <h2>Switch<span className="brand-accent">Board</span></h2>
            </Link>
          </div>
          
          <div className={`nav-links ${isMobileMenuOpen ? '' : ''}`}>
            <Link to="/" onClick={() => { closeMobileMenu(); }} className="nav-link">Dashboard</Link>
            <Link to="/interview-experiences" onClick={() => { closeMobileMenu(); }} className="nav-link">Interviews</Link>
            {user && (
              <>
                <Link to="/roadmap" onClick={() => { closeMobileMenu(); }} className="nav-link">Roadmap</Link>
                <Link to="/kanban" onClick={() => { closeMobileMenu(); }} className="nav-link">Workspace</Link>
                <Link to="/profile" onClick={() => { closeMobileMenu(); }} className="nav-link">Profile</Link>
                <Link to="/portfolio" onClick={() => { closeMobileMenu(); }} className="nav-link">Portfolio</Link>
              </>
            )}
          </div>

          <div className={`nav-actions ${isMobileMenuOpen ? '' : ''}`}>
            {user ? (
              <>
                <button className="nav-btn secondary" onClick={() => { onLogout(); closeMobileMenu(); }}>
                  Logout
                </button>
                <div className="nav-theme-toggle">
                  <ThemeToggle />
                </div>
              </>
            ) : (
              <>
                <button className="nav-btn secondary" onClick={() => { onLoginClick(); closeMobileMenu(); }}>
                  Login
                </button>
                <button className="nav-btn primary" onClick={() => { onSignupClick(); closeMobileMenu(); }}>
                  Get Started
                </button>
                <div className="nav-theme-toggle">
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>
          
          {/* Mobile Hamburger Button */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu show">
              <div className="mobile-menu-links">
                <Link to="/" onClick={() => { closeMobileMenu(); }} className="mobile-nav-link">Dashboard</Link>
                <Link to="/interview-experiences" onClick={() => { closeMobileMenu(); }} className="mobile-nav-link">Interviews</Link>
                {user && (
                  <>
                    <Link to="/roadmap" onClick={() => { closeMobileMenu(); }} className="mobile-nav-link">Roadmap</Link>
                    <Link to="/kanban" onClick={() => { closeMobileMenu(); }} className="mobile-nav-link">Workspace</Link>
                    <Link to="/profile" onClick={() => { closeMobileMenu(); }} className="mobile-nav-link">Profile</Link>
                    <Link to="/portfolio" onClick={() => { closeMobileMenu(); }} className="mobile-nav-link">Portfolio</Link>
                  </>
                )}
              </div>
              <div className="mobile-menu-actions">
                {user ? (
                  <>
                    <button className="mobile-nav-btn secondary" onClick={() => { onLogout(); closeMobileMenu(); }}>
                      Logout
                    </button>
                    <div className="mobile-nav-theme">
                      <ThemeToggle />
                    </div>
                  </>
                ) : (
                  <>
                    <button className="mobile-nav-btn secondary" onClick={() => { onLoginClick(); closeMobileMenu(); }}>
                      Login
                    </button>
                    <button className="mobile-nav-btn primary" onClick={() => { onSignupClick(); closeMobileMenu(); }}>
                      Get Started
                    </button>
                    <div className="mobile-nav-theme">
                      <ThemeToggle />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default ResponsiveNavbar;