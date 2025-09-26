import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="portfolio-nav">
      <div className="nav-tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`nav-tab ${activeTab === "skills" ? "active" : ""}`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`nav-tab ${activeTab === "projects" ? "active" : ""}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`nav-tab ${activeTab === "experience" ? "active" : ""}`}
        >
          Experience
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`nav-tab ${activeTab === "education" ? "active" : ""}`}
        >
          Education
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`nav-tab ${
            activeTab === "certificates" ? "active" : ""
          }`}
        >
          Certificates
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`nav-tab ${
            activeTab === "achievements" ? "active" : ""
          }`}
        >
          Achievements
        </button>
      </div>
    </nav>
  );
};

export default TabNavigation;
