import { View, Text, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

import StreakTracker from './StreakTracker';

export default function Home() {
  const { user } = useUser();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6 items-start justify-center gap-6">
        <View className="flex">
          <Text className="text-2xl font-bold text-center">Hello {user?.firstName}!{'\n'} Here's your{' '}
            <Text className="text-blue-500">FitFolio</Text> at a glance..</Text>
        </View>
        <StreakTracker />
      </View>
    </ScrollView>
  );
}