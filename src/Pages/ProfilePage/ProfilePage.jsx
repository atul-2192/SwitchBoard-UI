import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import CountUp from "react-countup";
import "./ProfilePage.css";
import "../../Components/DarkModeStyles.css";

// Sample user data (in a real app, this would come from your backend API)
const userData = {
  name: "Atul Singh",
  email: "atulsingh@example.com",
  mobile: "+91 (XXX) XXX-XXXX",
  targetJob: "Full Stack Developer",
  numberOfDaysLeft: 85,
  totalPoints: 2840,
  avatar: "/assets/avatar-1.jpg",
  social: {
    leetcode: "atulkumarsingh952",
    linkedin: "atulsingh2192",
    github: "atul-2192",
  },
  cv: "/assets/sarah-chen-cv.pdf",
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="sb-app">
      <main className="profile-page">
        <div className="profile-container">
          {/* Profile Header */}
          <section className="profile-header">
            <div className="banner">
              <div className="banner-mesh"></div>
              <div className="banner-gradient"></div>
              <div className="banner-grid"></div>
              <div className="banner-overlay">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                
                {/* Modern Typography Banner */}
                <div className="banner-typography">
                  <h1 className="banner-name" data-text={userData.name}>{userData.name}</h1>
                  <div className="banner-title">
                    <span className="title-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2L2 7L12 12L22 7L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 17L12 22L22 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="title-text">{userData.targetJob}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-hero">
              <div className="profile-main-wrapper">
            

                {/* Main Card */}
                <div className="profile-main">

                  {/* Stats Section */}
                  <section className="profile-stats">
                    <div className="stat-card">
                      <span className="stat-label">Days Remaining</span>
                      <span className="stat-value">
                        <CountUp
                          end={userData.numberOfDaysLeft}
                          duration={2}
                          separator=","
                        />
                      </span>
                      <span className="stat-desc">Until target achievement</span>
                    </div>

                    <div className="stat-card highlight">
                      <span className="stat-label">Total Points</span>
                      <span className="stat-value">
                        <CountUp
                          end={userData.totalPoints}
                          duration={2.5}
                          separator=","
                        />
                      </span>
                    </div>

                    <span className="stat-desc">Keep up the great work!</span>
                  </section>

                  {/* Profile Details */}
                  <section className="profile-details">
                    <h2>Contact Information</h2>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">
                          <i className="icon">📧</i>Email
                        </span>
                        <span className="detail-value">{userData.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          <i className="icon">📱</i>Mobile
                        </span>
                        <span className="detail-value">{userData.mobile}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          <i className="icon">🎯</i>Target Position
                        </span>
                        <span className="detail-value">
                          {userData.targetJob}
                        </span>
                      </div>
                    </div>
                  </section>
                   
                  {/* Professional Links Section */}
                  <section className="profile-social">
                    <h2 className="section-title">Professional Links</h2>
                    <div className="social-grid">
                      <a
                        href={`https://leetcode.com/${userData.social.leetcode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-card leetcode"
                      >
                        <div className="social-icon">👨‍💻</div>
                        <div className="social-info">
                          <h3>LeetCode</h3>
                          <p>View Coding Profile</p>
                        </div>
                      </a>

                      <a
                        href="https://www.linkedin.com/in/atulsingh2192/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-card linkedin"
                      >
                        <div className="social-icon">💼</div>
                        <div className="social-info">
                          <h3>LinkedIn</h3>
                          <p>View Professional Profile</p>
                        </div>
                      </a>

                      <a
                        href="https://github.com/atul-2192"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-card github"
                      >
                        <div className="social-icon">📦</div>
                        <div className="social-info">
                          <h3>GitHub</h3>
                          <p>View Repositories</p>
                        </div>
                      </a>

                      <a href={userData.cv} download className="social-card cv">
                        <div className="social-icon">📄</div>
                        <div className="social-info">
                          <h3>Resume/CV</h3>
                          <p>Download PDF</p>
                        </div>
                      </a>
                    </div>
                  </section>

                  {/* Progress Section */}
                  <section className="profile-progress">
                    <h2>Journey Progress</h2>
                    <div className="progress-bar">
                      <div
                        className="progress-fill animate-progress"
                        style={{
                          width: `${Math.min(
                            100,
                            (userData.totalPoints / 5000) * 100
                          )}%`,
                          '--progress-width': `${Math.min(
                            100,
                            (userData.totalPoints / 5000) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      <CountUp
                        end={userData.totalPoints}
                        duration={2.5}
                        separator=","
                      />{" "}
                      points earned towards your next milestone (5,000 points)
                    </p>
                  </section>

                  {/* Quick Actions */}
                  <section className="profile-actions">
                    <button className="btn btn--primary">Update Profile</button>
                    <Link to="/portfolio" className="btn btn--secondary">
                      View Portfolio
                    </Link>
                    <button className="btn btn--ghost">
                      Download Progress Report
                    </button>
                  </section>

                  {/* Logout Section - Moved to bottom */}
                  <div className="profile-logout">
                    <button onClick={handleLogout} className="logout-button">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
