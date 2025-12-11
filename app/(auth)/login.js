import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useAuth } from '@/context/AuthContext'; // ✅ Import hook
import Colors from '@constants/Colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { requestOtp, loading, error } = useAuth();  // ✅ Use hook
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async () => {
    setLocalError('');
    
    if (!phone.trim()) {
      setLocalError('Please enter a mobile number');
      return;
    }

    try {
      await requestOtp(phone);  // ✅ Call API function
      // OTP will be sent, navigate to OTP screen
      router.push({
        pathname: '/(auth)/otp',
        params: { phone }
      });
    } catch (err) {
      setLocalError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to create your brand designs.</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 XXXXX XXXXX"
            placeholderTextColor={Colors.textLight}
            value={phone}
            onChangeText={setPhone}
            editable={!loading}
            keyboardType="phone-pad"
          />

          {(localError || error) && (
            <Text style={styles.errorText}>{localError || error}</Text>
          )}

          <PrimaryButton
            title={loading ? 'Sending OTP...' : 'Send OTP'}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>

        {/* Footer / Signup Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?{' '}</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  link: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
