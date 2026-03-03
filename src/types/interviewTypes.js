/**
 * Interview Experience API Types
 * Based on API Contract from backend
 */

// ============================================
// ENUM TYPES
// ============================================

/**
 * Interview Type Enum
 * @typedef {'ON_CAMPUS' | 'OFF_CAMPUS' | 'REFERRAL' | 'WALK_IN' | 'ONLINE' | 'RECRUITMENT_DRIVE'} InterviewType
 */
export const InterviewType = {
  ON_CAMPUS: 'ON_CAMPUS',
  OFF_CAMPUS: 'OFF_CAMPUS',
  REFERRAL: 'REFERRAL',
  WALK_IN: 'WALK_IN',
  ONLINE: 'ONLINE',
  RECRUITMENT_DRIVE: 'RECRUITMENT_DRIVE'
};

/**
 * Experience Level Enum
 * @typedef {'FRESHER' | 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'LEAD' | 'PRINCIPAL'} ExperienceLevel
 */
export const ExperienceLevel = {
  FRESHER: 'FRESHER',
  ENTRY_LEVEL: 'ENTRY_LEVEL',
  MID_LEVEL: 'MID_LEVEL',
  SENIOR_LEVEL: 'SENIOR_LEVEL',
  LEAD: 'LEAD',
  PRINCIPAL: 'PRINCIPAL'
};

/**
 * Interview Outcome Enum
 * @typedef {'SELECTED' | 'REJECTED' | 'WAITING' | 'OFFER_ACCEPTED' | 'OFFER_REJECTED' | 'WITHDREW'} InterviewOutcome
 */
export const InterviewOutcome = {
  SELECTED: 'SELECTED',
  REJECTED: 'REJECTED',
  WAITING: 'WAITING',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  OFFER_REJECTED: 'OFFER_REJECTED',
  WITHDREW: 'WITHDREW'
};

// ============================================
// REQUEST/RESPONSE TYPES (JSDoc)
// ============================================

/**
 * Interview Experience Request
 * @typedef {Object} InterviewExperienceRequest
 * @property {string} title - Interview title (3-100 chars)
 * @property {string} content - Detailed experience (min 10 chars)
 * @property {string} companyName - Company name
 * @property {string} role - Job role/position
 * @property {InterviewType} interviewType - Type of interview
 * @property {ExperienceLevel} experienceLevel - Experience level
 * @property {InterviewOutcome} outcome - Interview result
 * @property {number|null} [numberOfRounds] - Number of rounds (1-10, optional)
 */

/**
 * Interview Experience Response
 * @typedef {Object} InterviewExperienceResponse
 * @property {string} id - Interview UUID
 * @property {string} userName - User's name
 * @property {string} userEmail - User's email
 * @property {string} title - Interview title
 * @property {string} content - Detailed experience
 * @property {string} companyName - Company name
 * @property {string} role - Job role
 * @property {InterviewType} interviewType - Type of interview
 * @property {ExperienceLevel} experienceLevel - Experience level
 * @property {InterviewOutcome} outcome - Interview result
 * @property {number|null} numberOfRounds - Number of rounds
 * @property {string|null} imageName - Image filename
 * @property {string} createdAt - Creation timestamp (ISO 8601)
 * @property {string} updatedAt - Update timestamp (ISO 8601)
 */

/**
 * Paginated Response
 * @typedef {Object} PageResponse
 * @property {InterviewExperienceResponse[]} content - Array of interviews
 * @property {number} pageNumber - Current page number (0-indexed)
 * @property {number} pageSize - Items per page
 * @property {number} totalElements - Total number of items
 * @property {number} totalPages - Total number of pages
 * @property {boolean} lastPage - Whether this is the last page
 */

// ============================================
// DISPLAY LABEL MAPPINGS
// ============================================

/**
 * Get display label for Interview Type
 * @param {InterviewType} type
 * @returns {string}
 */
export const getInterviewTypeLabel = (type) => {
  const labels = {
    ON_CAMPUS: 'On Campus',
    OFF_CAMPUS: 'Off Campus',
    REFERRAL: 'Referral',
    WALK_IN: 'Walk-In',
    ONLINE: 'Online',
    RECRUITMENT_DRIVE: 'Recruitment Drive'
  };
  return labels[type] || type;
};

/**
 * Get display label for Experience Level
 * @param {ExperienceLevel} level
 * @returns {string}
 */
