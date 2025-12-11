import { AuthProvider } from '@/context/AuthContext'; // ✅ Import provider
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>                    {/* ✅ Wrap with provider */}
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(editor)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
