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
  ContactForm,
  SocialLinksForm,
  CVUploadForm
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
  handleCancelDelete
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
      />
    );
  }

  // Render edit/add modal
  if (showModal) {
    return (
      <div className="modal-overlay">
        <div className="portfolio-modal">
          <button className="close-button" onClick={handleCloseModal}>
            &times;
          </button>
          <div className="modal-content">
            {modalContent}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Helper function to get the correct form component based on section
export const getModalContent = (editSection, editItemId, portfolioData, handleSaveEdit) => {
  // Get the section data and find the item if an ID is provided
  const sectionData = portfolioData[editSection] || [];
  const itemToEdit = editItemId ? sectionData.find(item => item.id === editItemId) : null;
  
  switch(editSection) {
    case "skills":
      return <SkillForm item={itemToEdit} onSave={handleSaveEdit} isEditing={!!itemToEdit} />;
    case "projects":
      return <ProjectForm item={itemToEdit} onSave={handleSaveEdit} isEditing={!!itemToEdit} />;
    case "experience":
      return <ExperienceForm item={itemToEdit} onSave={handleSaveEdit} isEditing={!!itemToEdit} />;
    case "education":
      return <EducationForm item={itemToEdit} onSave={handleSaveEdit} isEditing={!!itemToEdit} />;
    case "certificates":
      return <CertificationForm item={itemToEdit} onSave={handleSaveEdit} isEditing={!!itemToEdit} />;
    case "achievements":
      return <AchievementForm item={itemToEdit} onSave={handleSaveEdit} isEditing={!!itemToEdit} />;
    case "overview":
      return <OverviewForm data={portfolioData.overview} onSave={handleSaveEdit} />;
    case "contact":
      return <ContactForm data={portfolioData.contact} onSave={handleSaveEdit} />;
    case "social":
      return <SocialLinksForm data={portfolioData.social} onSave={handleSaveEdit} />;
    case "cv":
      return <CVUploadForm onSave={handleSaveEdit} />;
    default:
      return null;
  }
};

export default ModalManager;
