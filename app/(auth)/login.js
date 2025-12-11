import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import PrimaryButton from '../../src/components/buttons/PrimaryButton';
// Import the login service
import { loginUser } from '../../src/services/auth.api';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    // Call API to check if user exists
    const response = await loginUser(phone);
    
    setIsLoading(false);

    if (response.status === 'success') {
      // User exists, proceed to OTP
      // You might want to save user data to Context here later
      console.log("User Data:", response.user); 
      router.push('/(auth)/otp'); 
    } else {
      // User does not exist
      Alert.alert(
        'Account Not Found', 
        'This number is not registered with Tharamac. Please Sign Up.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Up', onPress: () => router.push('/register') }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* UPDATED BRANDING HERE */}
          <Text style={styles.title}>Welcome to Tharamac</Text>
          <Text style={styles.subtitle}>Login to manage your business.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor={Colors.textLight}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />

          <PrimaryButton 
            title="Continue" 
            onPress={handleLogin} 
            isLoading={isLoading}
            style={{ marginTop: 20 }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textLight },
  form: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 8 },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: Colors.textLight, fontSize: 14 },
  link: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
});