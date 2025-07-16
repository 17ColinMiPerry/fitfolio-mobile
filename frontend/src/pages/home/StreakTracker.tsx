import { useState } from 'react';
import { View, Text } from 'react-native';

export default function StreakTracker() {
    const days = ["U", "M", "T", "W", "R", "F", "S"];
    const [currentDay, setCurrentDay] = useState(new Date().getDay());

    /* TODO: Mark days completed based on database information */
    /* TODO: Match colors to header, nav, body, etc. */

    return (
        <View className="flex-1 w-full">
            <View className="flex-1 bg-blue-400 w-full rounded-t-lg border-t-2 border-black/50 border-x-2 p-4">
                <Text className="text-2xl font-bold text-white text-center">Streak</Text>
            </View>
            <View className="flex-1 flex-col rounded-b-lg bg-blue-200 overflow-hidden border-b-2 border-black/50 border-x-2">
                <View className="flex flex-row w-full p-4 justify-between">
                    {Array.from({ length: 7 }, (_, i) => {
                        const day = days[(currentDay + i + 1) % 7];
                        return (
                            <View className="flex flex-col items-center gap-2">
                                <Text
                                    key={i}
                                    className="text-2xl font-bold text-white"
                                >
                                    {day}
                                </Text>
                                <View className="w-6 h-6 bg-white rounded-full"/>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>

    )
}