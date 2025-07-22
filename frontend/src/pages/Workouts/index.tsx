import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-expo"

import { WorkoutModel, Workout } from "../../models/Workout"
import { ExerciseModel, Exercise } from "../../models/Exercise"
import { Set as SetType } from "../../models/Set"
import SelectWorkoutModal from "./SelectWorkoutModal"
import AddExerciseModal from "./AddExerciseModal"
import AddSetModal from "./AddSetModal"
import EditExerciseModal from "./EditExerciseModal"
import EditSetModal from "./EditSetModal"
import NotesModal from "./NotesModal"

export default function WorkoutsPage () {
    const { getToken } = useAuth()
    const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null)
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [showSelectWorkoutModal, setShowSelectWorkoutModal] = useState(false)
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false)
    const [showAddSetModal, setShowAddSetModal] = useState(false)
    const [showEditExerciseModal, setShowEditExerciseModal] = useState(false)
    const [showEditSetModal, setShowEditSetModal] = useState(false)
    const [showNotesModal, setShowNotesModal] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const [selectedSet, setSelectedSet] = useState<SetType | null>(null)
    const [selectedNotes, setSelectedNotes] = useState("")
    const [selectedSetInfo, setSelectedSetInfo] = useState("")
    const [expandedSets, setExpandedSets] = useState<{ [exerciseId: number]: boolean }>({})

    const toggleSets = (exerciseId: number) => {
        setExpandedSets(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }))
    }

    const fetchWorkouts = async () => {
        try {
            const token = await getToken()
            if (token) {
                const fetchedWorkouts = await WorkoutModel.getAll(token)
                console.log('Fetched workouts:', fetchedWorkouts)
                setWorkouts(fetchedWorkouts)
                
                // Update current workout if it exists
                if (currentWorkout) {
                    const updatedCurrentWorkout = fetchedWorkouts.find(w => w.id === currentWorkout.id)
                    console.log('Updated current workout:', updatedCurrentWorkout)
                    if (updatedCurrentWorkout) {
                        setCurrentWorkout(updatedCurrentWorkout)
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching workouts:', error)
        }
    }

    useEffect(() => {
        let isMounted = true
        
        const loadWorkouts = async () => {
            try {
                const token = await getToken()
                if (token && isMounted) {
                    const fetchedWorkouts = await WorkoutModel.getAll(token)
                    console.log('Initial workouts load:', fetchedWorkouts)
                    if (isMounted) {
                        setWorkouts(fetchedWorkouts)
                    }
                }
            } catch (error) {
                console.error('Error fetching workouts:', error)
            }
        }

        loadWorkouts()
        
        return () => {
            isMounted = false
        }
    }, []) // Empty dependency array - only run once on mount

    const handleSelectWorkout = () => {
        setShowSelectWorkoutModal(true)
        console.log("select workout")
    }

    const handleWorkoutSelected = (workout: Workout) => {
        console.log('Selected workout:', workout)
        setCurrentWorkout(workout)
    }

    const handleWorkoutCreated = (newWorkout: Workout) => {
        // If newWorkout has an id, it's a new workout. If not, it's a signal to refresh
        if (newWorkout.id) {
            setCurrentWorkout(newWorkout)
            setWorkouts([newWorkout, ...workouts])
        } else {
            // Refresh the workouts list (for after deletion)
            fetchWorkouts()
        }
    }

    const handleAddExercise = () => {
        if (currentWorkout) {
            console.log('Adding exercise to workout:', currentWorkout.id)
            setShowAddExerciseModal(true)
        }
    }

    const handleExerciseCreated = (newExercise: Exercise) => {
        console.log('Exercise created:', newExercise)
        // Refresh the workouts list to get the updated workout with exercises
        fetchWorkouts()
        setShowAddExerciseModal(false)
    }

    const handleDeleteExercise = async (exerciseId: number) => {
        try {
            const token = await getToken()
            if (token) {
                console.log('Deleting exercise:', exerciseId)
                await ExerciseModel.delete(token, exerciseId.toString())
                // Refresh the workouts list to get the updated workout with exercises
                fetchWorkouts()
            }
        } catch (error: any) {
            console.error('Error deleting exercise:', error)
            // Show the specific error message
            const errorMessage = error.message || 'Failed to delete exercise'
            Alert.alert('Error', errorMessage)
        }
    }

    const handleEditExercise = (exercise: Exercise) => {
        setSelectedExercise(exercise)
        setShowEditExerciseModal(true)
    }

    const handleExerciseUpdated = (updatedExercise: Exercise) => {
        if (currentWorkout) {
            const updatedWorkout = {
                ...currentWorkout,
                exercises: currentWorkout.exercises?.map(ex => 
                    ex.id === updatedExercise.id ? updatedExercise : ex
                ) || []
            }
            setCurrentWorkout(updatedWorkout)
        }
    }

    const handleAddSet = (exercise: Exercise) => {
        setSelectedExercise(exercise)
        setShowAddSetModal(true)
    }

    const handleSetCreated = (newSet: SetType) => {
        if (currentWorkout && selectedExercise) {
            const updatedWorkout = {
                ...currentWorkout,
                exercises: currentWorkout.exercises?.map(ex => 
                    ex.id === selectedExercise.id 
                        ? { ...ex, sets: [...(ex.sets || []), newSet] }
                        : ex
                ) || []
            }
            setCurrentWorkout(updatedWorkout)
        }
    }

    const handleEditSet = (set: SetType) => {
        setSelectedSet(set)
        setShowEditSetModal(true)
    }

    const handleSetUpdated = (updatedSet: SetType) => {
        if (currentWorkout) {
            const updatedWorkout = {
                ...currentWorkout,
                exercises: currentWorkout.exercises?.map(ex => 
                    ex.sets ? {
                        ...ex,
                        sets: ex.sets.map(s => s.id === updatedSet.id ? updatedSet : s)
                    } : ex
                ) || []
            }
            setCurrentWorkout(updatedWorkout)
        }
    }

    const handleDeleteSet = async (setId: number) => {
        try {
            const token = await getToken()
            if (token) {
                // Import SetModel here to avoid circular dependency
                const { SetModel } = await import("../../models/Set")
                await SetModel.delete(token, setId.toString())
                fetchWorkouts() // Refresh to get updated data
            }
        } catch (error: any) {
            console.error('Error deleting set:', error)
            Alert.alert('Error', error.message || 'Failed to delete set')
        }
    }

    const handleShowNotes = (set: SetType) => {
        setSelectedNotes(set.notes || "")
        setSelectedSetInfo(`${set.reps} reps @ ${set.weight}lbs`)
        setShowNotesModal(true)
    }

    return (
        <ScrollView>
            <View className="flex-1 items-start justify-center p-6 gap-6">
                <Text className="text-2xl font-bold text-center">Start a workout or look at your past workouts!</Text>
                <View className="flex-1 items-center justify-center w-full gap-6">
                    <Text className="text-lg text-center">
                        Start a workout or look at your past workouts!
                    </Text>
                    <View className="flex-1 items-center justify-center w-full">
                        <View className="flex-1 items-center justify-center bg-blue-300 rounded-t-lg p-4 w-full">
                            <Text className="text-lg text-center">
                                Current Workout
                            </Text>
                        </View>
                        <View className="flex-1 items-center justify-center bg-gray-200 rounded-b-lg p-4 w-full">
                            {/* Workout Details Table - only show when workout is selected */}
                            {currentWorkout && (
                                <View className="w-full mb-4">
                                    {/* Workout Info */}
                                    <View className="mb-4">
                                        <Text className="text-lg font-semibold text-center">{currentWorkout.name}</Text>
                                        <Text className="text-sm text-gray-500 text-center">
                                            Started: {new Date(currentWorkout.createdAt).toLocaleString()}
                                        </Text>
                                    </View>

                                    {/* Exercises Table Header */}
                                    <View className="flex-row bg-gray-100 p-2 rounded-t-lg border-b border-gray-200">
                                        <Text className="flex-1 font-semibold text-gray-700 text-base">EXERCISE</Text>
                                        <Text className="flex-1 font-semibold text-gray-700 text-base">CREATED</Text>
                                        <Text className="flex-1 font-semibold text-gray-700 text-base">ACTIONS</Text>
                                    </View>

                                    {/* Exercises List */}
                                    {currentWorkout.exercises && currentWorkout.exercises.length > 0 ? (
                                        currentWorkout.exercises.map((exercise) => (
                                            <View key={exercise.id}>
                                                {/* Exercise Row */}
                                                <View className="flex-row p-2 border-b border-gray-100">
                                                    <Text className="flex-1 text-gray-800 text-base">{exercise.name}</Text>
                                                    <Text className="flex-1 text-sm text-gray-500">
                                                        {new Date(exercise.createdAt).toLocaleDateString()}
                                                    </Text>
                                                    <View className="flex-1 flex-row gap-4 justify-start">
                                                        <TouchableOpacity onPress={() => handleEditExercise(exercise)}>
                                                            <Text className="text-blue-500 text-base">✏️</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
                                                            <Text className="text-red-500 text-base">🗑️</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                
                                                {/* Sets for this exercise - collapsible */}
                                                <View className="bg-gray-50 p-2 border-b border-gray-100">
                                                    <View className="flex-row items-center mb-2">
                                                        <Text className="text-sm font-semibold text-gray-600">Sets:</Text>
                                                        {exercise.sets && exercise.sets.length > 0 && !expandedSets[exercise.id] && (
                                                            <TouchableOpacity onPress={() => toggleSets(exercise.id)}>
                                                                <Text className="text-sm text-blue-500 ml-2">({exercise.sets.length})</Text>
                                                            </TouchableOpacity>
                                                        )}
                                                        {exercise.sets && exercise.sets.length > 0 && expandedSets[exercise.id] && (
                                                            <TouchableOpacity onPress={() => toggleSets(exercise.id)}>
                                                                <Text className="text-sm text-blue-500 ml-2">(hide sets)</Text>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                    {(!exercise.sets || exercise.sets.length === 0 || expandedSets[exercise.id]) && (
                                                        <>
                                                            {/* Sets Table Header */}
                                                            {exercise.sets && exercise.sets.length > 0 && (
                                                                <View className="flex-row bg-gray-100 p-2 rounded-t mb-1">
                                                                    <Text className="flex-1 font-semibold text-gray-700 text-sm">REPS</Text>
                                                                    <Text className="flex-1 font-semibold text-gray-700 text-sm">WEIGHT</Text>
                                                                    <Text className="flex-1 font-semibold text-gray-700 text-sm">NOTES</Text>
                                                                    <Text className="flex-1 font-semibold text-gray-700 text-sm">ACTIONS</Text>
                                                                </View>
                                                            )}
                                                            {exercise.sets && exercise.sets.length > 0 ? (
                                                                exercise.sets.map((set) => (
                                                                    <View key={set.id} className="flex-row p-2 border-b border-gray-100">
                                                                        <Text className="flex-1 text-sm text-gray-700">
                                                                            {set.reps}
                                                                        </Text>
                                                                        <Text className="flex-1 text-sm text-gray-700">
                                                                            {set.weight}lbs
                                                                        </Text>
                                                                        <View className="flex-1">
                                                                            {set.notes ? (
                                                                                <TouchableOpacity onPress={() => handleShowNotes(set)}>
                                                                                    <Text className="text-blue-500 text-sm">Read Note</Text>
                                                                                </TouchableOpacity>
                                                                            ) : (
                                                                                <Text className="text-sm text-gray-400">No notes</Text>
                                                                            )}
                                                                        </View>
                                                                        <View className="flex-1 flex-row gap-2 justify-center">
                                                                            <TouchableOpacity onPress={() => handleEditSet(set)}>
                                                                                <Text className="text-blue-500 text-sm">✏️</Text>
                                                                            </TouchableOpacity>
                                                                            <TouchableOpacity onPress={() => handleDeleteSet(set.id)}>
                                                                                <Text className="text-red-500 text-sm">🗑️</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                ))
                                                            ) : (
                                                                <Text className="text-sm text-gray-500">No sets yet</Text>
                                                            )}
                                                            {/* Add Set Button */}
                                                            <TouchableOpacity 
                                                                onPress={() => handleAddSet(exercise)}
                                                                className="mt-2 bg-green-500 p-2 rounded"
                                                            >
                                                                <Text className="text-white text-center text-sm">Add Set</Text>
                                                            </TouchableOpacity>
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        <View className="p-3 text-center">
                                            <Text className="text-gray-500 text-base">No exercises added yet</Text>
                                        </View>
                                    )}

                                    {/* Add Exercise Button */}
                                    <TouchableOpacity 
                                        onPress={handleAddExercise}
                                        className="mt-3 bg-blue-500 p-2 rounded-lg"
                                    >
                                        <Text className="text-white text-center font-semibold text-sm">Add Exercise</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            
                            <TouchableOpacity className="text-lg text-center bg-blue-500 rounded-lg p-4 w-full" onPress={handleSelectWorkout}>
                                <Text className="text-white text-center">
                                    Select Workout
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <SelectWorkoutModal 
                show={showSelectWorkoutModal}
                onClose={() => setShowSelectWorkoutModal(false)}
                workouts={workouts}
                onSelectWorkout={handleWorkoutSelected}
                onWorkoutCreated={handleWorkoutCreated}
            />
            <AddExerciseModal 
                show={showAddExerciseModal}
                onClose={() => setShowAddExerciseModal(false)}
                workoutId={currentWorkout?.id || 0}
                onExerciseCreated={handleExerciseCreated}
            />
            <AddSetModal 
                show={showAddSetModal}
                onClose={() => setShowAddSetModal(false)}
                exerciseId={selectedExercise?.id || 0}
                exerciseName={selectedExercise?.name || ""}
                onSetCreated={handleSetCreated}
            />
            <EditExerciseModal 
                show={showEditExerciseModal}
                onClose={() => setShowEditExerciseModal(false)}
                exercise={selectedExercise}
                onExerciseUpdated={handleExerciseUpdated}
            />
            <EditSetModal 
                show={showEditSetModal}
                onClose={() => setShowEditSetModal(false)}
                set={selectedSet}
                onSetUpdated={handleSetUpdated}
            />
            <NotesModal 
                show={showNotesModal}
                onClose={() => setShowNotesModal(false)}
                notes={selectedNotes}
                setInfo={selectedSetInfo}
            />
        </ScrollView>
    )
}