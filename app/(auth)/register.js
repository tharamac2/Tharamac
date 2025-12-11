import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useAuth } from '@/context/AuthContext'; // ✅ Import hook
import Colors from '@constants/Colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { requestOtp, loading, error } = useAuth();  // ✅ Use hook
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [localError, setLocalError] = useState('');

  const handleRegister = async () => {
    setLocalError('');

    if (!name.trim() || !phone.trim() || !businessName.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await requestOtp(phone);  // ✅ Send OTP
      // Navigate to OTP screen with user data
      router.push({
        pathname: '/(auth)/otp',
        params: { phone, name, businessName }
      });
    } catch (err) {
      setLocalError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join BrandXpress today.</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Name Input */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={Colors.textLight}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          {/* Business Name Input */}
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Business Name"
            placeholderTextColor={Colors.textLight}
            value={businessName}
            onChangeText={setBusinessName}
            editable={!loading}
          />

          {/* Phone Input */}
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
            title={loading ? 'Registering...' : 'Continue'}
            onPress={handleRegister}
            disabled={loading}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?{' '}</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Login</Text>
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
    marginBottom: 30,
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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 12,
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
    marginBottom: 16,
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
