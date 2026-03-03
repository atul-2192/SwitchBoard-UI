import React from "react";
import ConfirmationModal from "../../../Components/ConfirmationModal/ConfirmationModal";
import { 
  SkillForm, 
  ProjectForm, 
  ExperienceForm,
  EducationForm,
  CertificationForm,
  AchievementForm,
  OverviewForm,
  SocialLinksForm,
  CVUploadForm,
  ProfileForm
} from "../PortfolioForms";

const ModalManager = ({
  showModal,
  modalContent,
  handleCloseModal,
  editSection,
  editItemId,
  portfolioData,
  handleSaveEdit,
  showDeleteConfirmation,
  deleteInfo,
  handleConfirmDelete,
  handleCancelDelete,
  saving = false
}) => {
  if (!showModal && !showDeleteConfirmation) return null;

  // Render delete confirmation modal
  if (showDeleteConfirmation) {
    return (
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${deleteInfo.section === "skills" 
          ? "skill" 
          : deleteInfo.section === "projects" 
          ? "project" 
          : deleteInfo.section === "experience" 
          ? "experience" 
          : deleteInfo.section === "education" 
          ? "education" 
          : deleteInfo.section === "certificates" 
          ? "certificate" 
          : "achievement"}?`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
        isLoading={saving}
      />
    );
  }

  // Render edit/add modal
  if (showModal) {
    return (
      <div className="modal-overlay">
        <div className="portfolio-modal">
          <button className="close-button" onClick={handleCloseModal} disabled={saving}>
            &times;
          </button>
          <div className="modal-content">
            {saving && (
              <div className="modal-loading-overlay">
                <div className="modal-loading-spinner"></div>
                <p>Saving changes...</p>
              </div>
            )}
            {modalContent}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Helper function to get the correct form component based on section
export const getModalContent = (editSection, editItemId, portfolioData, handleSaveEdit, handleCloseModal, userEmail = '') => {





  
  // Map section names to their data keys (handle plural forms)
  const sectionDataKeys = {
    'experience': 'experiences',
    'education': 'educations',
    'certificates': 'certificates',  // API uses 'certificates' not 'certifications'
    'achievements': 'achievements',
    'skills': 'skills',
    'projects': 'projects'
  };
  
  // Get the section data and find the item if an ID is provided
  const dataKey = sectionDataKeys[editSection] || editSection;
  const sectionData = portfolioData?.[dataKey] || [];
  const itemToEdit = editItemId ? sectionData.find(item => item.id === editItemId) : null;
  





  
  switch(editSection) {
    case "profile":
      return <ProfileForm profile={portfolioData || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} isEditing={!!portfolioData} userEmail={userEmail} />;
    case "skills":

      return <SkillForm skill={itemToEdit || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} isEditing={!!itemToEdit} portfolioId={portfolioData?.id} />;
    case "projects":
      return <ProjectForm project={itemToEdit || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} isEditing={!!itemToEdit} />;
    case "experience":
      return <ExperienceForm experience={itemToEdit || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} isEditing={!!itemToEdit} />;
    case "education":
      return <EducationForm education={itemToEdit || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} isEditing={!!itemToEdit} />;
    case "certificates":
      return <CertificationForm certification={itemToEdit || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} isEditing={!!itemToEdit} />;
    case "achievements":
      return <AchievementForm achievement={itemToEdit || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} isEditing={!!itemToEdit} />;
    case "overview":
      return <OverviewForm overview={portfolioData || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} />;
    case "social":
      return <SocialLinksForm social={portfolioData || {}} onSave={handleSaveEdit} onCancel={handleCloseModal} />;
    case "cv":
      return <CVUploadForm currentCV={portfolioData?.resumeLink || ""} onSave={handleSaveEdit} onCancel={handleCloseModal} />;
    default:
      return null;
  }
};

export default ModalManager;
