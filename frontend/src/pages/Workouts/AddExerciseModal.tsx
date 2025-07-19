import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from "react-native"
import { BlurView } from "expo-blur"
import { useAuth } from "@clerk/clerk-expo"

import { ExerciseModel, Exercise } from "../../models/Exercise"

interface AddExerciseModalProps {
    show: boolean
    onClose: () => void
    workoutId: number
    onExerciseCreated: (exercise: Exercise) => void
}

export default function AddExerciseModal({ show, onClose, workoutId, onExerciseCreated }: AddExerciseModalProps) {
    const { getToken } = useAuth()
    const [exerciseName, setExerciseName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateExercise = async () => {
        if (!exerciseName.trim()) return

        setIsCreating(true)
        try {
            const token = await getToken()
            if (token) {
                const newExercise = await ExerciseModel.create(token, workoutId.toString(), exerciseName.trim())
                onExerciseCreated(newExercise)
                setExerciseName("")
            }
        } catch (error: any) {
            console.error('Error creating exercise:', error)
            // Try to get the error message from the response
            let errorMessage = 'Failed to create exercise'
            if (error.message) {
                errorMessage = error.message
            }
            Alert.alert('Error', errorMessage)
        } finally {
            setIsCreating(false)
        }
    }

    const handleClose = () => {
        setExerciseName("")
        onClose()
    }

    return (
        <Modal visible={show} onRequestClose={handleClose} transparent={true}>
            <BlurView intensity={50} className="flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg p-6 w-full border border-black shadow-lg">
                    <Text className="text-2xl font-bold text-center mb-4">Add New Exercise</Text>
                    
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 mb-4 text-lg"
                        placeholder="Enter exercise name..."
                        value={exerciseName}
                        onChangeText={setExerciseName}
                        autoFocus
                    />
                    
                    <View className="flex-row gap-3">
                        <TouchableOpacity 
                            onPress={handleClose} 
                            className="flex-1 bg-gray-500 p-3 rounded-lg"
                            disabled={isCreating}
                        >
                            <Text className="text-white text-center font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleCreateExercise} 
                            className="flex-1 bg-blue-500 p-3 rounded-lg"
                            disabled={!exerciseName.trim() || isCreating}
                        >
                            <Text className="text-white text-center font-semibold">
                                {isCreating ? "Creating..." : "Create"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
} 