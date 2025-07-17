// Authentication Configuration
// 
// Required Environment Variables:
// 
// CLERK_JWT_KEY - Get this from your Clerk Dashboard
//   1. Go to your Clerk Dashboard
//   2. Navigate to JWT Templates
//   3. Copy the signing key
//   4. Set it as an environment variable: CLERK_JWT_KEY=your_key_here
//
// Example .env file:
// CLERK_JWT_KEY=your_clerk_jwt_key_here
// DATABASE_URL=your_database_url_here
// DIRECT_URL=your_direct_database_url_here

export const AUTH_CONFIG = {
  // This will be read from process.env.CLERK_JWT_KEY
  JWT_KEY: process.env.CLERK_JWT_KEY,
  
  // Your ngrok URL for authorized parties
  AUTHORIZED_PARTIES: ['https://de01c4de059c.ngrok-free.app'],
}; 