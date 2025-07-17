// Frontend User model for communicating with the backend API
import { API_CONFIG } from '../config/api';

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class UserModel {
  static async findOrCreate(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/find-or-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error finding or creating user:', error);
      throw error;
    }
  }

  static async getMe(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
} 