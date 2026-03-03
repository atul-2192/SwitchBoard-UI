import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="portfolio-page-nav">
      <div className="portfolio-nav-tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`portfolio-nav-tab ${activeTab === "overview" ? "active" : ""}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`portfolio-nav-tab ${activeTab === "skills" ? "active" : ""}`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`portfolio-nav-tab ${activeTab === "projects" ? "active" : ""}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`portfolio-nav-tab ${activeTab === "experience" ? "active" : ""}`}
        >
          Experience
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`portfolio-nav-tab ${activeTab === "education" ? "active" : ""}`}
        >
          Education
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`portfolio-nav-tab ${
            activeTab === "certificates" ? "active" : ""
          }`}
        >
          Certificates
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`portfolio-nav-tab ${
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
