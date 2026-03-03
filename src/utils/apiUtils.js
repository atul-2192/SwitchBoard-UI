/**
 * API Utilities for Error Handling and Response Processing
 * Production-ready error handling and response utilities
 */

import { ErrorCode } from '../types/workspaceTypes';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, errorCode, statusCode, data = null) {
    super(message);
    this.name = 'ApiError';
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Handle API errors and convert to ApiError instances
 * @param {Error} error - The error object
 * @returns {ApiError} - Standardized API error
 */
export const handleApiError = (error) => {
  // Check if it's already an ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Axios errors
  if (error.response) {
    const { status, data } = error.response;
    
    // If backend returns ApiResponse error format
    if (data && data.errorCode) {
      return new ApiError(
        data.message || 'An error occurred',
        data.errorCode,
        status,
        data.data
      );
    }

    // Map HTTP status codes to error codes
    const errorCodeMap = {
      400: ErrorCode.BAD_REQUEST,
      401: ErrorCode.UNAUTHORIZED,
      404: ErrorCode.RESOURCE_NOT_FOUND,
      500: ErrorCode.INTERNAL_SERVER_ERROR,
    };

    const errorCode = errorCodeMap[status] || ErrorCode.UNEXPECTED_ERROR;
    const message = data?.message || error.message || `Request failed with status ${status}`;

    return new ApiError(message, errorCode, status, data);
  }

  // Handle network errors
  if (error.request) {
    return new ApiError(
      'Network error: Unable to reach the server',
      ErrorCode.UNEXPECTED_ERROR,
      0
    );
  }

  // Handle other errors
  return new ApiError(
    error.message || 'An unexpected error occurred',
    ErrorCode.UNEXPECTED_ERROR,
    0
  );
};

/**
 * Get user-friendly error message based on error code
 * @param {string} errorCode - Error code
 * @returns {string} - User-friendly message
 */
export const getUserFriendlyErrorMessage = (errorCode) => {
  const messages = {
    [ErrorCode.RESOURCE_NOT_FOUND]: 'The requested resource was not found.',
    [ErrorCode.BAD_REQUEST]: 'Invalid request. Please check your input.',
    [ErrorCode.UNAUTHORIZED]: 'You are not authorized to perform this action.',
    [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ErrorCode.UNEXPECTED_ERROR]: 'An unexpected error occurred. Please try again.',
    [ErrorCode.INTERNAL_SERVER_ERROR]: 'Server error. Please try again later.',
  };

  return messages[errorCode] || 'An error occurred. Please try again.';
};

/**
 * Check if API response is successful
 * @param {Object} response - API response
 * @returns {boolean} - Whether response is successful
 */
export const isSuccessResponse = (response) => {
  return response && response.success === true;
};

/**
 * Extract data from API response
 * @param {Object} response - API response
 * @returns {*} - Response data
 */
export const extractResponseData = (response) => {
  // If response has ApiResponse format
  if (response && typeof response === 'object' && 'success' in response) {
    return response.data;
  }
  
  // Otherwise return the response itself (direct entity response)
  return response;
};

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} - Whether UUID is valid
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Build query string from parameters
 * @param {Object} params - Query parameters
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else {
        queryParams.append(key, value);
      }
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Retry a promise with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} - Promise result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      if (i < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format ISO date string to locale string
 * @param {string} isoDate - ISO 8601 date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (isoDate, options = {}) => {
  if (!isoDate) return '';
  
  try {
    const date = new Date(isoDate);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    return date.toLocaleString(undefined, defaultOptions);
  } catch (error) {

    return isoDate;
  }
};

/**
 * Calculate completion percentage
 * @param {number} completed - Number of completed items
 * @param {number} total - Total number of items
 * @returns {number} - Percentage (0-100)
 */
export const calculatePercentage = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Safe JSON parse
 * @param {string} json - JSON string
 * @param {*} fallback - Fallback value
 * @returns {*} - Parsed object or fallback
 */
export const safeJsonParse = (json, fallback = null) => {
  try {
    return JSON.parse(json);
  } catch (error) {

    return fallback;
  }
};

/**
 * Get user ID from context (localStorage or other source)
 * @returns {string|null} - User UUID
 */
export const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id || userData.userId || null;
    }
    return null;
  } catch (error) {

    return null;
  }
};

/**
 * Create headers with user ID
 * @param {string} userId - User UUID (optional, auto-fetched if not provided)
 * @returns {Object} - Headers object
 */
export const createUserHeaders = (userId = null) => {
  const userIdToUse = userId || getCurrentUserId();
  
  if (!userIdToUse) {

    return {};
  }

  return {
    'X-User-Id': userIdToUse
  };
};

/**
 * Log API request (for debugging)
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} data - Request data
 */
export const logApiRequest = (method, url, data = null) => {
  if (process.env.REACT_APP_DEBUG_MODE === 'true') {
    // Debug logging disabled for production
  }
};

/**
 * Log API response (for debugging)
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} response - Response data
 */
export const logApiResponse = (method, url, response) => {
  if (process.env.REACT_APP_DEBUG_MODE === 'true') {
    // Debug logging disabled for production
  }
};

/**
 * Log API error (for debugging)
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Error} error - Error object
 */
export const logApiError = (method, url, error) => {
  if (process.env.REACT_APP_DEBUG_MODE === 'true') {
    // Debug logging disabled for production
  }
};

export default {
  ApiError,
  handleApiError,
  getUserFriendlyErrorMessage,
  isSuccessResponse,
  extractResponseData,
  isValidUUID,
  buildQueryString,
  retryWithBackoff,
  debounce,
  formatDate,
  calculatePercentage,
  safeJsonParse,
  getCurrentUserId,
  createUserHeaders,
  logApiRequest,
  logApiResponse,
  logApiError
};
