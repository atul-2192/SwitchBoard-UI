// Authentication Service
// Handles JWT token management and authentication state

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://switchboardpro.in/api/v1';

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.onAuthFailure = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  /**
   * Set the authentication failure callback
   * This will be called when token is expired or invalid
   */
  setAuthFailureCallback(callback) {
    this.onAuthFailure = callback;
  }

  /**
   * Store authentication tokens from login response
   */
  setTokens(tokenResponse) {
    const { accessToken, refreshToken, expiresIn } = tokenResponse;
    
    // Calculate expiry time
    const expiryTime = Date.now() + (expiresIn * 1000); // expiresIn is in seconds
    
    // Store tokens
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    // Update instance variables
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = expiryTime;
  }

  /**
   * Store JWT token in localStorage (backward compatibility)
   */
  setToken(token) {
    if (typeof token === 'string') {
      // Legacy support - just access token
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      this.accessToken = token;
    } else {
      // New token structure
      this.setTokens(token);
    }
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return this.accessToken;
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken() {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return this.refreshToken;
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry() {
    if (!this.tokenExpiry) {
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      this.tokenExpiry = expiry ? parseInt(expiry) : null;
    }
    return this.tokenExpiry;
  }

  /**
   * Get JWT token from localStorage (backward compatibility)
   */
  getToken() {
    return this.getAccessToken();
  }

  /**
   * Check if access token is expired
   */
  isTokenExpired() {
    const expiry = this.getTokenExpiry();
    if (!expiry) return false;
    
    // Check if token expires in the next 5 minutes (300 seconds buffer)
    return Date.now() >= (expiry - 300000);
  }

  /**
   * Check if user has a valid token
   */
  isAuthenticated() {
    const accessToken = this.getAccessToken();
    return !!accessToken && !this.isTokenExpired();
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this._performTokenRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh API call
   */
  async _performTokenRefresh(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const tokenData = await response.json();
      
      // Store new tokens
      this.setTokens(tokenData);
      
      return tokenData.accessToken;
    } catch (error) {

      this.handleAuthFailure('Token refresh failed');
      throw error;
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidToken() {
    const currentToken = this.getAccessToken();
    
    if (!currentToken) {
      throw new Error('No access token available');
    }

    if (this.isTokenExpired()) {
      return await this.refreshAccessToken();
    }

    return currentToken;
  }

  /**
   * Clear token and authentication state
   */
  clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Logout user
   */
  logout() {
    this.clearToken();
    // Don't auto-redirect, let the calling component handle it
  }

  /**
   * Handle authentication failure
   */
  handleAuthFailure(reason = 'Authentication failed') {
    // Don't auto-clear token or redirect, just trigger callback
    // Let the user manually log out if needed
    
    if (this.onAuthFailure) {
      this.onAuthFailure(reason);
    }
    // Remove automatic logout behavior
  }

  /**
   * Get authorization header for API requests with auto-refresh
   */
  async getAuthHeader() {
    try {
      const token = await this.getValidToken();
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    } catch (error) {

      return {};
    }
  }

  /**
   * Get authorization header for API requests (sync version for backward compatibility)
   */
  getAuthHeaderSync() {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Get user information from stored token
   */
  getUserInfo() {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      // Decode JWT payload (this is just base64 decode, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId,
        username: payload.username,
        email: payload.sub,
        role: payload.role
      };
    } catch (error) {

      return null;
    }
  }

  /**
   * Handle Google Login
   * @param {string} idToken - The Google ID token from Google Sign-In
   * @returns {Promise} - Returns the authentication response
   */
  async googleLogin(idToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google login failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Store tokens
      this.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn || 3600 // Default to 1 hour if not provided
      });
      
      return data;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @returns {Promise<string>} - Returns new access token
   */
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Store new tokens
      this.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn || 3600
      });
      
      return data.accessToken;
    } catch (error) {

      this.handleAuthFailure('Token refresh failed');
      throw error;
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();

// Export class for testing or custom instances
export { AuthService };