import React from 'react';
import './ReadOnlyBanner.css';

/**
 * ReadOnlyBanner Component
 * Displays a banner indicating the portfolio is being viewed in read-only mode
 */
export default function ReadOnlyBanner({ portfolioOwnerName, onLoginClick }) {
  return (
    <div className="read-only-banner">
      <div className="read-only-banner-content">
        <div className="read-only-banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <div className="read-only-banner-text">
          <strong>Viewing {portfolioOwnerName ? `${portfolioOwnerName}'s` : 'this'} portfolio</strong>
          <span className="read-only-badge">Read Only</span>
        </div>
        {onLoginClick && (
          <button className="read-only-login-btn" onClick={onLoginClick}>
            Login to edit your portfolio
          </button>
        )}
      </div>
    </div>
  );
}
