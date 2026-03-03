import React, { useState } from 'react';
import './AdminPage.css';
import WorkspaceManagement from './components/WorkspaceManagement';
import TaskManagement from './components/TaskManagement';
import AssignmentManagement from './components/AssignmentManagement';
import UserManagement from './components/UserManagement';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('workspaces');

  const tabs = [
    { id: 'workspaces', label: 'Workspaces', icon: '🏢', component: WorkspaceManagement },
    { id: 'assignments', label: 'Assignments', icon: '📋', component: AssignmentManagement },
    { id: 'tasks', label: 'Tasks', icon: '✅', component: TaskManagement },
    { id: 'users', label: 'Users', icon: '👥', component: UserManagement }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>
            <span className="admin-icon">⚙️</span>
            Administration Panel
          </h1>
          <p>Manage workspaces, assignments, tasks, and users</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <div className="admin-tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        <div className="admin-content-container">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;