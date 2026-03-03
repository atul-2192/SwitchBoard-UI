import React, { useState, useEffect } from 'react';
import './PortfolioForms.css';
import './PortfolioFormsCoffeeTheme.css';

// Skill Form Component
export const SkillForm = ({ skill = {}, onSave, onCancel, isEditing = false, portfolioId }) => {
  const [formData, setFormData] = useState({
    id: skill.id || Date.now(),
    name: skill.name || '',
    category: skill.category || '',
    proficiencyLevel: skill.proficiencyLevel || 3,
    yearsOfExperience: skill.yearsOfExperience || 1,
    description: skill.description || '',
  });

  // Update form data when skill prop changes (for editing)
  useEffect(() => {
    if (skill && Object.keys(skill).length > 0) {
      setFormData({
        id: skill.id || Date.now(),
        name: skill.name || '',
        category: skill.category || '',
        proficiencyLevel: skill.proficiencyLevel || 3,
        yearsOfExperience: skill.yearsOfExperience || 1,
        description: skill.description || '',
      });
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'proficiencyLevel' || name === 'yearsOfExperience' 
        ? parseInt(value, 10) 
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare clean data without UI-only fields
    const cleanData = {
      name: formData.name,
      category: formData.category,
      proficiencyLevel: formData.proficiencyLevel,
      yearsOfExperience: formData.yearsOfExperience,
      description: formData.description,
    };
    
    // Call parent's onSave which handles create/update logic
    onSave(cleanData);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Skill' : 'Add New Skill'}</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name" className="required-label">Skill Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Java, React.js, AWS"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="required-label">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Programming Language">Programming Language</option>
            <option value="Framework">Framework</option>
            <option value="Cloud Platform">Cloud Platform</option>
            <option value="Database">Database</option>
            <option value="DevOps Tool">DevOps Tool</option>
            <option value="Testing Tool">Testing Tool</option>
            <option value="Design Tool">Design Tool</option>
            <option value="Soft Skill">Soft Skill</option>
            <option value="Methodology">Methodology</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="proficiencyLevel">
            Proficiency Level: {formData.proficiencyLevel} 
            {formData.proficiencyLevel === 1 && ' (Beginner)'}
            {formData.proficiencyLevel === 2 && ' (Intermediate)'}
            {formData.proficiencyLevel === 3 && ' (Proficient)'}
            {formData.proficiencyLevel === 4 && ' (Advanced)'}
            {formData.proficiencyLevel === 5 && ' (Expert)'}
          </label>
          <input
            type="range"
            id="proficiencyLevel"
            name="proficiencyLevel"
            min="1"
            max="5"
            step="1"
            value={formData.proficiencyLevel}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="yearsOfExperience" className="required-label">Years of Experience</label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            min="0"
            max="50"
            step="0.5"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. Expert in Java 8+ features and Spring Framework"
          rows="3"
        ></textarea>
        <div className="form-help">Explain your experience with this skill and how you've applied it</div>
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          {isEditing ? 'Update Skill' : 'Add Skill'}
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Project Form Component
export const ProjectForm = ({ project = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: project.id || Date.now(),
    title: project.title || '',
    description: project.description || '',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    technologies: project.technologies?.join(', ') || '',
    liveUrl: project.liveUrl || '',
    repoUrl: project.repoUrl || '',
    features: project.features?.join('\n') || '',
    role: project.role || '',
    status: project.status || 'Completed',
    ongoing: project.ongoing ?? false,
  });

  const [projectImage, setProjectImage] = useState(null);

  // Update form data when project prop changes (for editing)
  useEffect(() => {
    if (project && Object.keys(project).length > 0) {
      setFormData({
        id: project.id || Date.now(),
        title: project.title || '',
        description: project.description || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        technologies: project.technologies?.join(', ') || '',
        liveUrl: project.liveUrl || '',
        repoUrl: project.repoUrl || '',
        features: project.features?.join('\n') || '',
        role: project.role || '',
        status: project.status || 'Completed',
        ongoing: project.ongoing ?? false,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert technologies and features from string to array
    const processedData = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.ongoing ? null : formData.endDate,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
      liveUrl: formData.liveUrl,
      repoUrl: formData.repoUrl,
      features: formData.features.split('\n').map(feat => feat.trim()).filter(feat => feat),
      role: formData.role,
      status: formData.status,
      ongoing: formData.ongoing,
    };
    onSave(processedData, projectImage);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title" className="required-label">Project Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. E-commerce Platform"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Your Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Lead Developer"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="required-label">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your project, its purpose and impact"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.ongoing}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="ongoing"
              checked={formData.ongoing}
              onChange={handleChange}
            />
            <span>Ongoing project</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Planning">Planning</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="technologies" className="required-label">Technologies Used</label>
        <input
          type="text"
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, MongoDB, AWS"
          required
        />
        <div className="form-help">Separate technologies with commas</div>
      </div>

      <div className="form-group">
        <label htmlFor="features">Key Features</label>
        <textarea
          id="features"
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="List main features (one per line)"
          rows="4"
        ></textarea>
        <div className="form-help">Add each feature on a new line</div>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="repoUrl">Repository Link</label>
          <input
            type="url"
            id="repoUrl"
            name="repoUrl"
            value={formData.repoUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/project"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="liveUrl">Live Demo Link</label>
          <input
            type="url"
            id="liveUrl"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="https://example.com/project"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="projectImage">Project Image</label>
        <input
          type="file"
          id="projectImage"
          name="projectImage"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        <div className="form-help">Upload project screenshot (JPG or PNG)</div>
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          {isEditing ? 'Update Project' : 'Add Project'}
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Experience Form Component
export const ExperienceForm = ({ experience = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: experience.id || Date.now(),
    role: experience.role || '',
    company: experience.company || '',
    location: experience.location || '',
    startDate: experience.startDate || '',
    endDate: experience.endDate || '',
    current: experience.current ?? false,
    description: experience.description || '',
    responsibilities: experience.responsibilities || '',
  });

  // Update form data when experience prop changes (for editing)
  useEffect(() => {
    if (experience && Object.keys(experience).length > 0) {
      setFormData({
        id: experience.id || Date.now(),
        role: experience.role || '',
        company: experience.company || '',
        location: experience.location || '',
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        current: experience.current ?? false,
        description: experience.description || '',
        responsibilities: experience.responsibilities || '',
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If current job, clear endDate
    const processedData = {
      ...formData,
      endDate: formData.current ? null : formData.endDate,
    };
    onSave(processedData);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Experience' : 'Add New Experience'}</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="role" className="required-label">Job Title</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Senior Full Stack Developer"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company" className="required-label">Company Name</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. TechSolutions Inc."
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Bangalore, India"
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="startDate" className="required-label">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.current}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="current"
            checked={formData.current}
            onChange={handleChange}
          />
          <span>I currently work here</span>
        </label>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Job Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your role at the company"
          rows="4"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="responsibilities">Key Responsibilities</label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
          placeholder="Developed REST APIs, integrated AWS S3, wrote unit tests"
          rows="4"
        ></textarea>
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          {isEditing ? 'Update Experience' : 'Add Experience'}
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Education Form Component
export const EducationForm = ({ education = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: education.id || Date.now(),
    institution: education.institution || '',
    degree: education.degree || '',
    fieldOfStudy: education.fieldOfStudy || '',
    grade: education.grade || '',
    startDate: education.startDate || '',
    endDate: education.endDate || '',
    ongoing: education.ongoing ?? false,
    description: education.description || '',
  });

  // Update form data when education prop changes (for editing)
  useEffect(() => {
    if (education && Object.keys(education).length > 0) {
      setFormData({
        id: education.id || Date.now(),
        institution: education.institution || '',
        degree: education.degree || '',
        fieldOfStudy: education.fieldOfStudy || '',
        grade: education.grade || '',
        startDate: education.startDate || '',
        endDate: education.endDate || '',
        ongoing: education.ongoing ?? false,
        description: education.description || '',
      });
    }
  }, [education]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If ongoing, clear endDate
    const processedData = {
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      grade: formData.grade ? parseFloat(formData.grade) : undefined,
      startDate: formData.startDate,
      endDate: formData.ongoing ? null : formData.endDate,
      ongoing: formData.ongoing,
      description: formData.description,
    };
    onSave(processedData);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Education' : 'Add New Education'}</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="institution" className="required-label">Institution</label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g. Stanford University"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="degree" className="required-label">Degree / Qualification</label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="e.g. Bachelor of Science"
            required
          />
        </div>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="fieldOfStudy">Field of Study</label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="grade">Grade / CGPA</label>
          <input
            type="number"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="e.g. 9.2"
            step="0.01"
            min="0"
            max="10"
          />
          <div className="form-help">Optional: Your grade or CGPA</div>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="startDate" className="required-label">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.ongoing}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="ongoing"
            checked={formData.ongoing}
            onChange={handleChange}
          />
          <span>I'm currently studying here</span>
        </label>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your studies and focus areas"
          rows="4"
        ></textarea>
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          {isEditing ? 'Update Education' : 'Add Education'}
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Certification Form Component
export const CertificationForm = ({ certification = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: certification.id || Date.now(),
    title: certification.title || '',
    issuer: certification.issuer || '',
    issueDate: certification.issueDate || '',
    expiryDate: certification.expiryDate || '',
    credentialId: certification.credentialId || '',
    credentialUrl: certification.credentialUrl || '',
    description: certification.description || '',
  });

  const [certificateImage, setCertificateImage] = useState(null);

  // Update form data when certification prop changes (for editing)
  useEffect(() => {
    if (certification && Object.keys(certification).length > 0) {
      setFormData({
        id: certification.id || Date.now(),
        title: certification.title || '',
        issuer: certification.issuer || '',
        issueDate: certification.issueDate || '',
        expiryDate: certification.expiryDate || '',
        credentialId: certification.credentialId || '',
        credentialUrl: certification.credentialUrl || '',
        description: certification.description || '',
      });
    }
  }, [certification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass both formData and file to parent
    onSave(formData, certificateImage);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Certificate' : 'Add New Certificate'}</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title" className="required-label">Certificate Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Java Spring Boot Developer"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="issuer" className="required-label">Issuing Organization</label>
          <input
            type="text"
            id="issuer"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            placeholder="e.g. Oracle Academy"
            required
          />
        </div>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="issueDate">Issue Date</label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />
          <div className="form-help">Leave empty if certificate doesn't expire</div>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="credentialId">Credential ID</label>
          <input
            type="text"
            id="credentialId"
            name="credentialId"
            value={formData.credentialId}
            onChange={handleChange}
            placeholder="e.g. CERT123456"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="credentialUrl">Credential URL</label>
          <input
            type="url"
            id="credentialUrl"
            name="credentialUrl"
            value={formData.credentialUrl}
            onChange={handleChange}
            placeholder="https://example.com/certificate/123456"
          />
          <div className="form-help">Link to verify the certificate</div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="certificateImage">Certificate Image</label>
        <input
          type="file"
          id="certificateImage"
          name="certificateImage"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
        />
        <div className="form-help">Upload certificate image (JPG, PNG, or PDF)</div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Completed advanced Spring Boot course with distinction"
          rows="3"
        ></textarea>
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          {isEditing ? 'Update Certificate' : 'Add Certificate'}
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Achievement Form Component
export const AchievementForm = ({ achievement = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: achievement.id || Date.now(),
    title: achievement.title || '',
    issuer: achievement.issuer || '',
    date: achievement.date || '',
    description: achievement.description || '',
    url: achievement.url || '',
  });

  // Update form data when achievement prop changes (for editing)
  useEffect(() => {
    if (achievement && Object.keys(achievement).length > 0) {
      setFormData({
        id: achievement.id || Date.now(),
        title: achievement.title || '',
        issuer: achievement.issuer || '',
        date: achievement.date || '',
        description: achievement.description || '',
        url: achievement.url || '',
      });
    }
  }, [achievement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Achievement' : 'Add New Achievement'}</h3>
      
      <div className="form-group">
        <label htmlFor="title" className="required-label">Achievement Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Best Innovator Award 2024"
          required
        />
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="issuer">Issuing Organization</label>
          <input
            type="text"
            id="issuer"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            placeholder="e.g. Tech Innovators Inc."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="url">Award URL</label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com/award-details"
        />
        <div className="form-help">Link to award details or verification page (optional)</div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Awarded for outstanding innovation in software development"
          rows="4"
        ></textarea>
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          {isEditing ? 'Update Achievement' : 'Add Achievement'}
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Overview Form Component
export const OverviewForm = ({ overview = "", onSave, onCancel }) => {
  // Get the full portfolio data from the overview parameter
  // When called from ModalManager, it should pass the entire portfolioData
  const portfolio = typeof overview === 'object' ? overview : { overview: overview || '' };
  
  const [formData, setFormData] = useState({
    fullName: portfolio.fullName || '',
    bio: portfolio.bio || '',
    overview: portfolio.overview || '',
    socialLinks: portfolio.socialLinks?.join('\n') || '',
    leetcodeLink: portfolio.leetcodeLink || '',
    githubLink: portfolio.githubLink || '',
    linkedInLink: portfolio.linkedInLink || '',
    twitterLink: portfolio.twitterLink || '',
    personalWebsiteLink: portfolio.personalWebsiteLink || '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);

  // Update form data when portfolio prop changes
  useEffect(() => {
    const portfolioData = typeof overview === 'object' ? overview : { overview: overview || '' };
    setFormData({
      fullName: portfolioData.fullName || '',
      bio: portfolioData.bio || '',
      overview: portfolioData.overview || '',
      socialLinks: portfolioData.socialLinks?.join('\n') || '',
      leetcodeLink: portfolioData.leetcodeLink || '',
      githubLink: portfolioData.githubLink || '',
      linkedInLink: portfolioData.linkedInLink || '',
      twitterLink: portfolioData.twitterLink || '',
      personalWebsiteLink: portfolioData.personalWebsiteLink || '',
    });
  }, [overview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      if (name === 'profileImage') {
        // Validate image file
        if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
          alert('Please upload a valid image file (JPG, PNG)');
          e.target.value = null;
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB');
          e.target.value = null;
          return;
        }
        setProfileImage(file);
      } else if (name === 'resume') {
        // Validate PDF file
        if (file.type !== 'application/pdf') {
          alert('Please upload a PDF file only');
          e.target.value = null;
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert('Resume size must be less than 10MB');
          e.target.value = null;
          return;
        }
        setResume(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert socialLinks from newline-separated string to array
    const socialLinksArray = formData.socialLinks
      .split('\n')
      .map(link => link.trim())
      .filter(link => link.length > 0);
    
    // Prepare data with socialLinks as array
    const dataToSave = {
      ...formData,
      socialLinks: socialLinksArray
    };
    
    // Send data along with files to match backend DTO
    onSave(dataToSave, profileImage, resume);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>Edit Portfolio Information</h3>
      <p className="form-description">Update your portfolio details, social links, and files</p>
      
      <div className="form-grid">
        {/* Full Name */}
        <div className="form-group full-width">
          <label htmlFor="fullName" className="required-label">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Bio */}
        <div className="form-group full-width">
          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="e.g., Full Stack Developer | AI Enthusiast"
            maxLength={100}
          />
          <p className="form-help">A short tagline or professional title (max 100 characters)</p>
        </div>

        {/* Professional Overview */}
        <div className="form-group full-width">
          <label htmlFor="overview" className="required-label">Professional Overview</label>
          <textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            rows={6}
            required
          />
          <p className="form-help">A detailed description of your professional background and goals</p>
        </div>

        {/* Profile Image */}
        <div className="form-group full-width">
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
          />
          <p className="form-help">
            {profileImage ? `Selected: ${profileImage.name}` : 'Upload a professional photo (JPG, PNG - max 5MB)'}
          </p>
          {portfolio.profileImageUrl && !profileImage && (
            <div className="current-file-info">
              <a href={portfolio.profileImageUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                View Current Profile Image
              </a>
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="form-group full-width">
          <label htmlFor="resume">Resume/CV</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <p className="form-help">
            {resume ? `Selected: ${resume.name}` : 'Upload your resume in PDF format (max 10MB)'}
          </p>
          {portfolio.resumeLink && !resume && (
            <div className="current-file-info">
              <a href={portfolio.resumeLink} target="_blank" rel="noopener noreferrer" className="file-link">
                View Current Resume
              </a>
            </div>
          )}
        </div>

        <h4 className="section-divider full-width">Professional Links</h4>

        {/* LinkedIn */}
        <div className="form-group">
          <label htmlFor="linkedInLink">LinkedIn</label>
          <input
            type="url"
            id="linkedInLink"
            name="linkedInLink"
            value={formData.linkedInLink}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* GitHub */}
        <div className="form-group">
          <label htmlFor="githubLink">GitHub</label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
          />
        </div>

        {/* LeetCode */}
        <div className="form-group">
          <label htmlFor="leetcodeLink">LeetCode</label>
          <input
            type="url"
            id="leetcodeLink"
            name="leetcodeLink"
            value={formData.leetcodeLink}
            onChange={handleChange}
            placeholder="https://leetcode.com/yourusername"
          />
        </div>

        {/* Twitter */}
        <div className="form-group">
          <label htmlFor="twitterLink">Twitter</label>
          <input
            type="url"
            id="twitterLink"
            name="twitterLink"
            value={formData.twitterLink}
            onChange={handleChange}
            placeholder="https://twitter.com/yourusername"
          />
        </div>

        {/* Personal Website */}
        <div className="form-group full-width">
          <label htmlFor="personalWebsiteLink">Personal Website</label>
          <input
            type="url"
            id="personalWebsiteLink"
            name="personalWebsiteLink"
            value={formData.personalWebsiteLink}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <h4 className="section-divider full-width">Additional Social Links</h4>

        {/* Social Links */}
        <div className="form-group full-width">
          <label htmlFor="socialLinks">Other Social Media Links</label>
          <textarea
            id="socialLinks"
            name="socialLinks"
            value={formData.socialLinks}
            onChange={handleChange}
            placeholder="https://medium.com/@yourusername&#10;https://dev.to/yourusername&#10;https://stackoverflow.com/users/yourprofile"
            rows={4}
          />
          <p className="form-help">Enter one link per line (e.g., Medium, Dev.to, Stack Overflow, etc.)</p>
        </div>
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          Save Changes
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Contact Info Form Component
export const ContactForm = ({ contact = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    email: contact.email || '',
    phone: contact.phone || '',
    location: contact.location || '',
  });

  // Update form data when contact prop changes (for editing)
  useEffect(() => {
    if (contact && Object.keys(contact).length > 0) {
      setFormData({
        email: contact.email || '',
        phone: contact.phone || '',
        location: contact.location || '',
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>Edit Contact Information</h3>
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your professional email address"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your contact phone number"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. San Francisco, CA"
        />
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          Update Contact Info
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Social Links Form Component
export const SocialLinksForm = ({ social = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    linkedInLink: social.linkedInLink || '',
    githubLink: social.githubLink || '',
    twitterLink: social.twitterLink || '',
    leetcodeLink: social.leetcodeLink || '',
    personalWebsiteLink: social.personalWebsiteLink || '',
  });

  // Update form data when social prop changes (for editing)
  useEffect(() => {
    if (social && Object.keys(social).length > 0) {
      setFormData({
        linkedInLink: social.linkedInLink || '',
        githubLink: social.githubLink || '',
        twitterLink: social.twitterLink || '',
        leetcodeLink: social.leetcodeLink || '',
        personalWebsiteLink: social.personalWebsiteLink || '',
      });
    }
  }, [social]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>Edit Social Links</h3>
      
      <div className="form-group">
        <label htmlFor="linkedInLink">LinkedIn URL</label>
        <input
          type="url"
          id="linkedInLink"
          name="linkedInLink"
          value={formData.linkedInLink}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="githubLink">GitHub URL</label>
        <input
          type="url"
          id="githubLink"
          name="githubLink"
          value={formData.githubLink}
          onChange={handleChange}
          placeholder="https://github.com/yourusername"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="leetcodeLink">LeetCode URL</label>
        <input
          type="url"
          id="leetcodeLink"
          name="leetcodeLink"
          value={formData.leetcodeLink}
          onChange={handleChange}
          placeholder="https://leetcode.com/yourusername"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="twitterLink">Twitter URL</label>
        <input
          type="url"
          id="twitterLink"
          name="twitterLink"
          value={formData.twitterLink}
          onChange={handleChange}
          placeholder="https://twitter.com/yourusername"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="personalWebsiteLink">Personal Website</label>
        <input
          type="url"
          id="personalWebsiteLink"
          name="personalWebsiteLink"
          value={formData.personalWebsiteLink}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
        />
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          Update Social Links
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// CV Upload Form Component
export const CVUploadForm = ({ currentCV = "", onSave, onCancel }) => {
  const [resume, setResume] = useState(null);
  const [currentResumeLink, setCurrentResumeLink] = useState(currentCV || '');

  // Update when currentCV prop changes
  useEffect(() => {
    setCurrentResumeLink(currentCV || '');
  }, [currentCV]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only');
        e.target.value = null;
        return;
      }
      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = null;
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resume) {
      alert('Please select a resume file to upload');
      return;
    }
    // Send empty object for portfolioData and the resume file
    // This will only update the resume field
    onSave({}, null, resume);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>Update CV/Resume</h3>
      
      {currentResumeLink && (
        <div className="form-group">
          <label>Current Resume</label>
          <div className="current-file-info">
            <a href={currentResumeLink} target="_blank" rel="noopener noreferrer" className="file-link">
              View Current Resume
            </a>
          </div>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="resume" className="required-label">Upload New Resume</label>
        <input
          type="file"
          id="resume"
          name="resume"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <p className="form-help">Upload your resume in PDF format (max 10MB)</p>
        {resume && (
          <p className="selected-file">Selected: {resume.name}</p>
        )}
      </div>
      
      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          Upload Resume
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Profile Form Component (for creating initial portfolio)
export const ProfileForm = ({ profile = {}, onSave, onCancel, isEditing = false, userEmail = '' }) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    bio: profile.bio || '',
    overview: profile.overview || '',
    socialLinks: profile.socialLinks?.join('\n') || '',
    leetcodeLink: profile.leetcodeLink || '',
    githubLink: profile.githubLink || '',
    linkedInLink: profile.linkedInLink || '',
    twitterLink: profile.twitterLink || '',
    personalWebsiteLink: profile.personalWebsiteLink || '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);

  // Update form data when profile prop changes (for editing)
  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        overview: profile.overview || '',
        socialLinks: profile.socialLinks?.join('\n') || '',
        leetcodeLink: profile.leetcodeLink || '',
        githubLink: profile.githubLink || '',
        linkedInLink: profile.linkedInLink || '',
        twitterLink: profile.twitterLink || '',
        personalWebsiteLink: profile.personalWebsiteLink || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'profileImage') {
        setProfileImage(files[0]);
      } else if (name === 'resume') {
        setResume(files[0]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert socialLinks from newline-separated string to array
    const socialLinksArray = formData.socialLinks
      .split('\n')
      .map(link => link.trim())
      .filter(link => link.length > 0);
    
    // Prepare data with socialLinks as array
    const dataToSave = {
      ...formData,
      socialLinks: socialLinksArray
    };
    
    // Pass both form data and files to the save handler
    onSave(dataToSave, profileImage, resume);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Profile' : 'Create Your Portfolio'}</h3>
      <p className="form-description">
        Let's set up your professional portfolio. Fill in the required information to get started.
      </p>
      
      <div className="form-grid">
        {/* Full Name - Required */}
        <div className="form-group full-width">
          <label htmlFor="fullName" className="required-label">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Bio */}
        <div className="form-group full-width">
          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="e.g., Full Stack Developer | AI Enthusiast"
            maxLength={100}
          />
          <p className="form-help">A short tagline or professional title (max 100 characters)</p>
        </div>

        {/* Overview */}
        <div className="form-group full-width">
          <label htmlFor="overview">Overview</label>
          <textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            rows={5}
          />
          <p className="form-help">A detailed description of your professional background and goals</p>
        </div>

        {/* Profile Image */}
        <div className="form-group full-width">
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
          />
          <p className="form-help">Upload a professional photo (JPG, PNG - max 5MB)</p>
        </div>

        {/* Resume */}
        <div className="form-group full-width">
          <label htmlFor="resume">Resume/CV</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <p className="form-help">Upload your resume in PDF format (max 10MB)</p>
        </div>

        <h4 className="section-divider full-width">Professional Links</h4>

        {/* LinkedIn */}
        <div className="form-group">
          <label htmlFor="linkedInLink">LinkedIn</label>
          <input
            type="url"
            id="linkedInLink"
            name="linkedInLink"
            value={formData.linkedInLink}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* GitHub */}
        <div className="form-group">
          <label htmlFor="githubLink">GitHub</label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
          />
        </div>

        {/* LeetCode */}
        <div className="form-group">
          <label htmlFor="leetcodeLink">LeetCode</label>
          <input
            type="url"
            id="leetcodeLink"
            name="leetcodeLink"
            value={formData.leetcodeLink}
            onChange={handleChange}
            placeholder="https://leetcode.com/yourusername"
          />
        </div>

        {/* Twitter */}
        <div className="form-group">
          <label htmlFor="twitterLink">Twitter</label>
          <input
            type="url"
            id="twitterLink"
            name="twitterLink"
            value={formData.twitterLink}
            onChange={handleChange}
            placeholder="https://twitter.com/yourusername"
          />
        </div>

        {/* Personal Website */}
        <div className="form-group full-width">
          <label htmlFor="personalWebsiteLink">Personal Website</label>
          <input
            type="url"
            id="personalWebsiteLink"
            name="personalWebsiteLink"
            value={formData.personalWebsiteLink}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <h4 className="section-divider full-width">Additional Social Links</h4>

        {/* Social Links */}
        <div className="form-group full-width">
          <label htmlFor="socialLinks">Other Social Media Links</label>
          <textarea
            id="socialLinks"
            name="socialLinks"
            value={formData.socialLinks}
            onChange={handleChange}
            placeholder="https://medium.com/@yourusername&#10;https://dev.to/yourusername&#10;https://stackoverflow.com/users/yourprofile"
            rows={4}
          />
          <p className="form-help">Enter one link per line (e.g., Medium, Dev.to, Stack Overflow, etc.)</p>
        </div>
      </div>

      <div className="portfolio-form-actions">
        <button type="submit" className="portfolio-btn-save">
          {isEditing ? 'Update Profile' : 'Create Portfolio'}
        </button>
        <button type="button" className="portfolio-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
