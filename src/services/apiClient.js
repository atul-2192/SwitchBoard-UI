/**
 * API Client with automatic token refresh and error handling
 * Production-ready configuration for all API requests
 */
import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://switchboardpro.in/api/v1';

// Create axios instance with production-ready configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  validateStatus: (status) => {
    // Consider 2xx and 3xx as success, handle 4xx and 5xx as errors
    return status >= 200 && status < 400;
  }
});

// Request interceptor to add auth header
apiClient.interceptors.request.use(
  async (config) => {
    // Check if this request should skip authentication
    if (config.skipAuth === true) {
      return config;
    }
    
    // Skip auth for certain endpoints
    const publicEndpoints = ['/auth/send-otp', '/auth/verify-otp', '/auth/account/create', '/auth/refresh-token', '/auth/refresh', '/auth/google/login'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (!isPublicEndpoint) {
      try {
        const token = await authService.getValidToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Don't block the request, let it proceed without token
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If response is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await authService.refreshAccessToken();
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        authService.handleAuthFailure('Token refresh failed');
        authService.logout();
        
        // Optionally redirect to login page
        window.location.href = '/';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;