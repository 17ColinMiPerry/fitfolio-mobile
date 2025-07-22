import { Set } from "../models/set.ts";
import { User } from "../models/user.ts";
import { authenticateUser } from "../middleware/auth.ts";
import type { Request, Response } from "express";

export const setEndpoints = (app: any) => {
  // Create a new set - requires authentication
  app.post("/api/sets", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }

      const { exerciseId, reps, weight, notes } = req.body;
      if (!exerciseId || !reps || !weight) {
        return res.status(400).json({ error: "Exercise ID, reps, and weight are required" });
      }

      // Ensure user exists in database
      await User.findOrCreate(userId);
      
      const set = await Set.create(userId, exerciseId, reps, weight, notes);
      res.status(201).json(set);
    } catch (error: any) {
      console.error("Error creating set:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a set - requires authentication
  app.delete("/api/sets/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { id } = req.params;
      await Set.delete(id, userId);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting set:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a set - requires authentication
  app.put("/api/sets/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const { id } = req.params;
      const { reps, weight, notes } = req.body;
      if (!reps || !weight) {
        return res.status(400).json({ error: "Reps and weight are required" });
      }

      const set = await Set.update(id, userId, reps, weight, notes);
      res.json(set);
    } catch (error: any) {
      console.error("Error updating set:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all sets for a user - requires authentication
  app.get("/api/sets", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }

      // Ensure user exists in database
      await User.findOrCreate(userId);
      
      const sets = await Set.getAll(userId);
      res.json(sets);
    } catch (error: any) {
      console.error("Error getting sets:", error);
      res.status(500).json({ error: error.message });
    }
  });
};
