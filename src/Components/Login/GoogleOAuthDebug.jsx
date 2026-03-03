import React, { useState } from 'react';

/**
 * Google OAuth Debug Panel
 * Add this component to your Login page to debug Google OAuth flow
 * 
 * Usage in Login.jsx:
 * import GoogleOAuthDebug from './GoogleOAuthDebug';
 * 
 * Then add in render: <GoogleOAuthDebug />
 */

const GoogleOAuthDebug = () => {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const checkConfiguration = () => {
    addLog('=== Checking Configuration ===', 'header');
    
    // Check Google Client ID
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID') {
      addLog(`✅ Google Client ID configured: ${clientId.substring(0, 20)}...`, 'success');
    } else {
      addLog('❌ Google Client ID NOT configured or still placeholder', 'error');
    }

    // Check Backend URL
    const backendUrl = process.env.REACT_APP_API_URL;
    if (backendUrl) {
      addLog(`✅ Backend URL: ${backendUrl}`, 'success');
    } else {
      addLog('❌ Backend URL not configured', 'error');
    }

    // Check localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken) {
      addLog(`✅ Access Token found in localStorage (${accessToken.length} chars)`, 'success');
    } else {
      addLog('ℹ️ No access token in localStorage (not logged in)', 'info');
    }

    if (refreshToken) {
      addLog(`✅ Refresh Token found in localStorage`, 'success');
    } else {
      addLog('ℹ️ No refresh token in localStorage', 'info');
    }
  };

  const testBackendConnection = async () => {
    addLog('=== Testing Backend Connection ===', 'header');
    const backendUrl = process.env.REACT_APP_API_URL || 'https://switchboardpro.in/api/v1';
    const endpoint = `${backendUrl}/auth/google/login`;
    
    addLog(`Testing: ${endpoint}`, 'info');
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: 'test-token' })
      });
      
      addLog(`Response Status: ${response.status}`, response.ok ? 'success' : 'warning');
      
      if (response.status === 404) {
        addLog('❌ Endpoint not found - Backend may not be implemented', 'error');
      } else if (response.status === 401 || response.status === 400) {
        addLog('⚠️ Endpoint exists but rejected test token (expected)', 'warning');
      } else if (response.ok) {
        addLog('✅ Endpoint is working!', 'success');
      }
      
      const text = await response.text();
      if (text) {
        addLog(`Response: ${text.substring(0, 100)}`, 'info');
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        addLog('❌ Cannot connect to backend - Is it running?', 'error');
      } else {
        addLog(`❌ Error: ${error.message}`, 'error');
      }
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    addLog('✅ Cleared all tokens from localStorage', 'success');
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'header': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        🔧 Debug Google OAuth
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '450px',
      maxHeight: '600px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      fontSize: '12px',
    }}>
      {/* Header */}
      <div style={{
        padding: '15px',
        background: '#1f2937',
        color: 'white',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <strong>🔧 Google OAuth Debug Panel</strong>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ×
        </button>
      </div>

      {/* Controls */}
      <div style={{
        padding: '12px',
        background: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        <button onClick={checkConfiguration} style={buttonStyle}>
          Check Config
        </button>
        <button onClick={testBackendConnection} style={buttonStyle}>
          Test Backend
        </button>
        <button onClick={clearLocalStorage} style={{...buttonStyle, background: '#ef4444'}}>
          Clear Tokens
        </button>
        <button onClick={() => setLogs([])} style={buttonStyle}>
          Clear Logs
        </button>
      </div>

      {/* Logs */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        background: '#000',
        color: '#fff',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
            Click buttons above to start debugging
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ 
              marginBottom: '6px',
              padding: '4px 0',
              borderBottom: log.type === 'header' ? '1px solid #374151' : 'none',
            }}>
              <span style={{ color: '#6b7280', marginRight: '8px' }}>
                [{log.timestamp}]
              </span>
              <span style={{ color: getLogColor(log.type) }}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: '10px',
        background: '#fef3c7',
        color: '#92400e',
        fontSize: '11px',
        borderTop: '1px solid #fde68a',
      }}>
        💡 Open browser DevTools Console for more details
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '6px 12px',
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: '600',
};

export default GoogleOAuthDebug;
