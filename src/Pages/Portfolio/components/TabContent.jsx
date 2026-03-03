import React from "react";
import SkillsSection from "./SkillsSection";

// Import other tab components as needed, or implement them directly here if simpler

const TabContent = ({ 
  activeTab, 
  portfolioData, 
  isOwner, 
  handleEditClick, 
  handleDeleteClick 
}) => {
  // Add safety checks for undefined properties
  // API response structure: emailId, githubLink, linkedInLink, etc.
  // Arrays: skills, projects, experiences (plural), educations (plural), certificates, achievements
  const emailId = portfolioData?.emailId;
  const phoneNumber = portfolioData?.phoneNumber;
  const skills = portfolioData?.skills || [];
  const projects = portfolioData?.projects || [];
  const experiences = portfolioData?.experiences || [];  // Note: plural in API
  const educations = portfolioData?.educations || [];    // Note: plural in API
  const certificates = portfolioData?.certificates || [];
  const achievements = portfolioData?.achievements || [];
  const overview = portfolioData?.overview || 'No overview available yet.';
  
  switch (activeTab) {
    case "overview":
      return (
        <div className="overview-section portfolio-section">
          <h2 className="section-title">About Me</h2>
          <p className="overview-text">{overview}</p>

          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-grid">
              {emailId && (
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 6L12 13L2 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="contact-text">
                    <div className="contact-label">Email</div>
                    <div className="contact-value">
                      <a href={`mailto:${emailId}`} className="themed-link">
                        {emailId}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="contact-text">
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">
                    {phoneNumber ? (
                      <a href={`tel:${phoneNumber}`} className="themed-link">
                        {phoneNumber}
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      );
    
    case "skills":
      return (
        <SkillsSection
          skills={skills}
          isOwner={isOwner}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      );
    
    case "projects":
      return (
        <div className="projects-section portfolio-section">
          <h2 className="section-title">Projects</h2>
          {isOwner && (
            <div className="section-actions">
              <button className="add-item-btn" onClick={() => handleEditClick("projects")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add New Project
              </button>
            </div>
          )}
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                {isOwner && (
                  <div className="item-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEditClick("projects", project.id)}
                      aria-label="Edit project"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteClick("projects", project.id)}
                      aria-label="Delete project"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
                {project.image && (
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-tech">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="project-links">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link demo themed-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="project-link code themed-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.5C19.9988 8.30635 19.5325 7.16303 18.7 6.3C19.0905 5.26135 19.0545 4.11812 18.6 3.1C18.6 3.1 17.5 2.8 15.6 4C14.0362 3.56295 12.3638 3.56295 10.8 4C8.9 2.8 7.8 3.1 7.8 3.1C7.34548 4.11812 7.30954 5.26135 7.7 6.3C6.86745 7.16303 6.40123 8.30635 6.4 9.5C6.4 14.1 9.1 15.2 11.9 15.5C11.3 16.1 11.1 16.7 11.1 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
    // For brevity, I'm only showing a couple of sections in detail
    // You can implement the other sections similarly
    
    case "experience":
      return (
        <div className="experience-section portfolio-section">
          <h2 className="section-title">Experience</h2>
          {isOwner && (
            <div className="section-actions">
              <button className="add-item-btn" onClick={() => handleEditClick("experience")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add New Experience
              </button>
            </div>
          )}
          <div className="timeline">
            {experiences.map((exp) => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  {isOwner && (
                    <div className="item-actions">
                      <button className="edit-btn" onClick={() => handleEditClick("experience", exp.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteClick("experience", exp.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="timeline-header">
                    <h3 className="timeline-title">{exp.role}</h3>
                    <div className="timeline-period">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <div className="timeline-company">
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </div>
                  {exp.description && (
                    <div className="timeline-description">{exp.description}</div>
                  )}
                  {exp.responsibilities && (
                    <div className="timeline-responsibilities">
                      <h4>Key Responsibilities:</h4>
                      <p>{exp.responsibilities}</p>
                    </div>
                  )}
                  {exp.achievements && (
                    <div className="timeline-achievements">
                      <h4>Achievements:</h4>
                      <p>{exp.achievements}</p>
                    </div>
                  )}
                  {exp.technologies && (
                    <div className="timeline-technologies">
                      <h4>Technologies Used:</h4>
                      <div className="tech-tags">
                        {exp.technologies.split(',').map((tech, index) => (
                          <span key={index} className="tech-tag">{tech.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );    case "education":
      return (
        <div className="education-section portfolio-section">
          <h2 className="section-title">Education</h2>
          {isOwner && (
            <div className="section-actions">
              <button className="add-item-btn" onClick={() => handleEditClick("education")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add New Education
              </button>
            </div>
          )}
          <div className="education-grid">
            {educations.map((edu) => (
              <div key={edu.id} className="education-card">
                {isOwner && (
                  <div className="item-actions">
                    <button className="edit-btn" onClick={() => handleEditClick("education", edu.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick("education", edu.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
                <div className="education-period">
                  {edu.startDate} - {edu.ongoing ? 'Present' : edu.endDate}
                </div>
                <h3 className="education-degree">{edu.degree}</h3>
                <div className="education-institution">{edu.institution}</div>
                {edu.fieldOfStudy && (
                  <div className="education-field-of-study">
                    <strong>Field:</strong> {edu.fieldOfStudy}
                  </div>
                )}
                {edu.grade && (
                  <div className="education-grade">
                    <strong>Grade:</strong> {edu.grade}
                  </div>
                )}
                {edu.description && (
                  <div className="education-description">{edu.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    
    case "certificates":
      return (
        <div className="certificates-section portfolio-section">
          <h2 className="section-title">Certifications</h2>
          {isOwner && (
            <div className="section-actions">
              <button className="add-item-btn" onClick={() => handleEditClick("certificates")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add New Certificate
              </button>
            </div>
          )}
          <div className="certifications-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className="certification-card">
                {isOwner && (
                  <div className="item-actions">
                    <button className="edit-btn" onClick={() => handleEditClick("certificates", cert.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick("certificates", cert.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
                {/* Date positioned absolutely in top-right corner (like education-period) */}
                {cert.issueDate && (
                  <div className="certification-date">
                    {cert.issueDate}
                    {cert.expiryDate && (
                      <>
                        <br />
                        {cert.expiryDate}
                      </>
                    )}
                  </div>
                )}
                {/* Certificate Title */}
                <h3 className="certification-name">{cert.title}</h3>
                {/* Issuer in blue */}
                <div className="certification-issuer">{cert.issuer}</div>
                {/* Credential ID */}
                {cert.credentialId && (
                  <div className="certification-credential">
                    ID: {cert.credentialId}
                  </div>
                )}
                {/* Description */}
                {cert.description && (
                  <div className="certification-description">{cert.description}</div>
                )}
                {/* View Certificate Link */}
                {cert.credentialUrl && (
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="certification-link"
                  >
                    View Certificate →
                  </a>
                )}
                {/* Certificate Image */}
                {cert.certificateImageUrl && (
                  <img 
                    src={cert.certificateImageUrl} 
                    alt={cert.title}
                    className="certification-image"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    
    case "achievements":
      return (
        <div className="achievements-section portfolio-section">
          <h2 className="section-title">Achievements</h2>
          {isOwner && (
            <div className="section-actions">
              <button className="add-item-btn" onClick={() => handleEditClick("achievements")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add New Achievement
              </button>
            </div>
          )}
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                {isOwner && (
                  <div className="item-actions">
                    <button className="edit-btn" onClick={() => handleEditClick("achievements", achievement.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick("achievements", achievement.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
                <div className="achievement-header">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  {achievement.date && (
                    <div className="achievement-date">{achievement.date}</div>
                  )}
                </div>
                {achievement.issuer && (
                  <div className="achievement-organization">{achievement.issuer}</div>
                )}
                {achievement.description && (
                  <div className="achievement-description">{achievement.description}</div>
                )}
                {achievement.url && (
                  <a 
                    href={achievement.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="achievement-link"
                  >
                    View Details →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export default TabContent;
