import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function Navbar({ activePage = 'dashboard', isLoggedIn, onLoginClick }) {
  return (
    <header className="sb-nav">
      <div className="sb-nav__inner">
        <Link className="sb-nav__brand" to="/">
          {/* Logo with distinctive styling */}
          <span className="sb-nav__logo-text">Switch<span className="sb-nav__logo-highlight">Board</span></span>
        </Link>

        <input id="sb-nav-toggle" type="checkbox" aria-label="Open menu" />
        <label htmlFor="sb-nav-toggle" className="sb-nav__burger" aria-hidden />

        <nav className="sb-nav__links" aria-label="Primary">
          <Link to="/" className={activePage === 'dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/assignments" className={activePage === 'assignments' ? 'active' : ''}>
                WorkSpace
              </Link>
              <Link to="/roadmap" className={activePage === 'roadmap' ? 'active' : ''}>
                Roadmap
              </Link>
              <Link to="/taskbuilder" className={activePage === 'taskbuilder' ? 'active' : ''}>
                 Assignment
              </Link>
              <Link to="/leaderboard" className={activePage === 'leaderboard' ? 'active' : ''}>
                Leader&nbsp;board
              </Link>
              <Link to="/profile" className={activePage === 'profile' ? 'active' : ''}>
                Profile
              </Link>
              <Link to="/portfolio" className={activePage === 'portfolio' ? 'active' : ''}>
                Portfolio
              </Link>
              <div className="sb-nav__theme-toggle">
                <ThemeToggle />
              </div>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className="sb-nav__auth-button">
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
