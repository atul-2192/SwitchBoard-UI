import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterviewById, formatDate, calculateReadTime } from '../../services/interviewExperienceService';
import './InterviewDetail.css';

const InterviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInterviewById(id);
        setInterview(data);
      } catch (err) {

        setError(err.message || 'We\'re sorry, we couldn\'t find this interview experience. It may have been removed or the link might be incorrect.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInterview();
    }
  }, [id]);

  // Get company color for styling
  const getCompanyColor = (company) => {
    if (!company) return '#4aa4f7';
    
    const colors = {
      'google': '#4285F4',
      'microsoft': '#00BCF2',
      'apple': '#007AFF',
      'amazon': '#FF9900',
      'meta': '#1877F2',
      'netflix': '#E50914',
      'tesla': '#CC0000',
      'uber': '#000000',
      'airbnb': '#FF5A5F',
      'spotify': '#1DB954',
      'adobe': '#FF0000',
      'salesforce': '#00A1E0',
      'oracle': '#F80000',
      'ibm': '#1261FE',
      'intel': '#0071C5',
      'nvidia': '#76B900',
      'paypal': '#003087',
      'linkedin': '#0077B5',
    };
    
    return colors[company.toLowerCase()] || '#4aa4f7';
  };

  const getUserAvatar = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  const handleBackClick = () => {
    navigate('/interview-experiences');
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: interview.title,
          text: `Read this interview experience: ${interview.title}`,
          url: window.location.href,
        });
      } catch (err) {

      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {

      }
    }
  };

  if (loading) {
    return (
      <div className="interview-detail-container loading">
        <div className="detail-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-info">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
          <div className="skeleton-title"></div>
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interview-detail-container error">
        <div className="error-content">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Interview Not Found</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={handleBackClick}>
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  const companyColor = getCompanyColor(interview.companyTag);

  return (
    <div className="interview-detail-container">
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>
      
      <div className="interview-detail-wrapper">
        {/* Navigation */}
        <nav className="detail-nav">
          <button className="back-btn" onClick={handleBackClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Interviews
          </button>
          
          <div className="nav-actions">
            <button className="share-btn" onClick={handleShareClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share
            </button>
          </div>
        </nav>

        {/* Interview Content */}
        <article className="interview-article">
          {/* Header */}
          <header className="interview-header">
            <div className="author-info">
              <div 
                className="author-avatar"
                style={{ backgroundColor: companyColor }}
              >
                {getUserAvatar(interview.userName, interview.userEmail)}
              </div>
              <div className="author-details">
                <h3 className="author-name">
                  {interview.userName || 'Anonymous'}
                </h3>
                <div className="interview-meta">
                  <span className="post-date">
                    {formatDate(interview.createdAt)}
                  </span>
                  <span className="read-time">
                    {calculateReadTime(interview.content)}
                  </span>
                  {interview.updatedAt !== interview.createdAt && (
                    <span className="updated-badge">
                      Updated {formatDate(interview.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Company Tag */}
            {interview.companyTag && (
              <div 
                className="company-tag-large"
                style={{ backgroundColor: companyColor }}
              >
                {interview.companyTag}
              </div>
            )}
          </header>

          {/* Title */}
          <h1 className="interview-title">{interview.title}</h1>

          {/* Image */}
          {interview.imageName && !imageError && (
            <div className="interview-image-container">
              <img 
                src={interview.imageName}
                alt={`${interview.title} for ${interview.company}`}
                className="interview-image"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {/* Content */}
          <div className="interview-content">
            {interview.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index}>{paragraph}</p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>

          {/* Footer */}
          <footer className="interview-footer">
            <div className="engagement-actions">
              <button className="engagement-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Helpful
              </button>
              
              <button className="engagement-btn" onClick={handleShareClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Share
              </button>
            </div>

            <div className="interview-metadata">
              <div className="metadata-item">
                <span className="label">Interview ID:</span>
                <span className="value">#{interview.id.slice(-8)}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Posted:</span>
                <span className="value">{formatDate(interview.createdAt)}</span>
              </div>
            </div>
          </footer>
        </article>

        {/* Related section placeholder */}
        <aside className="related-section">
          <h3>More Interview Experiences</h3>
          <p>Check out other experiences from this company or similar roles.</p>
          <button className="browse-more-btn" onClick={handleBackClick}>
            Browse All Interviews
          </button>
        </aside>
      </div>
    </div>
  );
};

export default InterviewDetail;