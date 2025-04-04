import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // This hides headers for all Stack screens
      }}
    >
      <Stack.Screen 
        name="(tabs)" // Your tab navigator
        options={{ headerShown: false }} // Extra protection
      />
    </Stack>
  );
}