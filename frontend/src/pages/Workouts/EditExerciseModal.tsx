import { useState, useEffect } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from "react-native"
import { BlurView } from "expo-blur"
import { useAuth } from "@clerk/clerk-expo"

import { ExerciseModel, Exercise } from "../../models/Exercise"

interface EditExerciseModalProps {
    show: boolean
    onClose: () => void
    exercise: Exercise | null
    onExerciseUpdated: (exercise: Exercise) => void
}

export default function EditExerciseModal({ show, onClose, exercise, onExerciseUpdated }: EditExerciseModalProps) {
    const { getToken } = useAuth()
    const [exerciseName, setExerciseName] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (exercise) {
            setExerciseName(exercise.name)
        }
    }, [exercise])

    const handleUpdateExercise = async () => {
        if (!exercise || !exerciseName.trim()) return

        setIsUpdating(true)
        try {
            const token = await getToken()
            if (token) {
                await ExerciseModel.update(token, exercise.id.toString(), exerciseName.trim())
                const updatedExercise = { ...exercise, name: exerciseName.trim() }
                onExerciseUpdated(updatedExercise)
                onClose()
            }
        } catch (error: any) {
            console.error('Error updating exercise:', error)
            const errorMessage = error.message || 'Failed to update exercise'
            Alert.alert('Error', errorMessage)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleClose = () => {
        if (exercise) {
            setExerciseName(exercise.name)
        }
        onClose()
    }

    if (!exercise) return null

    return (
        <Modal visible={show} onRequestClose={handleClose} transparent={true}>
            <BlurView intensity={50} className="flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg p-6 w-full border border-black shadow-lg">
                    <Text className="text-2xl font-bold text-center mb-4">Edit Exercise</Text>
                    
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
                            disabled={isUpdating}
                        >
                            <Text className="text-white text-center font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleUpdateExercise} 
                            className="flex-1 bg-blue-500 p-3 rounded-lg"
                            disabled={!exerciseName.trim() || isUpdating}
                        >
                            <Text className="text-white text-center font-semibold">
                                {isUpdating ? "Updating..." : "Update"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
} 