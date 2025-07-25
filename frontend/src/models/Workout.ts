// Frontend Workout model for communicating with the backend API
import { API_CONFIG } from '../config/api';

export interface Workout {
  id: number;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  exercises?: Exercise[];
}

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

export class WorkoutModel {
  static async getAll(token: string): Promise<Workout[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/workouts`, {
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
      console.error('Error fetching workouts:', error);
      throw error;
    }
  }

  static async create(token: string, name: string): Promise<Workout> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  }

  static async delete(token: string, workoutId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/workouts/${workoutId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }

  static async update(token: string, workoutId: string, name: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/workouts/${workoutId}`, {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  }
} 