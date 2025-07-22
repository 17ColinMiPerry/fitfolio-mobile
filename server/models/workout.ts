import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Workout {
    static async getAll(userId: string) {
        const workouts = await prisma.workout.findMany({
            where: { userId },
            include: {
                exercises: {
                    include: {
                        sets: {
                            orderBy: {
                                createdAt: "asc",
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        
        console.log('Workouts with exercises:', workouts);
        return workouts;
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

        // First delete all sets associated with exercises in this workout
        await prisma.set.deleteMany({
            where: {
                exercise: {
                    workoutId: parseInt(id)
                }
            }
        });

        // Then delete all exercises in this workout
        await prisma.exercise.deleteMany({
            where: {
                workoutId: parseInt(id)
            }
        });

        // Finally delete the workout
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
