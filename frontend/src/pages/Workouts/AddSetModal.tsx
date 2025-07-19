import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from "react-native"
import { BlurView } from "expo-blur"
import { useAuth } from "@clerk/clerk-expo"

import { SetModel, Set } from "../../models/Set"

interface AddSetModalProps {
    show: boolean
    onClose: () => void
    exerciseId: number
    exerciseName: string
    onSetCreated: (set: Set) => void
}

export default function AddSetModal({ show, onClose, exerciseId, exerciseName, onSetCreated }: AddSetModalProps) {
    const { getToken } = useAuth()
    const [reps, setReps] = useState("")
    const [weight, setWeight] = useState("")
    const [notes, setNotes] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateSet = async () => {
        if (!reps.trim() || !weight.trim()) {
            Alert.alert('Error', 'Reps and weight are required')
            return
        }

        const repsNum = parseInt(reps)
        const weightNum = parseFloat(weight)

        if (isNaN(repsNum) || isNaN(weightNum)) {
            Alert.alert('Error', 'Please enter valid numbers for reps and weight')
            return
        }

        setIsCreating(true)
        try {
            const token = await getToken()
            if (token) {
                const newSet = await SetModel.create(token, exerciseId.toString(), repsNum, weightNum, notes.trim())
                onSetCreated(newSet)
                setReps("")
                setWeight("")
                setNotes("")
            }
        } catch (error: any) {
            console.error('Error creating set:', error)
            const errorMessage = error.message || 'Failed to create set'
            Alert.alert('Error', errorMessage)
        } finally {
            setIsCreating(false)
        }
    }

    const handleClose = () => {
        setReps("")
        setWeight("")
        setNotes("")
        onClose()
    }

    return (
        <Modal visible={show} onRequestClose={handleClose} transparent={true}>
            <BlurView intensity={50} className="flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg p-6 w-full border border-black shadow-lg">
                    <Text className="text-2xl font-bold text-center mb-2">Add New Set</Text>
                    <Text className="text-lg text-center text-gray-600 mb-4">{exerciseName}</Text>
                    
                    <View className="flex-row gap-3 mb-4">
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-1">Reps</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3 text-lg"
                                placeholder="10"
                                value={reps}
                                onChangeText={setReps}
                                keyboardType="numeric"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold mb-1">Weight (lbs)</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3 text-lg"
                                placeholder="135"
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    
                    <View className="mb-4">
                        <Text className="text-sm font-semibold mb-1">Notes (optional)</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-3 text-lg"
                            placeholder="How did it feel?"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={2}
                        />
                    </View>
                    
                    <View className="flex-row gap-3">
                        <TouchableOpacity 
                            onPress={handleClose} 
                            className="flex-1 bg-gray-500 p-3 rounded-lg"
                            disabled={isCreating}
                        >
                            <Text className="text-white text-center font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleCreateSet} 
                            className="flex-1 bg-blue-500 p-3 rounded-lg"
                            disabled={!reps.trim() || !weight.trim() || isCreating}
                        >
                            <Text className="text-white text-center font-semibold">
                                {isCreating ? "Creating..." : "Add Set"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
} 