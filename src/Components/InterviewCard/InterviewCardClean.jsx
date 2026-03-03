import React from 'react';
import './InterviewCardClean.css';

const InterviewCardClean = ({ 
  interview = {}, 
  onCardClick,
  title = "Senior Software Engineer Interview at Google",
  description = "Comprehensive interview experience covering algorithmic problem-solving, system design architecture, and behavioral assessment. The process included multiple technical rounds focusing on data structures, algorithms, and scalable system design principles.",
  author = "Sarah Chen",
  date = "Nov 15, 2024",
  readTime = 4,
  isUpdated = true
}) => {
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(interview);
    }
  };

  const formatDate = (dateString) => {
    if (dateString && dateString !== date) {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    return date;
  };

  const calculateReadTime = (content) => {
    if (!content) return readTime;
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const getAuthorInitials = (name) => {
    if (!name) return 'SC';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#E67E22', '#3498DB', '#E74C3C', '#2ECC71', 
      '#9B59B6', '#F39C12', '#1ABC9C', '#34495E'
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const truncateDescription = (text, maxLength = 160) => {
    if (!text) return description;
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  // Use provided props or fallback to interview data or defaults
  const displayTitle = interview?.title || title;
  const displayDescription = truncateDescription(interview?.content) || description;
  const displayAuthor = interview?.userName || interview?.author || author;
  const displayDate = formatDate(interview?.createdAt || interview?.date);
  const displayReadTime = calculateReadTime(interview?.content) || readTime;

  return (
    <div className="interview-card-clean" onClick={handleClick}>
      {/* Row 1: Interview Title */}
      <div className="card-title-row">
        <h2 className="interview-title-clean">
          {displayTitle}
        </h2>
      </div>

      {/* Row 2: Interview Description */}
      <div className="card-description-row">
        <p className="interview-description-clean">
          {displayDescription}
        </p>
      </div>

      {/* Row 3: Metadata Row */}
      <div className="card-metadata-row">
        <div className="metadata-left">
          {/* Author avatar + name */}
          <div className="author-section">
            <div 
              className="author-avatar-clean"
              style={{ backgroundColor: getAvatarColor(displayAuthor) }}
            >
              {getAuthorInitials(displayAuthor)}
            </div>
            <span className="author-name-clean">
              {displayAuthor}
            </span>
          </div>

          {/* Date */}
          <div className="metadata-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="metadata-icon">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{displayDate}</span>
          </div>

          {/* Read time */}
          <div className="metadata-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="metadata-icon">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{displayReadTime} min read</span>
          </div>

          {/* Updated indicator */}
          {(isUpdated || interview?.isUpdated) && (
            <div className="metadata-item updated-indicator">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="metadata-icon">
                <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="2"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Updated</span>
            </div>
          )}
        </div>

        {/* Read More (right-aligned) */}
        <div className="metadata-right">
          <button className="read-more-btn-clean">
            Read More
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="read-more-arrow">
              <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCardClean;