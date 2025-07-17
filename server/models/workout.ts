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

    static async delete(id: string, userId: string) {
        // First verify the workout belongs to the user
        const workout = await prisma.workout.findFirst({
            where: {
                id: parseInt(id),
                userId,
            },
        });

        if (!workout) {
            throw new Error("Workout not found or unauthorized");
        }

        return await prisma.workout.delete({
            where: { id: parseInt(id) },
        });
    }

    static async update(id: string, userId: string, name: string) {
        // First verify the workout belongs to the user
        const workout = await prisma.workout.findFirst({
            where: {
                id: parseInt(id),
                userId,
            },
        });

        if (!workout) {
            throw new Error("Workout not found or unauthorized");
        }

        return await prisma.workout.update({
            where: { id: parseInt(id) },
            data: { name },
        });
    }
}
