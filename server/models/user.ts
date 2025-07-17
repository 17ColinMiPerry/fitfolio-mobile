import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class User {
  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async create(id: string) {
    return await prisma.user.create({
      data: { id },
    });
  }

  static async findOrCreate(id: string) {
    // Try to find the user first
    let user = await this.findById(id);
    
    // If user doesn't exist, create them
    if (!user) {
      user = await this.create(id);
    }
    
    return user;
  }
} 