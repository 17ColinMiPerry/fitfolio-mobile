// Frontend Exercise model for communicating with the backend API
import { API_CONFIG } from '../config/api';

export interface Exercise {
  id: number;
  name: string;
  workoutId: number;
  createdAt: string;
  updatedAt: string;
  sets?: Set[];
}

export interface Set {
  id: number;
  reps: number;
  weight: number;
  notes?: string;
  exerciseId: number;
  createdAt: string;
  updatedAt: string;
}

export class ExerciseModel {
  static async getAll(token: string, workoutId: string): Promise<Exercise[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/exercises?workoutId=${workoutId}`,
        {
          method: 'GET',
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

      return await response.json();
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  static async create(token: string, workoutId: string, name: string): Promise<Exercise> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          workoutId,
          name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  }

  static async delete(token: string, exerciseId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/exercises/${exerciseId}`,
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
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }

  static async update(token: string, exerciseId: string, name: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/exercises/${exerciseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  }
} 