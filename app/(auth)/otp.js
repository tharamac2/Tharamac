import { useRouter } from 'expo-router'; // or your navigation hook
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import auth from './auth'; // your auth API helper

export default function VerifyOtpScreen({ route }) {
  const router = useRouter();
  const [mobile, setMobile] = useState(route.params?.mobile || ''); // passed from previous screen
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);

  // ✅ Verify OTP
  async function handleVerify() {
    if (!mobile || !otp) {
      return Alert.alert('Error', 'Enter mobile and OTP');
    }
    setBusy(true);
    try {
      const res = await auth.verifyOtp(mobile, otp);
      if (res?.user) {
        // success — navigate to main app
        router.replace('/'); // replace so user can't go back
      } else {
        Alert.alert('Verify failed', 'Invalid response from server');
      }
    } catch (e) {
      Alert.alert('Verify failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  // ✅ Resend OTP
  async function resend() {
    try {
      await auth.requestOtp(mobile);
      Alert.alert('Success', 'OTP resent');
    } catch (e) {
      Alert.alert('Resend failed', e?.message || String(e));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>We sent a code to {mobile || 'your mobile'}</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        style={styles.input}
      />
      <Button
        title={busy ? 'Verifying...' : 'Verify'}
        onPress={handleVerify}
        disabled={busy}
      />
      <View style={{ height: 12 }} />
      <Button title="Resend OTP" onPress={resend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
