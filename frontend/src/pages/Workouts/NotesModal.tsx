import { View, Text, Modal, TouchableOpacity } from "react-native"
import { BlurView } from "expo-blur"

interface NotesModalProps {
    show: boolean
    onClose: () => void
    notes: string
    setInfo: string
}

export default function NotesModal({ show, onClose, notes, setInfo }: NotesModalProps) {
    return (
        <Modal visible={show} onRequestClose={onClose} transparent={true}>
            <BlurView intensity={50} className="flex-1 justify-center items-center p-6">
                <View className="bg-white rounded-lg p-6 w-full border border-black shadow-lg">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold">Set Notes</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-2xl font-bold text-gray-500">×</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <Text className="text-sm font-semibold text-gray-600 mb-1">Set Details:</Text>
                        <Text className="text-lg font-medium">{setInfo}</Text>
                    </View>
                    
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-600 mb-2">Notes:</Text>
                        <View className="p-3 bg-gray-50 rounded-lg min-h-[100]">
                            <Text className="text-base leading-6">{notes}</Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity 
                        onPress={onClose}
                        className="bg-blue-500 p-3 rounded-lg"
                    >
                        <Text className="text-white text-center font-semibold">Close</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    )
} 