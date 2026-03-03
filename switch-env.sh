#!/bin/bash
# Quick Environment Switcher for SwitchBoard UI
# Usage: ./switch-env.sh [local|prod]

ENV_TYPE=$1

if [ -z "$ENV_TYPE" ]; then
  echo "Usage: ./switch-env.sh [local|prod]"
  echo ""
  echo "Examples:"
  echo "  ./switch-env.sh local    # Switch to localhost APIs"
  echo "  ./switch-env.sh prod     # Switch to production APIs"
  exit 1
fi

case $ENV_TYPE in
  local)
    echo "🔧 Switching to LOCAL environment..."
    cat > .env.local << 'EOF'
# Local Development Configuration
# This file is used when running: npm start
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_USE_MOCK=false
REACT_APP_JWT_TOKEN_KEY=authToken

# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=932645065631-tts3uj2pk4o7dgepgbhamkvolroiim2t.apps.googleusercontent.com

# Development
REACT_APP_DEBUG_MODE=true
REACT_APP_ENV=local
EOF
    echo "✅ Environment set to LOCAL (http://localhost:8080/api/v1)"
    echo ""
    echo "Next steps:"
    echo "  1. Make sure your local backend is running on port 8080"
    echo "  2. Run: npm start"
    ;;
    
  prod)
    echo "🚀 Switching to PRODUCTION environment..."
    cat > .env.local << 'EOF'
# Production Testing Configuration
# This file is used when running: npm start
REACT_APP_API_URL=https://switchboardpro.in/api/v1
REACT_APP_USE_MOCK=false
REACT_APP_JWT_TOKEN_KEY=authToken

# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=932645065631-tts3uj2pk4o7dgepgbhamkvolroiim2t.apps.googleusercontent.com

# Development
REACT_APP_DEBUG_MODE=true
REACT_APP_ENV=production
EOF
    echo "✅ Environment set to PRODUCTION (https://switchboardpro.in/api/v1)"
    echo ""
    echo "Next steps:"
    echo "  1. Run: npm start"
    echo "  2. App will connect to production APIs"
    ;;
    
  *)
    echo "❌ Invalid environment type: $ENV_TYPE"
    echo "Use 'local' or 'prod'"
    exit 1
    ;;
esac

echo ""
echo "⚠️  Remember: You need to restart the development server if it's already running!"
