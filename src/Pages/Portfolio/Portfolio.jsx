import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import "./Portfolio.css";
import "./PortfolioForms.css";
import "./ItemActions.css";
import "./ActionButtons.css";
import "../../Components/DarkModeStyles.css";
import { useTheme } from "../../context/ThemeContext";
import {
  ProfileHeader,
  TabNavigation,
  EditButton,
  TabContent,
  ModalManager,
  getModalContent
} from "./components";

// Sample portfolio data (in a real app, this would come from your backend API)
const samplePortfolioData = {
  userId: "user123",
  name: "Atul Singh",
  title: "Full Stack Developer",
  overview: "Passionate full-stack developer with 5+ years of experience building web applications. Specialized in React, Node.js, and cloud architecture. Currently focusing on AI-powered web solutions.",
  avatar: "/assets/avatar-1.jpg",
  contact: {
    email: "atulsingh@example.com",
    phone: "+91 (XXX) XXX-XXXX",
    location: "Bangalore, India",
  },
  social: {
    linkedin: "atulsingh2192",
    github: "atul-2192",
    twitter: "atulsingh_dev",
    website: "https://atulsingh.dev",
  },
  skills: [
    { id: 1, name: "React.js", description: "Building complex user interfaces with hooks, context API and custom components" },
    { id: 2, name: "Node.js", description: "Creating RESTful APIs and microservices with Express" },
    { id: 3, name: "JavaScript", description: "ES6+, functional programming and asynchronous patterns" },
    { id: 4, name: "TypeScript", description: "Type-safe development with interfaces and generics" },
    { id: 5, name: "MongoDB", description: "Database design, aggregation pipelines and performance optimization" },
    { id: 6, name: "AWS", description: "Cloud infrastructure with EC2, S3, Lambda and CloudFormation" },
    { id: 7, name: "Docker", description: "Containerization and orchestration with Docker Compose" },
    { id: 8, name: "GraphQL", description: "Schema design, resolvers and integration with React" },
  ],
  projects: [
    {
      id: 1,
      title: "SwitchBoard - Technical Training Platform",
      description: "A collaborative learning platform for technical training with interactive exercises, real-time feedback, and progress tracking.",
      image: "/assets/projects/switchboard.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io", "AWS"],
      liveUrl: "https://switchboard.tech",
      repoUrl: "https://github.com/atulsingh/switchboard"
    },
    {
      id: 2,
      title: "AI Code Assistant",
      description: "An AI-powered coding assistant that helps developers write, debug and optimize code across multiple programming languages.",
      image: "/assets/projects/code-assistant.jpg",
      technologies: ["Python", "TensorFlow", "OpenAI API", "React", "FastAPI"],
      liveUrl: "https://ai-code-assistant.dev",
      repoUrl: "https://github.com/atulsingh/code-assistant"
    },
    {
      id: 3,
      title: "Cloud Infrastructure Dashboard",
      description: "A unified dashboard for monitoring and managing multi-cloud infrastructure with cost optimization recommendations.",
      image: "/assets/projects/cloud-dashboard.jpg",
      technologies: ["Vue.js", "Go", "AWS", "GCP", "Azure", "Terraform"],
      liveUrl: "https://cloud-dashboard.io",
      repoUrl: "https://github.com/atulsingh/cloud-dashboard"
    }
  ],
  experience: [
    {
      id: 1,
      role: "Senior Full Stack Developer",
      company: "TechInnovate Solutions",
      location: "Bangalore, India",
      startDate: "Jan 2022",
      endDate: "Present",
      description: "Lead a team of 5 developers building scalable web applications using React, Node.js, and AWS. Implemented CI/CD pipelines, reduced deployment time by 70%. Architected and developed microservices infrastructure that improved system reliability by 35%."
    },
    {
      id: 2,
      role: "Full Stack Developer",
      company: "DataViz Technologies",
      location: "Pune, India",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      description: "Developed data visualization dashboards using D3.js and React. Created RESTful APIs with Node.js and Express. Optimized MongoDB queries resulting in 40% faster data retrieval."
    },
    {
      id: 3,
      role: "Frontend Developer",
      company: "WebFuture Technologies",
      location: "Mumbai, India",
      startDate: "Jul 2018",
      endDate: "May 2020",
      description: "Built responsive web applications using React and Redux. Collaborated with UX designers to implement pixel-perfect interfaces. Reduced application bundle size by 30% through code splitting and lazy loading."
    }
  ],
  education: [
    {
      id: 1,
      degree: "Master of Computer Applications",
      institution: "Indian Institute of Technology, Delhi",
      location: "Delhi, India",
      startDate: "2015",
      endDate: "2018",
      description: "Specialized in Web Technologies and Cloud Computing. Graduated with distinction (9.2/10 GPA). Developed a cloud-based learning management system for my final year project."
    },
    {
      id: 2,
      degree: "Bachelor of Computer Science",
      institution: "University of Mumbai",
      location: "Mumbai, India",
      startDate: "2012",
      endDate: "2015",
      description: "Focused on software engineering and data structures. Active member of the university's coding club. Participated in multiple hackathons and coding competitions."
    }
  ],
  certificates: [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Dec 2022",
      description: "Professional level certification validating expertise in designing distributed systems on AWS.",
      url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/"
    },
    {
      id: 2,
      title: "MongoDB Certified Developer",
      issuer: "MongoDB, Inc.",
      date: "Mar 2022",
      description: "Advanced certification for designing and building MongoDB applications.",
      url: "https://university.mongodb.com/certification"
    },
    {
      id: 3,
      title: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "Jul 2021",
      description: "Certification for managing Kubernetes clusters in production environments.",
      url: "https://www.cncf.io/certification/cka/"
    }
  ],
  achievements: [
    {
      id: 1,
      title: "Best Developer Award",
      organization: "TechInnovate Solutions",
      date: "2023",
      description: "Awarded for exceptional contribution to product development and innovation."
    },
    {
      id: 2,
      title: "1st Place in Cloud Hackathon",
      organization: "AWS Community India",
      date: "2022",
      description: "Led a team that developed a serverless application for disaster management."
    },
    {
      id: 3,
      title: "Open Source Contributor Recognition",
      organization: "GitHub",
      date: "2021",
      description: "Recognized for significant contributions to several open-source React libraries."
    }
  ]
};