export const getExperienceLevelLabel = (level) => {
  const labels = {
    FRESHER: 'Fresher',
    ENTRY_LEVEL: 'Entry Level',
    MID_LEVEL: 'Mid Level',
    SENIOR_LEVEL: 'Senior Level',
    LEAD: 'Lead',
    PRINCIPAL: 'Principal'
  };
  return labels[level] || level;
};

/**
 * Get display label for Interview Outcome
 * @param {InterviewOutcome} outcome
 * @returns {string}
 */
export const getInterviewOutcomeLabel = (outcome) => {
  const labels = {
    SELECTED: 'Selected',
    REJECTED: 'Rejected',
    WAITING: 'Waiting',
    OFFER_ACCEPTED: 'Offer Accepted',
    OFFER_REJECTED: 'Offer Rejected',
    WITHDREW: 'Withdrew'
  };
  return labels[outcome] || outcome;
};

/**
 * Get color class for outcome badge
 * @param {InterviewOutcome} outcome
 * @returns {string}
 */
export const getOutcomeColor = (outcome) => {
  const colors = {
    SELECTED: 'success',
    REJECTED: 'danger',
    WAITING: 'warning',
    OFFER_ACCEPTED: 'success',
    OFFER_REJECTED: 'danger',
    WITHDREW: 'secondary'
  };
  return colors[outcome] || 'secondary';
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate interview request data
 * @param {InterviewExperienceRequest} data
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateInterviewRequest = (data) => {
  const errors = {};

  // Title validation
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.length > 100) {
    errors.title = 'Title must not exceed 100 characters';
  }

  // Content validation
  if (!data.content || data.content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters';
  }

  // Company name validation
  if (!data.companyName || data.companyName.trim().length === 0) {
    errors.companyName = 'Company name is required';
  }

  // Role validation
  if (!data.role || data.role.trim().length === 0) {
    errors.role = 'Role is required';
  }

  // Interview type validation
  if (!Object.values(InterviewType).includes(data.interviewType)) {
    errors.interviewType = 'Invalid interview type';
  }

  // Experience level validation
  if (!Object.values(ExperienceLevel).includes(data.experienceLevel)) {
    errors.experienceLevel = 'Invalid experience level';
  }

  // Outcome validation
  if (!Object.values(InterviewOutcome).includes(data.outcome)) {
    errors.outcome = 'Invalid outcome';
  }

  // Number of rounds validation (optional)
  if (data.numberOfRounds !== null && data.numberOfRounds !== undefined) {
    const rounds = parseInt(data.numberOfRounds);
    if (isNaN(rounds) || rounds < 1 || rounds > 10) {
      errors.numberOfRounds = 'Number of rounds must be between 1 and 10';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// FORM OPTIONS FOR UI
// ============================================

/**
 * Get form options for dropdowns
 */
export const getFormOptions = () => ({
  interviewTypes: [
    { value: InterviewType.ON_CAMPUS, label: 'On Campus' },
    { value: InterviewType.OFF_CAMPUS, label: 'Off Campus' },
    { value: InterviewType.REFERRAL, label: 'Referral' },
    { value: InterviewType.WALK_IN, label: 'Walk-In' },
    { value: InterviewType.ONLINE, label: 'Online' },
    { value: InterviewType.RECRUITMENT_DRIVE, label: 'Recruitment Drive' }
  ],
  experienceLevels: [
    { value: ExperienceLevel.FRESHER, label: 'Fresher' },
    { value: ExperienceLevel.ENTRY_LEVEL, label: 'Entry Level' },
    { value: ExperienceLevel.MID_LEVEL, label: 'Mid Level' },
    { value: ExperienceLevel.SENIOR_LEVEL, label: 'Senior Level' },
    { value: ExperienceLevel.LEAD, label: 'Lead' },
    { value: ExperienceLevel.PRINCIPAL, label: 'Principal' }
  ],
  outcomes: [
    { value: InterviewOutcome.SELECTED, label: 'Selected' },
    { value: InterviewOutcome.REJECTED, label: 'Rejected' },
    { value: InterviewOutcome.WAITING, label: 'Waiting' },
    { value: InterviewOutcome.OFFER_ACCEPTED, label: 'Offer Accepted' },
    { value: InterviewOutcome.OFFER_REJECTED, label: 'Offer Rejected' },
    { value: InterviewOutcome.WITHDREW, label: 'Withdrew' }
  ]
});
