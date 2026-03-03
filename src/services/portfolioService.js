/**
 * Portfolio Service
 * Handles all portfolio-related API calls
 * Based on SwitchBoard Portfolio Service API Contract v1.0
 */
import { apiClient } from './apiClient';

/**
 * Helper function to extract data from API response
 * API responses are wrapped in: { success, message, data, errorCode, timestamp, path }
 */
const extractData = (response) => {
  return response.data?.data || response.data;
};

export const portfolioService = {
  // ==================== Portfolio Management ====================

  /**
   * Get portfolio by ID
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Portfolio data
   */
  getPortfolioById: async (portfolioId) => {
    try {

      const response = await apiClient.get(`/portfolio/${portfolioId}`);

      return extractData(response);
    } catch (error) {

      if (error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  /**
   * Get portfolio by email (path parameter)
   * PUBLIC ENDPOINT - Can be accessed without authentication for portfolio sharing
   * @param {string} email - User email
   * @param {boolean} skipAuth - Skip authentication for public access
   * @returns {Promise} Portfolio data
   */
  getPortfolioByEmail: async (email, skipAuth = false) => {
    try {


      
      const config = skipAuth ? { skipAuth: true } : {};
      const response = await apiClient.get(`/portfolio/user/${email}`, config);
      

      return extractData(response);
    } catch (error) {

      if (error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  /**
   * Get current user's portfolio (uses X-User-Email header from JWT)
   * @returns {Promise} Portfolio data
   */
  getMyPortfolio: async () => {
    try {

      const response = await apiClient.get('/portfolio/user');

      return extractData(response);
    } catch (error) {

      if (error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  /**
   * Create a new portfolio
   * @param {object} portfolioData - Portfolio data
   * @param {File} profileImage - Profile image file (optional)
   * @param {File} resume - Resume PDF file (optional)
   * @returns {Promise} Created portfolio data
   */
  createPortfolio: async (portfolioData, profileImage = null, resume = null) => {
    try {




      
      const formData = new FormData();
      
      // Add text fields
      if (portfolioData.fullName) formData.append('fullName', portfolioData.fullName);
      if (portfolioData.bio) formData.append('bio', portfolioData.bio);
      if (portfolioData.overview) formData.append('overview', portfolioData.overview);
      if (portfolioData.leetcodeLink) formData.append('leetcodeLink', portfolioData.leetcodeLink);
      if (portfolioData.githubLink) formData.append('githubLink', portfolioData.githubLink);
      if (portfolioData.linkedInLink) formData.append('linkedInLink', portfolioData.linkedInLink);
      if (portfolioData.twitterLink) formData.append('twitterLink', portfolioData.twitterLink);
      if (portfolioData.personalWebsiteLink) formData.append('personalWebsiteLink', portfolioData.personalWebsiteLink);
      
      // Add social links array
      if (portfolioData.socialLinks && Array.isArray(portfolioData.socialLinks)) {
        formData.append('socialLinks', JSON.stringify(portfolioData.socialLinks));
      }
      
      // Add files
      if (profileImage) formData.append('profileImage', profileImage);
      if (resume) formData.append('resume', resume);


      for (let pair of formData.entries()) {

      }

      const response = await apiClient.post('/portfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      

      return extractData(response);
    } catch (error) {



      throw error;
    }
  },

  /**
   * Update portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @param {object} portfolioData - Updated portfolio data
   * @param {File} profileImage - Profile image file (optional)
   * @param {File} resume - Resume PDF file (optional)
   * @returns {Promise} Updated portfolio data
   */
  updatePortfolio: async (portfolioId, portfolioData, profileImage = null, resume = null) => {
    try {
      const formData = new FormData();
      
      // Add text fields (all optional for update)
      if (portfolioData.fullName) formData.append('fullName', portfolioData.fullName);
      if (portfolioData.bio) formData.append('bio', portfolioData.bio);
      if (portfolioData.overview) formData.append('overview', portfolioData.overview);
      if (portfolioData.leetcodeLink) formData.append('leetcodeLink', portfolioData.leetcodeLink);
      if (portfolioData.githubLink) formData.append('githubLink', portfolioData.githubLink);
      if (portfolioData.linkedInLink) formData.append('linkedInLink', portfolioData.linkedInLink);
      if (portfolioData.twitterLink) formData.append('twitterLink', portfolioData.twitterLink);
      if (portfolioData.personalWebsiteLink) formData.append('personalWebsiteLink', portfolioData.personalWebsiteLink);
      
      // Add social links array
      if (portfolioData.socialLinks && Array.isArray(portfolioData.socialLinks)) {
        formData.append('socialLinks', JSON.stringify(portfolioData.socialLinks));
      }
      
      // Add files
      if (profileImage) formData.append('profileImage', profileImage);
      if (resume) formData.append('resume', resume);

      const response = await apiClient.put(`/portfolio/${portfolioId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Delete portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Success boolean
   */
  deletePortfolio: async (portfolioId) => {
    try {
      const response = await apiClient.delete(`/portfolio/${portfolioId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  // ==================== Skills Management ====================

  /**
   * Get all skills for a portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Array of skills
   */
  getSkills: async (portfolioId) => {
    try {

      const response = await apiClient.get(`/portfolio/${portfolioId}/skills`);

      return extractData(response);
    } catch (error) {


      throw error;
    }
  },

  /**
   * Get skill by ID
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} skillId - Skill UUID
   * @returns {Promise} Skill data
   */
  getSkillById: async (portfolioId, skillId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/skills/${skillId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Create a new skill
   * @param {string} portfolioId - Portfolio UUID
   * @param {object} skillData - Skill data: { name, category, proficiencyLevel, yearsOfExperience, description }
   * @returns {Promise} Created skill
   */
  createSkill: async (portfolioId, skillData) => {
    try {



      
      const response = await apiClient.post(`/portfolio/${portfolioId}/skills`, skillData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      

      return extractData(response);
    } catch (error) {



      throw error;
    }
  },

  /**
   * Update a skill
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} skillId - Skill UUID
   * @param {object} skillData - Updated skill data: { name, category, proficiencyLevel, yearsOfExperience, description }
   * @returns {Promise} Updated skill
   */
  updateSkill: async (portfolioId, skillId, skillData) => {
    try {



      
      const response = await apiClient.put(`/portfolio/${portfolioId}/skills/${skillId}`, skillData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      

      return extractData(response);
    } catch (error) {


      throw error;
    }
  },

  /**
   * Delete a skill
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} skillId - Skill UUID
   * @returns {Promise} Success boolean
   */
  deleteSkill: async (portfolioId, skillId) => {
    try {

      const response = await apiClient.delete(`/portfolio/${portfolioId}/skills/${skillId}`);

      return extractData(response);
    } catch (error) {


      throw error;
    }
  },

  // ==================== Projects Management ====================

  /**
   * Get all projects for a portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Array of projects
   */
  getProjects: async (portfolioId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/projects`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get project by ID
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} projectId - Project UUID
   * @returns {Promise} Project data
   */
  getProjectById: async (portfolioId, projectId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/projects/${projectId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Create a new project
   * @param {string} portfolioId - Portfolio UUID
   * @param {object} projectData - Project data
   * @param {File} image - Project image file (optional)
   * @returns {Promise} Created project
   */
  createProject: async (portfolioId, projectData, image = null) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (projectData.title) formData.append('title', projectData.title);
      if (projectData.description) formData.append('description', projectData.description);
      if (projectData.startDate) formData.append('startDate', projectData.startDate);
      if (projectData.endDate) formData.append('endDate', projectData.endDate);
      if (projectData.liveUrl) formData.append('liveUrl', projectData.liveUrl);
      if (projectData.repoUrl) formData.append('repoUrl', projectData.repoUrl);
      if (projectData.role) formData.append('role', projectData.role);
      if (projectData.status) formData.append('status', projectData.status);
      if (projectData.ongoing !== undefined) formData.append('ongoing', projectData.ongoing);
      
      // Add arrays as JSON strings
      if (projectData.technologies) formData.append('technologies', JSON.stringify(projectData.technologies));
      if (projectData.features) formData.append('features', JSON.stringify(projectData.features));
      
      // Add image file
      if (image) formData.append('image', image);

      const response = await apiClient.post(`/portfolio/${portfolioId}/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Update a project
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} projectId - Project UUID
   * @param {object} projectData - Updated project data
   * @param {File} image - Project image file (optional)
   * @returns {Promise} Updated project
   */
  updateProject: async (portfolioId, projectId, projectData, image = null) => {
    try {
      const formData = new FormData();
      
      // Add text fields (all optional for update)
      if (projectData.title) formData.append('title', projectData.title);
      if (projectData.description) formData.append('description', projectData.description);
      if (projectData.startDate) formData.append('startDate', projectData.startDate);
      if (projectData.endDate) formData.append('endDate', projectData.endDate);
      if (projectData.liveUrl) formData.append('liveUrl', projectData.liveUrl);
      if (projectData.repoUrl) formData.append('repoUrl', projectData.repoUrl);
      if (projectData.role) formData.append('role', projectData.role);
      if (projectData.status) formData.append('status', projectData.status);
      if (projectData.ongoing !== undefined) formData.append('ongoing', projectData.ongoing);
      
      // Add arrays as JSON strings
      if (projectData.technologies) formData.append('technologies', JSON.stringify(projectData.technologies));
      if (projectData.features) formData.append('features', JSON.stringify(projectData.features));
      
      // Add image file
      if (image) formData.append('image', image);

      const response = await apiClient.put(`/portfolio/${portfolioId}/projects/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Delete a project
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} projectId - Project UUID
   * @returns {Promise} Success boolean
   */
  deleteProject: async (portfolioId, projectId) => {
    try {
      const response = await apiClient.delete(`/portfolio/${portfolioId}/projects/${projectId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  // ==================== Experience Management ====================

  /**
   * Get all experiences for a portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Array of experiences
   */
  getExperiences: async (portfolioId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/experience`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get experience by ID
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} experienceId - Experience UUID
   * @returns {Promise} Experience data
   */
  getExperienceById: async (portfolioId, experienceId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/experience/${experienceId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Create a new experience
   * @param {string} portfolioId - Portfolio UUID
   * @param {object} experienceData - Experience data
   * @returns {Promise} Created experience
   */
  createExperience: async (portfolioId, experienceData) => {
    try {
      const response = await apiClient.post(`/portfolio/${portfolioId}/experience`, experienceData);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Update an experience
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} experienceId - Experience UUID
   * @param {object} experienceData - Updated experience data
   * @returns {Promise} Updated experience
   */
  updateExperience: async (portfolioId, experienceId, experienceData) => {
    try {
      const response = await apiClient.put(`/portfolio/${portfolioId}/experience/${experienceId}`, experienceData);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Delete an experience
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} experienceId - Experience UUID
   * @returns {Promise} Success boolean
   */
  deleteExperience: async (portfolioId, experienceId) => {
    try {
      const response = await apiClient.delete(`/portfolio/${portfolioId}/experience/${experienceId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  // ==================== Education Management ====================

  /**
   * Get all education entries for a portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Array of education entries
   */
  getEducation: async (portfolioId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/education`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get education by ID
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} educationId - Education UUID
   * @returns {Promise} Education data
   */
  getEducationById: async (portfolioId, educationId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/education/${educationId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Create a new education entry
   * @param {string} portfolioId - Portfolio UUID
   * @param {object} educationData - Education data
   * @returns {Promise} Created education
   */
  createEducation: async (portfolioId, educationData) => {
    try {
      const response = await apiClient.post(`/portfolio/${portfolioId}/education`, educationData);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Update an education entry
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} educationId - Education UUID
   * @param {object} educationData - Updated education data
   * @returns {Promise} Updated education
   */
  updateEducation: async (portfolioId, educationId, educationData) => {
    try {
      const response = await apiClient.put(`/portfolio/${portfolioId}/education/${educationId}`, educationData);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Delete an education entry
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} educationId - Education UUID
   * @returns {Promise} Success boolean
   */
  deleteEducation: async (portfolioId, educationId) => {
    try {
      const response = await apiClient.delete(`/portfolio/${portfolioId}/education/${educationId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  // ==================== Certificates Management ====================

  /**
   * Get all certificates for a portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Array of certificates
   */
  getCertificates: async (portfolioId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/certificates`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get certificate by ID
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} certificateId - Certificate UUID
   * @returns {Promise} Certificate data
   */
  getCertificateById: async (portfolioId, certificateId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/certificates/${certificateId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Create a new certificate
   * @param {string} portfolioId - Portfolio UUID
   * @param {object} certificateData - Certificate data
   * @param {File} certificateImage - Certificate image file (optional)
   * @returns {Promise} Created certificate
   */
  createCertificate: async (portfolioId, certificateData, certificateImage = null) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (certificateData.title) formData.append('title', certificateData.title);
      if (certificateData.issuer) formData.append('issuer', certificateData.issuer);
      if (certificateData.issueDate) formData.append('issueDate', certificateData.issueDate);
      if (certificateData.expiryDate) formData.append('expiryDate', certificateData.expiryDate);
      if (certificateData.credentialId) formData.append('credentialId', certificateData.credentialId);
      if (certificateData.credentialUrl) formData.append('credentialUrl', certificateData.credentialUrl);
      if (certificateData.description) formData.append('description', certificateData.description);
      
      // Add certificate image file
      if (certificateImage) formData.append('certificateImage', certificateImage);

      const response = await apiClient.post(`/portfolio/${portfolioId}/certificates`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Update a certificate
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} certificateId - Certificate UUID
   * @param {object} certificateData - Updated certificate data
   * @param {File} certificateImage - Certificate image file (optional)
   * @returns {Promise} Updated certificate
   */
  updateCertificate: async (portfolioId, certificateId, certificateData, certificateImage = null) => {
    try {
      const formData = new FormData();
      
      // Add text fields (all optional for update)
      if (certificateData.title) formData.append('title', certificateData.title);
      if (certificateData.issuer) formData.append('issuer', certificateData.issuer);
      if (certificateData.issueDate) formData.append('issueDate', certificateData.issueDate);
      if (certificateData.expiryDate) formData.append('expiryDate', certificateData.expiryDate);
      if (certificateData.credentialId) formData.append('credentialId', certificateData.credentialId);
      if (certificateData.credentialUrl) formData.append('credentialUrl', certificateData.credentialUrl);
      if (certificateData.description) formData.append('description', certificateData.description);
      
      // Add certificate image file
      if (certificateImage) formData.append('certificateImage', certificateImage);

      const response = await apiClient.put(`/portfolio/${portfolioId}/certificates/${certificateId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Delete a certificate
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} certificateId - Certificate UUID
   * @returns {Promise} Success boolean
   */
  deleteCertificate: async (portfolioId, certificateId) => {
    try {
      const response = await apiClient.delete(`/portfolio/${portfolioId}/certificates/${certificateId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  // ==================== Achievements Management ====================

  /**
   * Get all achievements for a portfolio
   * @param {string} portfolioId - Portfolio UUID
   * @returns {Promise} Array of achievements
   */
  getAchievements: async (portfolioId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/achievements`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get achievement by ID
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} achievementId - Achievement UUID
   * @returns {Promise} Achievement data
   */
  getAchievementById: async (portfolioId, achievementId) => {
    try {
      const response = await apiClient.get(`/portfolio/${portfolioId}/achievements/${achievementId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Create a new achievement
   * @param {string} portfolioId - Portfolio UUID
   * @param {object} achievementData - Achievement data
   * @returns {Promise} Created achievement
   */
  createAchievement: async (portfolioId, achievementData) => {
    try {
      const response = await apiClient.post(`/portfolio/${portfolioId}/achievements`, achievementData);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Update an achievement
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} achievementId - Achievement UUID
   * @param {object} achievementData - Updated achievement data
   * @returns {Promise} Updated achievement
   */
  updateAchievement: async (portfolioId, achievementId, achievementData) => {
    try {
      const response = await apiClient.put(`/portfolio/${portfolioId}/achievements/${achievementId}`, achievementData);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },

  /**
   * Delete an achievement
   * @param {string} portfolioId - Portfolio UUID
   * @param {string} achievementId - Achievement UUID
   * @returns {Promise} Success boolean
   */
  deleteAchievement: async (portfolioId, achievementId) => {
    try {
      const response = await apiClient.delete(`/portfolio/${portfolioId}/achievements/${achievementId}`);
      return extractData(response);
    } catch (error) {

      throw error;
    }
  },
};
