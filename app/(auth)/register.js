import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import PrimaryButton from '../../src/components/buttons/PrimaryButton';
import { registerUser } from '../../src/services/auth.api';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false); // State for overlay

  const handleRegister = async () => {
    // Basic validation
    if (!name.trim() || !phone.trim() || !businessName.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call the API
      const response = await registerUser({
        name: name,
        phone: phone,
        business_name: businessName
      });

      // 2. Check Success
      if (response.status === 'success') {
        setIsLoading(false);
        
        // 3. Show Welcome Overlay
        setShowWelcome(true);

        // 4. Wait 3 seconds, then go to Home
        setTimeout(() => {
          setShowWelcome(false);
          router.replace('/(main)/home'); 
        }, 3000);
        
      } else {
        setIsLoading(false);
        Alert.alert('Registration Failed', response.message || 'Unknown error occurred.');
      }

    } catch (error) {
      setIsLoading(false);
      // For testing without backend, uncomment the lines below to force success:
      /*
      setShowWelcome(true);
      setTimeout(() => {
          setShowWelcome(false);
          router.replace('/(main)/home'); 
      }, 3000);
      */
      Alert.alert('Error', 'Something went wrong. Please check your connection.');
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
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={Colors.textLight}
            value={name}
            onChangeText={setName}
            editable={!isLoading && !showWelcome}
          />

          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Business Name"
            placeholderTextColor={Colors.textLight}
            value={businessName}
            onChangeText={setBusinessName}
            editable={!isLoading && !showWelcome}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor={Colors.textLight}
            value={phone}
            onChangeText={setPhone}
            editable={!isLoading && !showWelcome}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <PrimaryButton 
            title="Submit" 
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

        {/* --- WELCOME OVERLAY MODAL --- */}
        <Modal
          transparent={true}
          visible={showWelcome}
          animationType="fade"
        >
          <View style={styles.overlayContainer}>
            <View style={styles.welcomeCard}>
              <View style={styles.iconCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.welcomeTitle}>Welcome to Tharamac!</Text>
              <Text style={styles.welcomeSubtitle}>Setting up your business profile...</Text>
              <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 15 }} />
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textLight },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 8, marginTop: 12 },
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
  
  // Overlay Styles
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9', // Light green
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 30,
    color: '#4CAF50', // Green
    fontWeight: 'bold',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});