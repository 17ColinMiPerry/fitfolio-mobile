import 'react-native-gesture-handler';

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as WebBrowser from 'expo-web-browser';
import NavigationDrawer from './src/components/NavigationDrawer';

import './global.css';

WebBrowser.maybeCompleteAuthSession();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <NavigationDrawer />
    </ClerkProvider>
  );
}
