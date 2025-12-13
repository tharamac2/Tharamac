import { Stack } from 'expo-router';
import { UserProvider } from '../src/context/UserContext'; // Import the provider

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </UserProvider>
  );
}