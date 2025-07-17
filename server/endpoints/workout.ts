import { Workout } from "../models/workout.ts";
import { User } from "../models/user.ts";
import { authenticateUser } from "../middleware/auth.ts";
import type { Request, Response } from "express";

export const workoutEndpoints = (app: any) => {
  // Get all workouts for a user - requires authentication
  app.get("/api/workouts", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }

      // Ensure user exists in database
      await User.findOrCreate(userId);
      
      const workouts = await Workout.getAll(userId);
      res.json(workouts);
    } catch (error: any) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new workout - requires authentication
  app.post("/api/workouts", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Workout name is required" });
      }

      // Ensure user exists in database
      await User.findOrCreate(userId);
      
      const workout = await Workout.create(userId, name);
      res.json(workout);
    } catch (error: any) {
      console.error("Error creating workout:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a workout - requires authentication
  app.delete("/api/workouts/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { id } = req.params;
      await Workout.delete(id, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a workout - requires authentication
  app.put("/api/workouts/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { id } = req.params;
      const { name } = req.body;
      await Workout.update(id, userId, name);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating workout:", error);
      res.status(500).json({ error: error.message });
    }
  });
};
