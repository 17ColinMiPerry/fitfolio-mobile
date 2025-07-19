// Frontend Set model for communicating with the backend API
import { API_CONFIG } from '../config/api';

export interface Set {
  id: number;
  reps: number;
  weight: number;
  notes?: string;
  exerciseId: number;
  createdAt: string;
  updatedAt: string;
}

export class SetModel {
  static async create(token: string, exerciseId: string, reps: number, weight: number, notes?: string): Promise<Set> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/sets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          exerciseId,
          reps,
          weight,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating set:', error);
      throw error;
    }
  }

  static async delete(token: string, setId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/sets/${setId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting set:', error);
      throw error;
    }
  }

  static async update(token: string, setId: string, reps: number, weight: number, notes?: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/sets/${setId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reps,
          weight,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating set:', error);
      throw error;
    }
  }
} 