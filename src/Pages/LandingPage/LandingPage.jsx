import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ResponsiveNavbar from '../../Components/ResponsiveNavbar/ResponsiveNavbar';
import './LandingPage.css';

const LandingPage = ({ onLoginClick, onSignupClick, onLogout = () => {} }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll function
  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onSignupClick();
    }
  };

  const handleExploreFeatures = () => {
    navigate('/interview-experiences');
  };

  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''}`}>
      {/* Responsive Navigation */}
      <ResponsiveNavbar
        user={user}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onLogout={onLogout}
      />

      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-shape shape-1" style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>
        <div className="floating-shape shape-2" style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
        <div className="floating-shape shape-3" style={{ transform: `translateY(${scrollY * 0.08}px)` }}></div>
        <div className="floating-shape shape-4" style={{ transform: `translateY(${scrollY * 0.12}px)` }}></div>
        <div className="floating-shape shape-5" style={{ transform: `translateY(${scrollY * 0.06}px)` }}></div>
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">✨ Transform Your Career Journey</span>
            </div>
            
            <h1 className="hero-title">
              Unlock Your
              <span className="title-gradient"> Professional </span>
              <br />
              Potential with
              <span className="title-highlight"> SwitchBoard</span>
            </h1>

            <p className="hero-description">
              Discover real interview experiences, master project management with Kanban boards, 
              and build an impressive portfolio. Your one-stop platform for career advancement 
              and professional growth in the tech industry.
            </p>

            <div className="hero-actions">
              <button className="hero-btn primary" onClick={handleGetStarted}>
                <span>Get Started Free</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="hero-btn secondary" onClick={handleExploreFeatures}>
                <span>Explore Features</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Success Stories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Companies</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-container">
              <div className="visual-card card-1">
                <div className="card-header">
                  <div className="card-avatar"></div>
                  <div className="card-info">
                    <h4>Google Interview</h4>
                    <p>Software Engineer</p>
                  </div>
                </div>
                <div className="card-content">
                  "Amazing experience! Got the offer with SwitchBoard's help..."
                </div>
              </div>

              <div className="visual-card card-2">
                <div className="kanban-preview">
                  <div className="kanban-column">
                    <h5>To Do</h5>
                    <div className="kanban-task"></div>
                    <div className="kanban-task"></div>
                  </div>
                  <div className="kanban-column">
                    <h5>In Progress</h5>
                    <div className="kanban-task"></div>
                  </div>
                  <div className="kanban-column">
                    <h5>Done</h5>
                    <div className="kanban-task"></div>
                    <div className="kanban-task"></div>
                    <div className="kanban-task"></div>
                  </div>
                </div>
              </div>

              <div className="visual-card card-3">
                <div className="portfolio-preview">
                  <div className="portfolio-header">
                    <div className="portfolio-avatar"></div>
                    <h4>John's Portfolio</h4>
                  </div>
                  <div className="portfolio-projects">
                    <div className="project-item"></div>
                    <div className="project-item"></div>
                    <div className="project-item"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section">
        <div className="features-container">
          <div className="section-header">
            <div className="section-badge">
              <span>🚀 Powerful Features</span>
            </div>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-description">
              Comprehensive tools and resources designed to accelerate your career growth
              and help you land your dream job.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card feature-interview">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Interview Experiences</h3>
              <p>Access thousands of real interview experiences from top companies. Learn from others' journeys and prepare effectively.</p>
              <ul>
                <li>Real interview questions</li>
                <li>Company insights</li>
                <li>Success tips & strategies</li>
                <li>Salary negotiations</li>
              </ul>
              <button className="feature-btn" onClick={handleExploreFeatures}>
                Explore Stories
              </button>
            </div>

            <div className="feature-card feature-kanban">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="7" y="7" width="3" height="9" fill="currentColor"/>
                  <rect x="14" y="7" width="3" height="5" fill="currentColor"/>
                </svg>
              </div>
              <h3>Kanban Boards</h3>
              <p>Organize your job search and projects with powerful Kanban boards. Track progress and stay motivated.</p>
              <ul>
                <li>Visual task management</li>
                <li>Team collaboration</li>
                <li>Progress tracking</li>
                <li>Custom workflows</li>
              </ul>
              <button className="feature-btn" onClick={() => navigate('/kanban')}>
                Try Kanban
              </button>
            </div>

            <div className="feature-card feature-portfolio">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Portfolio Builder</h3>
              <p>Create stunning portfolios that showcase your skills and projects. Stand out from the competition.</p>
              <ul>
                <li>Professional templates</li>
                <li>Project showcases</li>
                <li>Skills highlighting</li>
                <li>Mobile responsive</li>
              </ul>
              <button className="feature-btn" onClick={() => navigate('/portfolio')}>
                Build Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About/CTA Section */}
      <section ref={aboutRef} className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Transform Your Career?
            </h2>
            <p className="cta-description">
              Join thousands of professionals who have accelerated their career growth with SwitchBoard. 
              Start your journey today and unlock new opportunities.
            </p>
            <div className="cta-actions">
              <button className="cta-btn primary" onClick={handleGetStarted}>
                Get Started Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="cta-features">
              <div className="cta-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Free to start</span>
              </div>
              <div className="cta-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;