/**
 * Portfolio Utility Functions
 * Handles portfolio URL generation, slug creation, and sharing functionality
 */

/**
 * Convert email to username slug for clean URLs
 * Examples:
 *   john.doe@example.com -> john-doe
 *   jane_smith@gmail.com -> jane-smith
 *   alice+work@company.io -> alice-work
 */
export const emailToSlug = (email) => {
  if (!email) return '';
  
  // Extract username part before @
  const username = email.split('@')[0];
  
  // Replace special characters with hyphens
  const slug = username
    .toLowerCase()
    .replace(/[._+]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return slug;
};

/**
 * Generate shareable portfolio URL
 * @param {string} email - User's email
 * @param {boolean} absolute - Return absolute URL with domain
 * @returns {string} Portfolio URL
 */
export const getPortfolioShareUrl = (email, absolute = true) => {
  if (!email) return '';
  
  const slug = emailToSlug(email);
  const path = `/portfolio/${encodeURIComponent(email)}`;
  
  if (absolute && typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  
  return path;
};

/**
 * Generate portfolio URL with custom slug
 * @param {string} username - Custom username/slug
 * @param {boolean} absolute - Return absolute URL with domain
 */
export const getPortfolioUrl = (username, absolute = false) => {
  if (!username) return '';
  
  const path = `/portfolio/${encodeURIComponent(username)}`;
  
  if (absolute && typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  
  return path;
};

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {

    return false;
  }
};

/**
 * Share portfolio using Web Share API with fallback
 * @param {Object} portfolioData - Portfolio data
 * @returns {Promise<{success: boolean, method: string}>}
 */
export const sharePortfolio = async (portfolioData) => {
  const url = getPortfolioShareUrl(portfolioData.emailId, true);
  const title = `${portfolioData.fullName}'s Portfolio`;
  const text = portfolioData.bio || `Check out ${portfolioData.fullName}'s professional portfolio`;
  
  // Try Web Share API (mobile & modern browsers)
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return { success: true, method: 'native' };
    } catch (error) {
      // User cancelled or error occurred
      if (error.name === 'AbortError') {
        return { success: false, method: 'native', cancelled: true };
      }

    }
  }
  
  // Fallback: Copy to clipboard
  const copied = await copyToClipboard(url);
  return { success: copied, method: 'clipboard' };
};

/**
 * Check if user is portfolio owner
 * @param {Object} portfolioData - Portfolio data
 * @param {Object} currentUser - Current authenticated user
 * @returns {boolean}
 */
export const isPortfolioOwner = (portfolioData, currentUser) => {
  if (!portfolioData || !currentUser) return false;
  
  return (
    portfolioData.emailId === currentUser.email ||
    portfolioData.id === currentUser.portfolioId
  );
};

/**
 * Get meta tags for portfolio sharing (SEO & Social)
 * @param {Object} portfolioData - Portfolio data
 * @returns {Object} Meta tags
 */
export const getPortfolioMetaTags = (portfolioData) => {
  if (!portfolioData) return {};
  
  const url = getPortfolioShareUrl(portfolioData.emailId, true);
  
  return {
    title: `${portfolioData.fullName} - Professional Portfolio | SwitchBoard`,
    description: portfolioData.bio || portfolioData.overview || `View ${portfolioData.fullName}'s professional portfolio showcasing skills, projects, and experience.`,
    image: portfolioData.profileImageUrl || '/logo512.png',
    url,
    // Open Graph tags
    'og:title': `${portfolioData.fullName} - Portfolio`,
    'og:description': portfolioData.bio || portfolioData.overview || '',
    'og:image': portfolioData.profileImageUrl || '/logo512.png',
    'og:url': url,
    'og:type': 'profile',
    // Twitter Card tags
    'twitter:card': 'summary_large_image',
    'twitter:title': `${portfolioData.fullName} - Portfolio`,
    'twitter:description': portfolioData.bio || portfolioData.overview || '',
    'twitter:image': portfolioData.profileImageUrl || '/logo512.png',
  };
};

/**
 * Validate if email/username is valid for portfolio access
 * @param {string} identifier - Email or username
 * @returns {boolean}
 */
export const isValidPortfolioIdentifier = (identifier) => {
  if (!identifier || typeof identifier !== 'string') return false;
  
  // Check if it's a valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(identifier)) return true;
  
  // Check if it's a valid username slug
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return slugRegex.test(identifier) && identifier.length >= 3;
};
