import { Stack } from 'expo-router';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import Constants from 'expo-constants';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const clerkKey =
    Constants.expoConfig?.extra?.clerkPublishableKey ||
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkKey) {
    console.error('Clerk Publishable Key is missing!');
  }

  return (
    <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
      <SignedIn>
        {/* Stack Navigator when user is signed in */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SignedIn>

      <SignedOut>
        {/* Stack Navigator for authentication */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack>
      </SignedOut>
    </ClerkProvider>
  );
}