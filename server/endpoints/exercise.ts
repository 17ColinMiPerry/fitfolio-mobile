import { Exercise } from "../models/exercise.ts";
import { User } from "../models/user.ts";
import { authenticateUser } from "../middleware/auth.ts";
import type { Request, Response } from "express";

export const exerciseEndpoints = (app: any) => {
  // Get all exercises for a workout - requires authentication
  app.get("/api/exercises", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const workoutId = req.query.workoutId as string;
      if (!workoutId) {
        return res.status(400).json({ error: "Workout ID is required" });
      }

      // Ensure user exists in database
      await User.findOrCreate(userId);
      
      const exercises = await Exercise.getAll(workoutId, userId);
      res.json(exercises);
    } catch (error: any) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new exercise - requires authentication
  app.post("/api/exercises", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { workoutId, name } = req.body;
      if (!workoutId || !name) {
        return res
          .status(400)
          .json({ error: "Workout ID and name are required" });
      }

      // Ensure user exists in database
      await User.findOrCreate(userId);
      
      const exercise = await Exercise.create(workoutId, userId, name);
      res.json(exercise);
    } catch (error: any) {
      console.error("Error creating exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete an exercise - requires authentication
  app.delete("/api/exercises/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { id } = req.params;
      await Exercise.delete(id, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update an exercise - requires authentication
  app.put("/api/exercises/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { id } = req.params;
      const { name } = req.body;
      await Exercise.update(id, userId, name);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });
}; 