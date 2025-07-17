import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { AUTH_CONFIG } from '../config/auth.ts';

// Extend the Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if JWT key is configured
    if (!AUTH_CONFIG.JWT_KEY) {
      console.error('CLERK_JWT_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server authentication not configured' });
    }

    // Get the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Clerk
    const payload = await verifyToken(token, {
      jwtKey: AUTH_CONFIG.JWT_KEY,
      authorizedParties: AUTH_CONFIG.AUTHORIZED_PARTIES,
    });

    // Extract user ID from the token payload
    const userId = payload.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token: no user ID found' });
    }

    // Add the user ID to the request object
    req.userId = userId;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}; 