export default function Portfolio() {
  const { isDarkMode } = useTheme();
  const { userId } = useParams(); // This will be used to fetch the specific user's portfolio
  const [portfolioData, setPortfolioData] = useState(samplePortfolioData);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ section: null, itemId: null });

  // In a real app, you would fetch the portfolio data based on userId
  // useEffect(() => {
  //   // Fetch portfolio data for the specific user
  //   fetch(`/api/portfolio/${userId}`)
  //     .then(response => response.json())
  //     .then(data => setPortfolioData(data));
  // }, [userId]);

  // Check if current user is the portfolio owner
  const isLoggedIn = localStorage.getItem('token') !== null;
  const isOwner = isLoggedIn && (!userId || userId === portfolioData.userId); // In a real app, compare current user ID with portfolio owner ID

  // Handle saving edits from the EditPortfolioModal
  const handleSaveEdit = (updatedData) => {
    // Update the portfolio data based on the edited section
    setPortfolioData({
      ...portfolioData,
      [editSection]: updatedData
    });
    
    // Close the modal
    handleCloseModal();
  };

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
    
    // Get the modal content based on section and item
    const content = getModalContent(section, itemId, portfolioData, handleSaveEdit);
    
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
  const handleConfirmDelete = () => {
    const { section, itemId } = deleteInfo;
    
    // Filter out the item to delete
    const updatedSectionData = portfolioData[section].filter(item => item.id !== itemId);
    
    // Update the portfolio data
    setPortfolioData({
      ...portfolioData,
      [section]: updatedSectionData
    });
    
    // Close the confirmation dialog
    setShowDeleteConfirmation(false);
  };

  // Handle canceling deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteInfo({ section: null, itemId: null });
  };

  return (
    <div className={`portfolio-app ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="portfolio-container">
        {/* Portfolio Header */}
        <header className="portfolio-header">
          <div className="header-background">
            <div className="header-gradient"></div>
            <div className="header-overlay"></div>
          </div>

          {/* Profile Card */}
          <ProfileHeader portfolioData={portfolioData} />
        </header>

        {/* Portfolio Nav Tabs */}
        <div className="section-header-with-tabs">
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
        <div className="portfolio-content">
          {/* Tab Content */}
          <TabContent 
            activeTab={activeTab}
            portfolioData={portfolioData}
            isOwner={isOwner}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </div>
      </div>

      {/* Edit/Add Form Modal */}
      <ModalManager
        showModal={showModal}
        modalContent={modalContent}
        handleCloseModal={handleCloseModal}
        editSection={editSection}
        editItemId={editItemId}
        portfolioData={portfolioData}
        handleSaveEdit={handleSaveEdit}
        showDeleteConfirmation={showDeleteConfirmation}
        deleteInfo={deleteInfo}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
