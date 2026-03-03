import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Portfolio.css";
import "./PortfolioCoffeeTheme.css";
import "./PortfolioForms.css";
import "./PortfolioFormsCoffeeTheme.css";
import "./ItemActions.css";
import "./ItemActionsCoffeeTheme.css";
import "./ActionButtons.css";
import "./ActionButtonsCoffeeTheme.css";
import "../../Components/DarkModeStyles.css";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { portfolioService } from "../../services";
import ShareButton from "../../Components/ShareButton/ShareButton";
import ReadOnlyBanner from "../../Components/ReadOnlyBanner/ReadOnlyBanner";
import { isPortfolioOwner } from "../../utils/portfolioUtils";
import {
  ProfileHeader,
  TabNavigation,
  EditButton,
  TabContent,
  ModalManager,
  getModalContent
} from "./components";

export default function Portfolio() {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { userId } = useParams(); // This will be used to fetch the specific user's portfolio
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // New loading state for saves/updates
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ section: null, itemId: null });

  // Fetch portfolio data from backend
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);
        




        
        let data;
        
        // Determine if this is a public view or owner view
        if (userId) {
          // Viewing another user's portfolio by email/username
          data = await portfolioService.getPortfolioByEmail(userId, true); // Skip auth for public access
        } else {
          // Viewing own portfolio (requires authentication)
          if (!isAuthenticated) {
            navigate('/');
            return;
          }

          data = await portfolioService.getMyPortfolio();
        }
        


        setPortfolioData(data);
      } catch (err) {



        setError(err.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [userId, isAuthenticated, navigate, user]);

  // Check if current user is the portfolio owner
  // Use utility function for consistent ownership checking
  // Special case: If no userId param and authenticated, user is viewing their own page
  const isOwner = userId 
    ? (isAuthenticated && isPortfolioOwner(portfolioData, user)) 
    : isAuthenticated; // No userId means viewing own portfolio

  // Handle creating a new portfolio
  const handleCreatePortfolio = () => {




    
    // Instead of creating directly, show the profile form modal
    setEditSection("profile");
    setEditItemId(null);
    

    // Get the modal content for profile creation
    const content = getModalContent("profile", null, null, handleSaveProfileCreate, handleCloseModal, user?.email);

    
    setModalContent(content);
    setShowModal(true);

  };

  // Handle saving the profile when creating new portfolio
  const handleSaveProfileCreate = async (formData, profileImage = null, resume = null) => {
    try {




      
      // Create portfolio with the form data
      const createdPortfolio = await portfolioService.createPortfolio(formData, profileImage, resume);
      

      setPortfolioData(createdPortfolio);
      
      // Close the modal
      handleCloseModal();
    } catch (err) {



      setError(err.message || 'Failed to create portfolio');
    }
  };

  // Handle saving edits from the EditPortfolioModal
  // Close the edit/add modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditSection(null);
    setEditItemId(null);
    setModalContent(null);
  };

  // Handle Edit button click for sections or specific items
  const handleEditClick = (section, itemId = null) => {





    
    setEditSection(section);
    setEditItemId(itemId);
    

    
    // Create a wrapper function that captures the current section and itemId
    const handleSaveWithContext = async (updatedData, profileImage = null, resume = null) => {




      
      // Prevent duplicate requests
      if (saving) {

        return;
      }
      
      try {
        setSaving(true); // Set saving state to true
        
        if (!portfolioData?.id) {

          setSaving(false);
          return;
        }

        let result;
        
        switch (section) {
          case 'profile':

            result = await portfolioService.updatePortfolio(portfolioData.id, updatedData, profileImage, resume);
            setPortfolioData(result);
            break;

          case 'skills':
            if (itemId) {

              result = await portfolioService.updateSkill(portfolioData.id, itemId, updatedData);
            } else {

              result = await portfolioService.createSkill(portfolioData.id, updatedData);
            }

            const skills = await portfolioService.getSkills(portfolioData.id);
            setPortfolioData({ ...portfolioData, skills });
            break;
            
          case 'projects':
            if (itemId) {

              result = await portfolioService.updateProject(portfolioData.id, itemId, updatedData, profileImage);
            } else {

              result = await portfolioService.createProject(portfolioData.id, updatedData, profileImage);
            }
            const projects = await portfolioService.getProjects(portfolioData.id);
            setPortfolioData({ ...portfolioData, projects });
            break;
            
          case 'experience':
            if (itemId) {
              result = await portfolioService.updateExperience(portfolioData.id, itemId, updatedData);
            } else {
              result = await portfolioService.createExperience(portfolioData.id, updatedData);
            }
            const experiences = await portfolioService.getExperiences(portfolioData.id);
            setPortfolioData({ ...portfolioData, experiences });
            break;
            
          case 'education':
            if (itemId) {
              result = await portfolioService.updateEducation(portfolioData.id, itemId, updatedData);
            } else {
              result = await portfolioService.createEducation(portfolioData.id, updatedData);
            }
            const educations = await portfolioService.getEducation(portfolioData.id);
            setPortfolioData({ ...portfolioData, educations });
            break;
            
          case 'certificates':
            if (itemId) {
              result = await portfolioService.updateCertificate(portfolioData.id, itemId, updatedData, profileImage);
            } else {
              result = await portfolioService.createCertificate(portfolioData.id, updatedData, profileImage);
            }
            const certificates = await portfolioService.getCertificates(portfolioData.id);
            setPortfolioData({ ...portfolioData, certificates });
            break;
            
          case 'achievements':
            if (itemId) {
              result = await portfolioService.updateAchievement(portfolioData.id, itemId, updatedData);
            } else {
              result = await portfolioService.createAchievement(portfolioData.id, updatedData);
            }
            const achievements = await portfolioService.getAchievements(portfolioData.id);
            setPortfolioData({ ...portfolioData, achievements });
            break;
            
          default:


            result = await portfolioService.updatePortfolio(portfolioData.id, updatedData);
            setPortfolioData(result);
            break;
        }
        

        handleCloseModal();
      } catch (err) {


        setError(err.message || 'Failed to save changes');
      } finally {
        setSaving(false); // Reset saving state
      }
    };
    
    // Get the modal content based on section and item, passing the wrapper function
    const content = getModalContent(section, itemId, portfolioData, handleSaveWithContext, handleCloseModal, user?.email);
    
    setModalContent(content);
    setShowModal(true);
  };

  // Handle Delete button click for items
  const handleDeleteClick = (section, itemId) => {
    setDeleteInfo({
      section,
      itemId
    });
    setShowDeleteConfirmation(true);
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    // Prevent duplicate requests
    if (saving) {

      return;
    }
    
    try {
      setSaving(true); // Set saving state to true
      
      if (!portfolioData?.id) {

        setSaving(false);
        return;
      }

      const { section, itemId } = deleteInfo;
      
      // Call the appropriate delete API based on section
      switch (section) {
        case 'skills':
          await portfolioService.deleteSkill(portfolioData.id, itemId);
          // Refresh skills list
          const skills = await portfolioService.getSkills(portfolioData.id);
          setPortfolioData({ ...portfolioData, skills });
          break;
          
        case 'projects':
          await portfolioService.deleteProject(portfolioData.id, itemId);
          // Refresh projects list
          const projects = await portfolioService.getProjects(portfolioData.id);
          setPortfolioData({ ...portfolioData, projects });
          break;
          
        case 'experience':
          await portfolioService.deleteExperience(portfolioData.id, itemId);
          // Refresh experiences list
          const experiences = await portfolioService.getExperiences(portfolioData.id);
          setPortfolioData({ ...portfolioData, experiences });
          break;
          
        case 'education':
          await portfolioService.deleteEducation(portfolioData.id, itemId);
          // Refresh education list
          const educations = await portfolioService.getEducation(portfolioData.id);
          setPortfolioData({ ...portfolioData, educations });
          break;
          
        case 'certificates':
          await portfolioService.deleteCertificate(portfolioData.id, itemId);
          // Refresh certificates list
          const certificates = await portfolioService.getCertificates(portfolioData.id);
          setPortfolioData({ ...portfolioData, certificates });
          break;
          
        case 'achievements':
          await portfolioService.deleteAchievement(portfolioData.id, itemId);
          // Refresh achievements list
          const achievements = await portfolioService.getAchievements(portfolioData.id);
          setPortfolioData({ ...portfolioData, achievements });
          break;
          
        default:

          return;
      }
      
      // Close the confirmation dialog
      setShowDeleteConfirmation(false);
    } catch (err) {

      setError(err.message || 'Failed to delete item');
    } finally {
      setSaving(false); // Reset saving state
    }
  };

  // Handle canceling deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteInfo({ section: null, itemId: null });
  };

  // Determine if banner should be shown
  const showBanner = !loading && !error && portfolioData && !isOwner;

  return (
    <div className={`portfolio-page-wrapper ${isDarkMode ? "dark-mode" : ""} ${showBanner ? "has-banner" : ""}`}>
      {/* Read-Only Banner for Public Viewing */}
      {showBanner && (
        <ReadOnlyBanner 
          portfolioOwnerName={portfolioData.fullName}
          onLoginClick={() => navigate('/')}
        />
      )}
      
      <div className="portfolio-page-container">
        {/* Loading State */}
        {loading && (
          <div className="portfolio-page-loading">
            <div className="portfolio-loading-spinner"></div>
            <p>Loading portfolio...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="portfolio-page-error">
            <div className="portfolio-error-icon">⚠️</div>
            <h2>Error Loading Portfolio</h2>
            <p>{error}</p>
            <button 
              className="portfolio-retry-btn"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State - No Portfolio Found */}
        {!loading && !error && !portfolioData && isOwner && (
          <div className="portfolio-page-empty">
            <div className="portfolio-empty-icon">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>No Portfolio Found</h2>
            <p>You haven't created your portfolio yet. Create one to showcase your skills, projects, and experience.</p>
            <button 
              className="portfolio-create-btn"
              onClick={handleCreatePortfolio}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Portfolio
            </button>
          </div>
        )}

        {/* Empty State - Viewing Other User's Portfolio (Not Found) */}
        {!loading && !error && !portfolioData && !isOwner && (
          <div className="portfolio-page-empty">
            <div className="portfolio-empty-icon">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Portfolio Not Found</h2>
            <p>This user hasn't created a portfolio yet.</p>
          </div>
        )}

        {/* Portfolio Content - Only show when data is loaded */}
        {!loading && !error && portfolioData && (
          <>
            {/* Portfolio Header */}
            <header className="portfolio-page-header">
              <div className="portfolio-header-background">
                <div className="portfolio-header-gradient"></div>
                <div className="portfolio-header-overlay"></div>
              </div>

              {/* Profile Card */}
              <ProfileHeader portfolioData={portfolioData} />
              
              {/* Share Button - Always visible */}
              <div className="portfolio-share-container">
                <ShareButton 
                  portfolioData={portfolioData} 
                  variant="default"
                  showLabel={true}
                />
              </div>
            </header>

            {/* Portfolio Nav Tabs */}
            <div className="portfolio-section-header-with-tabs">
              {/* Section Title */}
             
              
              {/* Edit Mode Toggle */}
              <EditButton 
                isOwner={isOwner} 
                onClick={handleEditClick} 
                activeTab={activeTab} 
              />
            </div>

            {/* Tab Navigation */}
            <TabNavigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />

            {/* Portfolio Content */}
            <div className="portfolio-page-content">
              {/* Tab Content */}
              <TabContent 
                activeTab={activeTab}
                portfolioData={portfolioData}
                isOwner={isOwner}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit/Add Form Modal - Show for both creating new and editing existing */}
      <ModalManager
        showModal={showModal}
        modalContent={modalContent}
        handleCloseModal={handleCloseModal}
        editSection={editSection}
        editItemId={editItemId}
        portfolioData={portfolioData}
        showDeleteConfirmation={showDeleteConfirmation}
        deleteInfo={deleteInfo}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        saving={saving}
      />
    </div>
  );
}
