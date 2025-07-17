import { User } from "../models/user.ts";
import { authenticateUser } from "../middleware/auth.ts";
import type { Request, Response } from "express";

export const userEndpoints = (app: any) => {
  // Find or create a user (called on sign-in) - now requires authentication
  app.post("/api/users/find-or-create", authenticateUser, async (req: Request, res: Response) => {
    try {
      // Get userId from the authenticated token instead of request body
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const user = await User.findOrCreate(userId);
      res.json(user);
    } catch (error: any) {
      console.error("Error finding or creating user:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user by ID - requires authentication and can only get own user data
  app.get("/api/users/me", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
      }
      
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Remove the old endpoint that allowed getting any user by ID
  // app.get("/api/users/:id", ...) - This is now removed for security
}; 