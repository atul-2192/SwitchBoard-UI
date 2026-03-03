import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function Navbar({ activePage = 'dashboard', isLoggedIn, onLoginClick, onLogout }) {
  const navToggleRef = useRef(null);
  const navigate = useNavigate();

  // Function to close mobile navbar
  const closeMobileNav = () => {
    if (navToggleRef.current) {
      navToggleRef.current.checked = false;
    }
  };

  // Handle navigation with mobile nav close
  const handleNavigation = (path, callback) => {
    closeMobileNav();
    if (callback) {
      // For button actions like login/logout
      callback();
    } else {
      // For regular navigation
      navigate(path);
    }
  };

  return (
    <header className="sb-nav">
      <div className="sb-nav__inner">
        <Link className="sb-nav__brand" to="/" onClick={closeMobileNav}>
          {/* Logo with distinctive styling */}
          <span className="sb-nav__logo-text">Switch<span className="sb-nav__logo-highlight">Board</span></span>
        </Link>

        <input ref={navToggleRef} id="sb-nav-toggle" type="checkbox" aria-label="Open menu" />
        <label htmlFor="sb-nav-toggle" className="sb-nav__burger" aria-hidden />

        <nav className="sb-nav__links" aria-label="Primary">
          <Link to="/" className={activePage === 'dashboard' ? 'active' : ''} onClick={closeMobileNav}>
            Dashboard
          </Link>
          <Link to="/interview-experiences" className={activePage === 'interview-experiences' ? 'active' : ''} onClick={closeMobileNav}>
            Interviews
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/roadmap" className={activePage === 'roadmap' ? 'active' : ''} onClick={closeMobileNav}>
                Roadmap
              </Link>
              <Link to="/kanban" className={activePage === 'kanban' ? 'active' : ''} onClick={closeMobileNav}>
                Workspace
              </Link>
              <Link to="/profile" className={activePage === 'profile' ? 'active' : ''} onClick={closeMobileNav}>
                Profile
              </Link>
              <Link to="/portfolio" className={activePage === 'portfolio' ? 'active' : ''} onClick={closeMobileNav}>
                Portfolio
              </Link>
              <button 
                onClick={() => handleNavigation(null, onLogout)} 
                className="sb-nav__auth-button sb-nav__logout"
              >
                Logout
              </button>
              <div className="sb-nav__theme-toggle">
                <ThemeToggle />
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavigation(null, onLoginClick)} 
                className="sb-nav__auth-button"
              >
                Login
              </button>
              <div className="sb-nav__theme-toggle">
                <ThemeToggle />
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
