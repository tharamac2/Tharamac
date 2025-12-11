import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text, TextInput,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import PrimaryButton from '../../src/components/buttons/PrimaryButton';

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams(); 
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) inputRefs.current[index + 1].focus();
    if (index === 3 && text) Keyboard.dismiss();
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit code');
      return;
    }

    setIsLoading(true);

    // SIMULATING VERIFICATION
    // In a real app, you would fetch(`${API_BASE}/verify_otp.php`...) here
    setTimeout(() => {
      setIsLoading(false);
      console.log('OTP Verified for:', phone);
      
      // ✅ SUCCESS! Navigate to Home
      router.replace('/(main)/home');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>Enter the 4-digit code sent to {phone}</Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
              editable={!isLoading}
            />
          ))}
        </View>

        <PrimaryButton 
          title="Verify & Login" 
          onPress={handleVerify} 
          isLoading={isLoading}
        />
        
        {/* Timer UI ... */}
      </View>
    </SafeAreaView>
  );
}
// Styles remain the same...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 10 },
  subtitle: { fontSize: 14, color: Colors.textLight, textAlign: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 20 },
  otpInput: { width: 55, height: 55, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.inputBg, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: Colors.text },
  otpInputFilled: { borderColor: Colors.primary, backgroundColor: Colors.white },
});