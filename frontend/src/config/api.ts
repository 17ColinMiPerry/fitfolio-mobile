// API Configuration - Update this when your ngrok URL changes
export const API_CONFIG = {
  BASE_URL: 'https://a95ae3beccce.ngrok-free.app/api',
} as const;

// Helper function to get the full API URL for a specific endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 