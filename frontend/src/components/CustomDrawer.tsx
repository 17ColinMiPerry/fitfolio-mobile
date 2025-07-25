import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth, useClerk, useOAuth, useUser } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { UserModel } from '../models/User';

WebBrowser.maybeCompleteAuthSession();

const CustomDrawer = (props: any) => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [loading, setLoading] = useState(false);

  // Effect to create user in database when they sign in
  useEffect(() => {
    const createUserInDatabase = async () => {
      if (isSignedIn && user?.id) {
        try {
          // Get the authentication token from Clerk
          const token = await getToken();
          if (token) {
            await UserModel.findOrCreate(token);
            console.log('User created/verified in database');
          }
        } catch (dbError) {
          console.error('Error creating user in database:', dbError);
          // Don't fail the sign-in if database creation fails
        }
      }
    };

    createUserInDatabase();
  }, [isSignedIn, user?.id, getToken]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        
        // Close the drawer after successful sign-in
        props.navigation.closeDrawer();
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <DrawerContentScrollView {...props}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">FitFolio</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* Sign In/Out Button at bottom */}
      <View className="p-4 border-t border-gray-200">
        {isSignedIn ? (
          <TouchableOpacity 
            onPress={handleSignOut}
            className="bg-red-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleSignIn}
            disabled={loading}
            className={`p-3 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? 'Signing In...' : 'Sign in with Google'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomDrawer; 