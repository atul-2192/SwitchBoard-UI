import React from 'react';
import './KanbanBanner.css';

const KanbanBanner = () => {
  return (
    <div className="kanban-banner">
      <div className="banner-background"></div>
      
      <div className="banner-container">
        <div className="banner-content">
          <div className="banner-text">
            <h1 className="banner-title">The Modern Workspace for the Achievers.</h1>
            <h2 className="banner-subtitle">Built for creators, builders, and teams who want control over their work.</h2>
            <p className="banner-description">
              SwitchBoard gives you a unified visual board to organize tasks, track progress, and execute work with clarity, speed, and purpose.
            </p>
          </div>
          
          <div className="banner-stats">
            <div className="stat-item">
              <div className="stat-number" id="backlog-count">0</div>
              <div className="stat-label">Backlog</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" id="ongoing-count">0</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" id="completed-count">0</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="banner-actions">
          <div className="action-info">
            <span className="info-icon">💡</span>
            <span className="info-text">Drag and drop cards between columns to update status</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBanner;