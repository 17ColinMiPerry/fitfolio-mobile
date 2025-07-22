import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Set {
    static async create(userId: string, exerciseId: string, reps: number, weight: number, notes?: string) {
        // First verify the exercise belongs to the user
        const exercise = await prisma.exercise.findFirst({
            where: {
                id: parseInt(exerciseId),
                workout: {
                    userId
                }
            },
        });

        if (!exercise) {
            throw new Error("Exercise not found or unauthorized");
        }

        return await prisma.set.create({
            data: {
                exerciseId: parseInt(exerciseId),
                reps,
                weight,
                notes,
            },
        });
    }

    static async delete(id: string, userId: string) {
        // First verify the set belongs to the user
        const set = await prisma.set.findFirst({
            where: {
                id: parseInt(id),
                exercise: {
                    workout: {
                        userId
                    }
                }
            },
        });

        if (!set) {
            throw new Error("Set not found or unauthorized");
        }

        return await prisma.set.delete({
            where: { id: parseInt(id) },
        });
    }

    static async update(id: string, userId: string, reps: number, weight: number, notes?: string) {
        // First verify the set belongs to the user
        const set = await prisma.set.findFirst({
            where: {
                id: parseInt(id),
                exercise: {
                    workout: {
                        userId
                    }
                }
            },
        });

        if (!set) {
            throw new Error("Set not found or unauthorized");
        }

        return await prisma.set.update({
            where: { id: parseInt(id) },
            data: {
                reps,
                weight,
                notes,
            },
        });
    }

    static async getAll(userId: string) {
        return await prisma.set.findMany({
            where: {
                exercise: {
                    workout: {
                        userId
                    }
                }
            },
            include: {
                exercise: {
                    include: {
                        workout: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
