import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// Export the context for direct use
export { AuthContext };

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();

    // Set up auth failure callback
    authService.setAuthFailureCallback((reason) => {

      setIsAuthenticated(false);
      setUser(null);
      // You can add additional logic here like showing a login modal
    });
  }, []);

  const checkAuthStatus = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userInfo = authService.getUserInfo();
      setUser(userInfo);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = (tokenData) => {
    if (tokenData.accessToken) {
      authService.setTokens({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresIn: tokenData.expiresIn || 3600
      });
    }
    checkAuthStatus();
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    return <Component {...props} />;
  };
};