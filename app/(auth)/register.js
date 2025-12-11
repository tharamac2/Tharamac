import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import PrimaryButton from '../../src/components/buttons/PrimaryButton';
// Import the service
import { registerUser } from '../../src/services/auth.api';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!name.trim() || !phone.trim() || !businessName.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Call the PHP API
      // Note: Make sure keys match what your PHP script expects (name, phone, business_name)
      const response = await registerUser({
        name: name,
        phone: phone,
        business_name: businessName
      });

      if (response.status === 'success') {
        // Navigate to OTP on success
        Alert.alert('Success', 'Account created! Please verify OTP.', [
          {
            text: 'OK', 
            onPress: () => router.push('/(auth)/otp')
          }
        ]);
      } else {
        Alert.alert('Registration Failed', response.message || 'Unknown error occurred.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Tharamac today.</Text>
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
            editable={!isLoading}
          />

          {/* Business Name Input */}
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Business Name"
            placeholderTextColor={Colors.textLight}
            value={businessName}
            onChangeText={setBusinessName}
            editable={!isLoading}
          />

          {/* Phone Input */}
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor={Colors.textLight}
            value={phone}
            onChangeText={setPhone}
            editable={!isLoading}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <PrimaryButton 
            title="Get OTP" 
            onPress={handleRegister} 
            isLoading={isLoading}
            style={{ marginTop: 20 }}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
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