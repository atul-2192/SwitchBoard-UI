import React, { useState } from 'react';
import './PortfolioForms.css';

// Skill Form Component
export const SkillForm = ({ skill = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: skill.id || Date.now(),
    name: skill.name || '',
    level: skill.level || 50,
    description: skill.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'level' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
            placeholder="e.g. React.js, Python, UI Design"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="level">Proficiency Level: {formData.level}%</label>
          <input
            type="range"
            id="level"
            name="level"
            min="10"
            max="100"
            step="5"
            value={formData.level}
            onChange={handleChange}
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
          placeholder="Brief description of your skill and experience with it"
          rows="3"
        ></textarea>
        <div className="form-help">Explain your experience with this skill and how you've applied it</div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {isEditing ? 'Update Skill' : 'Add Skill'}
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
    technologies: project.technologies?.join(', ') || '',
    image: project.image || '',
    link: project.link || '',
    demoLink: project.demoLink || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert technologies from string to array
    const processedData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
    };
    onSave(processedData);
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
          <label htmlFor="technologies" className="required-label">Technologies Used</label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
            required
          />
          <div className="form-help">Separate technologies with commas</div>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="required-label">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your project, its purpose and your role in it"
          rows="4"
          required
        ></textarea>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="URL to project screenshot or image"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="link">Repository Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="GitHub repository or code link"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="demoLink">Live Demo Link</label>
        <input
          type="url"
          id="demoLink"
          name="demoLink"
          value={formData.demoLink}
          onChange={handleChange}
          placeholder="URL to live demo of the project"
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {isEditing ? 'Update Project' : 'Add Project'}
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
    period: experience.period || '',
    description: experience.description || '',
    achievements: experience.achievements?.join('\n') || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert achievements from string to array
    const processedData = {
      ...formData,
      achievements: formData.achievements.split('\n').map(item => item.trim()).filter(item => item),
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
        <label htmlFor="period" className="required-label">Time Period</label>
        <input
          type="text"
          id="period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          placeholder="e.g. 2021 - Present"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="required-label">Job Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your responsibilities and role at the company"
          rows="4"
          required
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="achievements">Key Achievements</label>
        <textarea
          id="achievements"
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          placeholder="List your key achievements (one per line)"
          rows="4"
        ></textarea>
        <div className="form-help">Add each achievement on a new line. These will be displayed as bullet points.</div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {isEditing ? 'Update Experience' : 'Add Experience'}
        </button>
      </div>
    </form>
  );
};

// Education Form Component
export const EducationForm = ({ education = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: education.id || Date.now(),
    degree: education.degree || '',
    institution: education.institution || '',
    period: education.period || '',
    description: education.description || '',
    achievements: education.achievements?.join('\n') || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert achievements from string to array
    const processedData = {
      ...formData,
      achievements: formData.achievements.split('\n').map(item => item.trim()).filter(item => item),
    };
    onSave(processedData);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Edit Education' : 'Add New Education'}</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="degree" className="required-label">Degree / Qualification</label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="e.g. Master of Computer Science"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="institution" className="required-label">Institution</label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="e.g. University of Technology"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="period" className="required-label">Time Period</label>
        <input
          type="text"
          id="period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          placeholder="e.g. 2018 - 2020"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your studies and focus areas"
          rows="3"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="achievements">Achievements</label>
        <textarea
          id="achievements"
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          placeholder="List your achievements (one per line)"
          rows="3"
        ></textarea>
        <div className="form-help">Add each achievement on a new line. These will be displayed as bullet points.</div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {isEditing ? 'Update Education' : 'Add Education'}
        </button>
      </div>
    </form>
  );
};

// Certification Form Component
export const CertificationForm = ({ certification = {}, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: certification.id || Date.now(),
    name: certification.name || '',
    issuer: certification.issuer || '',
    date: certification.date || '',
    link: certification.link || '',
  });

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
      <h3>{isEditing ? 'Edit Certification' : 'Add New Certification'}</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name" className="required-label">Certification Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. AWS Certified Solutions Architect"
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
            placeholder="e.g. Amazon Web Services"
            required
          />
        </div>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="date" className="required-label">Date Acquired</label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="e.g. 2023"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="link">Certification Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="URL to view or verify the certification"
          />
          <div className="form-help">Link to credential verification page (optional)</div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {isEditing ? 'Update Certification' : 'Add Certification'}
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
    organization: achievement.organization || '',
    date: achievement.date || '',
    description: achievement.description || '',
  });

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
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title" className="required-label">Achievement Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Best Developer Award"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="organization">Organization</label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="e.g. Tech Conference 2023"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="date" className="required-label">Date</label>
        <input
          type="text"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="e.g. June 2023"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the achievement and its significance"
          rows="4"
        ></textarea>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {isEditing ? 'Update Achievement' : 'Add Achievement'}
        </button>
      </div>
    </form>
  );
};

// Overview Form Component
export const OverviewForm = ({ overview = "", onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    overview: overview || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData.overview);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>Edit Professional Overview</h3>
      
      <div className="form-group">
        <label htmlFor="overview" className="required-label">Professional Overview</label>
        <textarea
          id="overview"
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          placeholder="Provide a brief summary of your professional background, key skills, and career goals"
          rows="6"
          required
        ></textarea>
        <div className="form-help">This overview will appear at the top of your portfolio and serves as your professional introduction.</div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          Save Overview
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
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          Update Contact Info
        </button>
      </div>
    </form>
  );
};

// Social Links Form Component
export const SocialLinksForm = ({ social = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    linkedin: social.linkedin || '',
    github: social.github || '',
    twitter: social.twitter || '',
    website: social.website || '',
  });

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
        <label htmlFor="linkedin">LinkedIn Username</label>
        <input
          type="text"
          id="linkedin"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="Your LinkedIn username or profile ID"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="github">GitHub Username</label>
        <input
          type="text"
          id="github"
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="Your GitHub username"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="twitter">Twitter Username</label>
        <input
          type="text"
          id="twitter"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          placeholder="Your Twitter/X username (without @)"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="website">Personal Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="URL to your personal website or blog"
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          Update Social Links
        </button>
      </div>
    </form>
  );
};

// CV Upload Form Component
export const CVUploadForm = ({ currentCV = "", onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    cv: currentCV || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData.cv);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h3>Update CV/Resume</h3>
      
      <div className="form-group">
        <label htmlFor="cv">CV/Resume Link</label>
        <input
          type="url"
          id="cv"
          name="cv"
          value={formData.cv}
          onChange={handleChange}
          placeholder="Link to your hosted CV/Resume (PDF recommended)"
          required
        />
        <p className="form-help">Provide a link to your CV/Resume. For best results, use a PDF file.</p>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          Update CV Link
        </button>
      </div>
    </form>
  );
};
