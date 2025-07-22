import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { WorkoutModel, Workout } from '../../models/Workout';

export default function StreakTracker() {
    const days = ["U", "M", "T", "W", "R", "F", "S"];
    const [currentDay, setCurrentDay] = useState(new Date().getDay());
    const [workoutDays, setWorkoutDays] = useState<boolean[]>(Array(7).fill(false));
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = await getToken();
                if (!token) return;
                const workouts: Workout[] = await WorkoutModel.getAll(token);
                // Get the dates of the past 7 days (including today)
                const today = new Date();
                const last7 = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(today);
                    d.setDate(today.getDate() - (6 - i));
                    d.setHours(0, 0, 0, 0);
                    return d.getTime();
                });
                // Mark which days had a workout
                const daysWithWorkout = last7.map(dayTime =>
                    workouts.some(w => {
                        const workoutDate = new Date(w.createdAt);
                        workoutDate.setHours(0, 0, 0, 0);
                        return workoutDate.getTime() === dayTime;
                    })
                );
                setWorkoutDays(daysWithWorkout);
            } catch (err) {
                // handle error
            }
        };
        fetchWorkouts();
    }, [getToken]);

    return (
        <View className="flex-1 w-full">
            <View className="flex-1 bg-blue-400 w-full rounded-t-lg border-t-2 border-black/50 border-x-2 p-4">
                <Text className="text-2xl font-bold text-white text-center">Streak</Text>
            </View>
            <View className="flex-1 flex-col rounded-b-lg bg-blue-200 overflow-hidden border-b-2 border-black/50 border-x-2">
                <View className="flex flex-row w-full p-4 justify-between">
                    {Array.from({ length: 7 }, (_, i) => {
                        // Show the last 7 days, left is oldest, right is today
                        const dayIdx = (new Date().getDay() + i - 6 + 7) % 7;
                        const dayLabel = days[dayIdx];
                        const isWorkout = workoutDays[i];
                        return (
                            <View className="flex flex-col items-center gap-2" key={i}>
                                <Text className="text-2xl font-bold text-white">
                                    {dayLabel}
                                </Text>
                                <View className={`w-6 h-6 rounded-full ${isWorkout ? 'bg-green-500' : 'bg-white'}`}/>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    )
}