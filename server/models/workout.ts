import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Workout {
    static async getAll(userId: string) {
        return await prisma.workout.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }


    static async create(userId: string, name: string) {
        return await prisma.workout.create({
            data: {
                userId,
                name,
            },
        });
    }
}
