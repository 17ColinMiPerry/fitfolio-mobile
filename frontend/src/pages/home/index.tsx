import { View, Text, ScrollView } from 'react-native';

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to FitFolio
          </Text>
          <Text className="text-lg text-gray-600">
            Your personal fitness journey starts here
          </Text>
        </View>

        <View className="space-y-4">
          <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              Quick Stats
            </Text>
            <Text className="text-gray-600">
              Track your progress and see your achievements
            </Text>
          </View>

          <View className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <Text className="text-xl font-semibold text-blue-800 mb-2">
              Today's Workout
            </Text>
            <Text className="text-blue-600">
              Ready to crush your fitness goals?
            </Text>
          </View>

          <View className="bg-green-50 p-6 rounded-lg border border-green-200">
            <Text className="text-xl font-semibold text-green-800 mb-2">
              Nutrition Tips
            </Text>
            <Text className="text-green-600">
              Fuel your body for optimal performance
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}