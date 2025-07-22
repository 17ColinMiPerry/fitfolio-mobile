import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Exercise {
  static async getAll(workoutId: string, userId: string) {
    // First verify the workout belongs to the user
    const workout = await prisma.workout.findFirst({
      where: {
        id: parseInt(workoutId),
        userId,
      },
    });

    if (!workout) {
      throw new Error("Workout not found or unauthorized");
    }

    return await prisma.exercise.findMany({
      where: { workoutId: parseInt(workoutId) },
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
    });
  }

  static async create(workoutId: string, userId: string, name: string) {
    console.log('Creating exercise:', { workoutId, userId, name });
    
    // First verify the workout belongs to the user
    const workout = await prisma.workout.findFirst({
      where: {
        id: parseInt(workoutId),
        userId,
      },
    });

    if (!workout) {
      throw new Error("Workout not found or unauthorized");
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        workoutId: parseInt(workoutId),
      },
    });
    
    console.log('Created exercise:', exercise);
    return exercise;
  }

  static async delete(id: string, userId: string) {
    console.log('Deleting exercise:', { id, userId });
    
    // First verify the exercise belongs to a workout owned by the user
    const exercise = await prisma.exercise.findFirst({
      where: { id: parseInt(id) },
      include: { workout: true },
    });

    console.log('Found exercise:', exercise);

    if (!exercise || exercise.workout.userId !== userId) {
      throw new Error("Exercise not found or unauthorized");
    }

    // First delete all associated sets
    console.log('Deleting associated sets...');
    await prisma.set.deleteMany({
      where: { exerciseId: parseInt(id) },
    });

    // Then delete the exercise
    console.log('Deleting exercise...');
    const deletedExercise = await prisma.exercise.delete({
      where: { id: parseInt(id) },
    });
    
    console.log('Deleted exercise:', deletedExercise);
    return deletedExercise;
  }

  static async update(id: string, userId: string, name: string) {
    // First verify the exercise belongs to a workout owned by the user
    const exercise = await prisma.exercise.findFirst({
      where: { id: parseInt(id) },
      include: { workout: true },
    });

    if (!exercise || exercise.workout.userId !== userId) {
      throw new Error("Exercise not found or unauthorized");
    }

    return await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { name },
    });
  }
} 