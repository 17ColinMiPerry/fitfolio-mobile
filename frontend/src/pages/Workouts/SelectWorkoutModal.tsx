import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native"
import { BlurView } from "expo-blur"
import { useAuth } from "@clerk/clerk-expo"

import { WorkoutModel, Workout } from "../../models/Workout"

interface SelectWorkoutModalProps {
    show: boolean
    onClose: () => void
    workouts: Workout[]
    onSelectWorkout: (workout: Workout) => void
    onWorkoutCreated: (workout: Workout) => void
}

export default function SelectWorkoutModal({ show, onClose, workouts, onSelectWorkout, onWorkoutCreated }: SelectWorkoutModalProps) {
    const { getToken } = useAuth()
    const [newWorkoutName, setNewWorkoutName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateWorkout = async () => {
        if (!newWorkoutName.trim()) return

        setIsCreating(true)
        try {
            const token = await getToken()
            if (token) {
                const newWorkout = await WorkoutModel.create(token, newWorkoutName.trim())
                onWorkoutCreated(newWorkout)
                setNewWorkoutName("")
            }
        } catch (error: any) {
            console.error('Error creating workout:', error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteWorkout = async (workoutId: number) => {
        try {
            const token = await getToken()
            if (token) {
                await WorkoutModel.delete(token, workoutId.toString())
                // Refresh the workouts list by calling onWorkoutCreated with empty array
                // This will trigger a re-fetch in the parent component
                onWorkoutCreated({} as Workout)
            }
        } catch (error) {
            console.error('Error deleting workout:', error)
        }
    }

    return (
        <Modal visible={show} onRequestClose={onClose} transparent={true}>
            <BlurView intensity={50} className="flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg p-6 w-full border border-black shadow-lg max-h-[80%]">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-2xl font-bold">Select a Workout</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-2xl font-bold text-gray-500">×</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Create New Workout Section */}
                    <View className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <Text className="text-lg font-semibold mb-2">Create New Workout</Text>
                        <View className="flex-row gap-2">
                            <TextInput
                                className="flex-1 border border-gray-300 rounded-lg p-3 text-lg"
                                placeholder="New Workout Name"
                                value={newWorkoutName}
                                onChangeText={setNewWorkoutName}
                            />
                            <TouchableOpacity 
                                onPress={handleCreateWorkout}
                                className="bg-blue-500 px-4 py-3 rounded-lg"
                                disabled={!newWorkoutName.trim() || isCreating}
                            >
                                <Text className="text-white font-semibold">
                                    {isCreating ? "Creating..." : "Create"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Existing Workouts Section */}
                    <Text className="text-lg font-semibold mb-3">Existing Workouts</Text>
                    {workouts.length > 0 ? (
                        workouts.map((workout) => (
                            <View key={workout.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center flex-1">
                                        {/* Action Icons */}
                                        <View className="flex-row gap-2 mr-3">
                                            <TouchableOpacity onPress={() => console.log("Edit workout:", workout.id)}>
                                                <Text className="text-blue-500 text-lg">✏️</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDeleteWorkout(workout.id)}>
                                                <Text className="text-red-500 text-lg">🗑️</Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                        {/* Workout Info */}
                                        <View className="flex-1">
                                            <Text className="text-lg font-semibold">{workout.name}</Text>
                                            <Text className="text-sm text-gray-500">
                                                Created {new Date(workout.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    {/* Select Button */}
                                    <TouchableOpacity 
                                        onPress={() => {
                                            onSelectWorkout(workout)
                                            onClose()
                                        }}
                                        className="bg-blue-500 px-4 py-2 rounded-lg"
                                    >
                                        <Text className="text-white font-semibold">Select →</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text className="text-center text-gray-500 py-4">No workouts found</Text>
                    )}
                </View>
            </BlurView>
        </Modal>
    )
}