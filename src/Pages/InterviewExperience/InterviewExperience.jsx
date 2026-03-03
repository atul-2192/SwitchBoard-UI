import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewCardClean from '../../Components/InterviewCard/InterviewCardClean';
import SearchAndFilter from '../../Components/SearchAndFilter/SearchAndFilter';
import Pagination from '../../Components/Pagination/Pagination';
import ResponsiveNavbar from '../../Components/ResponsiveNavbar/ResponsiveNavbar';
import Login from '../../Components/Login/Login';
import Signup from '../../Components/Signup/Signup';
import { useAuth } from '../../context/AuthContext';
import { 
  getAllInterviews, 
  searchInterviewsByCompany
} from '../../services/interviewExperienceService';
import './InterviewExperience.css';

const InterviewExperience = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State management for modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // State management
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [currentSort, setCurrentSort] = useState({ sortBy: 'updatedAt', sortDir: 'desc' });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fetch interviews
  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      
      if (selectedCompanies.length > 0) {
        // If companies are selected, search by company
        const companyResults = await Promise.all(
          selectedCompanies.map(company => searchInterviewsByCompany(company))
        );
        
        // Flatten and deduplicate results
        const allResults = companyResults.flat();
        const uniqueResults = allResults.filter((interview, index, self) =>
          index === self.findIndex(t => t.id === interview.id)
        );

        // Apply search filter if exists
        let filteredResults = uniqueResults;
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredResults = uniqueResults.filter(interview =>
            interview.title.toLowerCase().includes(searchLower) ||
            interview.content.toLowerCase().includes(searchLower) ||
            interview.company?.toLowerCase().includes(searchLower) ||
            interview.userName?.toLowerCase().includes(searchLower)
          );
        }

        // Apply sorting
        filteredResults.sort((a, b) => {
          const aVal = a[currentSort.sortBy];
          const bVal = b[currentSort.sortBy];
          
          if (currentSort.sortBy === 'createdAt' || currentSort.sortBy === 'updatedAt') {
            const aDate = new Date(aVal);
            const bDate = new Date(bVal);
            return currentSort.sortDir === 'desc' ? bDate - aDate : aDate - bDate;
          }
          
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            const comparison = aVal.localeCompare(bVal);
            return currentSort.sortDir === 'desc' ? -comparison : comparison;
          }
          
          return 0;
        });

        // Manual pagination for filtered results
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedResults = filteredResults.slice(startIndex, endIndex);

        data = {
          content: paginatedResults,
          pageNumber: currentPage,
          pageSize: pageSize,
          totalElements: filteredResults.length,
          totalPages: Math.ceil(filteredResults.length / pageSize),
          lastPage: endIndex >= filteredResults.length
        };
      } else {
        // Regular API call with pagination
        data = await getAllInterviews({
          pageNumber: currentPage,
          pageSize: pageSize,
          sortBy: currentSort.sortBy,
          sortDir: currentSort.sortDir
        });

        // Apply search filter if exists
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          data.content = data.content.filter(interview =>
            interview.title.toLowerCase().includes(searchLower) ||
            interview.content.toLowerCase().includes(searchLower) ||
            interview.company?.toLowerCase().includes(searchLower) ||
            interview.userName?.toLowerCase().includes(searchLower)
          );
        }
      }

      setInterviews(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
      setIsLastPage(data.lastPage || false);

    } catch (err) {

      setError('We\'re having trouble connecting to our servers. Please check your connection and try again.');
      setInterviews([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCompanies, currentSort, currentPage, pageSize]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [currentPage, searchTerm, selectedCompanies, currentSort, pageSize]);

  // Event handlers
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleCompanyFilter = (companies) => {
    setSelectedCompanies(companies);
  };

  const handleSortChange = (sort) => {
    setCurrentSort(sort);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (interview) => {
    navigate(`/interview-experiences/${interview.id}`);
  };

  const handleRefresh = () => {
    fetchInterviews();
  };

  const handleCreateInterview = () => {
    navigate('/create-interview');
  };

  // Modal handlers
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  return (
    <div className="interview-experience-page">
      <ResponsiveNavbar
        user={user}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={logout}
      />
      {/* Hero Section */}
      <div className="hero-section">
        {/* Floating Career Icons */}
        <div className="hero-visual-elements">
          <div className="floating-icon">💼</div>
          <div className="floating-icon">🎯</div>
          <div className="floating-icon">📈</div>
          <div className="floating-icon">💡</div>
          <div className="floating-icon">🚀</div>
          <div className="floating-icon">⭐</div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Real Interview <span className="accent">Experiences</span>
          </h1>
          <p className="hero-description">
            Learn from authentic interview experiences shared by candidates from top companies. 
            Get insights, tips, and real-world perspectives to ace your next interview and advance your career.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{totalElements}</span>
              <span className="stat-label">Interview Stories</span>
            </div>
            <div className="stat">
              <span className="stat-number">{new Set(interviews.map(i => i.company)).size}</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat">
              <span className="stat-number">{interviews.filter(i => {
                const date = new Date(i.createdAt);
                const week = new Date();
                week.setDate(week.getDate() - 7);
                return date > week;
              }).length}</span>
              <span className="stat-label">This Week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Filters */}
        <SearchAndFilter
          onSearchChange={handleSearchChange}
          onCompanyFilter={handleCompanyFilter}
          onSortChange={handleSortChange}
          onPageSizeChange={handlePageSizeChange}
          currentSort={currentSort}
          currentPageSize={pageSize}
          totalResults={totalElements}
          isLoading={loading}
          isMobile={isMobile}
        />

        {/* Error State */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <h3>Oops, we're having some connectivity issues</h3>
                <p>{error}</p>
              </div>
              <button className="retry-btn" onClick={handleRefresh}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="interviews-grid loading-grid">
              {Array.from({ length: pageSize }).map((_, index) => (
                <div key={index} className="interview-card-skeleton">
                  <div className="skeleton-header">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-info">
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line shorter"></div>
                    </div>
                  </div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                  <div className="skeleton-footer">
                    <div className="skeleton-line shorter"></div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews Grid */}
        {!loading && !error && (
          <>
            {interviews.length > 0 ? (
              <div className="interviews-grid">
                {interviews.map((interview) => (
                  <InterviewCardClean
                    key={interview.id}
                    interview={interview}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>No interview experiences found</h3>
                <p>
                  {searchTerm || selectedCompanies.length > 0
                    ? "Try adjusting your search criteria or filters to find more results."
                    : "Be the first to share your interview experience!"
                  }
                </p>
                {(searchTerm || selectedCompanies.length > 0) && (
                  <button 
                    className="clear-filters-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCompanies([]);
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && interviews.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                isLastPage={isLastPage}
                isLoading={loading}
              />
            )}
          </>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <Login
          onClose={handleCloseModals}
          switchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          onSuccess={(userData) => {
            handleCloseModals();
            // Optionally refresh data or redirect
          }}
          isPopup={true}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <Signup
          onClose={handleCloseModals}
          switchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          onSuccess={(userData) => {
            handleCloseModals();
            // Optionally refresh data or redirect
          }}
          isPopup={true}
        />
      )}

      {/* Floating Create Button */}
      <button 
        className="floating-create-interview-button"
        onClick={handleCreateInterview}
        title="Share your interview experience"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default InterviewExperience;