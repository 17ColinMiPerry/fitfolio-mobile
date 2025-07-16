// Frontend Exercise model for communicating with the backend API

const API_BASE_URL = 'https://f04e57ddfaad.ngrok-free.app/api';

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
  static async getAll(workoutId: string, userId: string): Promise<Exercise[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/exercises?workoutId=${workoutId}&userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  static async create(workoutId: string, userId: string, name: string): Promise<Exercise> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutId,
          userId,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  }

  static async update(id: string, userId: string, name: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  }

  static async delete(id: string, userId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/exercises/${id}?userId=${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }
} 