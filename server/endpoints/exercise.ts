import { Exercise } from "../models/exercise.ts";
import type { Request, Response } from "express";

export const exerciseEndpoints = (app: any) => {
  // Get all exercises for a workout
  app.get("/api/exercises", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const workoutId = req.query.workoutId as string;
      if (!workoutId) {
        return res.status(400).json({ error: "Workout ID is required" });
      }
      const exercises = await Exercise.getAll(workoutId, userId);
      res.json(exercises);
    } catch (error: any) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new exercise
  app.post("/api/exercises", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { workoutId, name } = req.body;
      if (!workoutId || !name) {
        return res
          .status(400)
          .json({ error: "Workout ID and name are required" });
      }
      const exercise = await Exercise.create(workoutId, userId, name);
      res.json(exercise);
    } catch (error: any) {
      console.error("Error creating exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete an exercise
  app.delete("/api/exercises/:id", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { id } = req.params;
      await Exercise.delete(id, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update an exercise
  app.put("/api/exercises/:id", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
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