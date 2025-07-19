import { useState, useEffect } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from "react-native"
import { BlurView } from "expo-blur"
import { useAuth } from "@clerk/clerk-expo"

import { SetModel, Set as SetType } from "../../models/Set"

interface EditSetModalProps {
    show: boolean
    onClose: () => void
    set: SetType | null
    onSetUpdated: (set: SetType) => void
}

export default function EditSetModal({ show, onClose, set, onSetUpdated }: EditSetModalProps) {
    const { getToken } = useAuth()
    const [reps, setReps] = useState("")
    const [weight, setWeight] = useState("")
    const [notes, setNotes] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (set) {
            setReps(set.reps.toString())
            setWeight(set.weight.toString())
            setNotes(set.notes || "")
        }
    }, [set])

    const handleUpdateSet = async () => {
        if (!set || !reps.trim() || !weight.trim()) return

        const repsNum = parseInt(reps)
        const weightNum = parseFloat(weight)

        if (isNaN(repsNum) || isNaN(weightNum)) {
            Alert.alert('Error', 'Please enter valid numbers for reps and weight')
            return
        }

        setIsUpdating(true)
        try {
            const token = await getToken()
            if (token) {
                await SetModel.update(token, set.id.toString(), repsNum, weightNum, notes.trim())
                const updatedSet = { ...set, reps: repsNum, weight: weightNum, notes: notes.trim() }
                onSetUpdated(updatedSet)
                onClose()
            }
        } catch (error: any) {
            console.error('Error updating set:', error)
            const errorMessage = error.message || 'Failed to update set'
            Alert.alert('Error', errorMessage)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleClose = () => {
        if (set) {
            setReps(set.reps.toString())
            setWeight(set.weight.toString())
            setNotes(set.notes || "")
        }
        onClose()
    }

    if (!set) return null

    return (
        <Modal visible={show} onRequestClose={handleClose} transparent={true}>
            <BlurView intensity={50} className="flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg p-6 w-full border border-black shadow-lg">
                    <Text className="text-2xl font-bold text-center mb-4">Edit Set</Text>
                    
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
                            disabled={isUpdating}
                        >
                            <Text className="text-white text-center font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleUpdateSet} 
                            className="flex-1 bg-blue-500 p-3 rounded-lg"
                            disabled={!reps.trim() || !weight.trim() || isUpdating}
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