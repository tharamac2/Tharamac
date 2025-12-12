import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Local theme colors to match the Purple reference image
const Theme = {
  primary: '#8B5CF6',    // Violet/Purple
  text: '#1F2937',       // Dark Gray
  textLight: '#9CA3AF',  // Light Gray
  inputBg: '#F3F4F6',    // Light Input Background
  white: '#FFFFFF',
};

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams(); 
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59); // Matches 00:59s in image
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

    // Simulation
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(main)/home');
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Theme.text} />
        </TouchableOpacity>

        {/* Header Text */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>
            An 4 digit code has been sent to your number{'\n'}
            <Text style={styles.phoneText}>{phone || '(405) 555-0128'}</Text>
          </Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : null,
                // Add focused border logic if desired
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
              editable={!isLoading}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity 
          style={styles.verifyButton} 
          onPress={handleVerify}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        {/* Resend Timer */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <View style={styles.timerRow}>
             <Text style={styles.resendText}>Request code again </Text>
             <Text style={styles.timerText}>{formatTime(timer)}s</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F5F5F5', // Light circle background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneText: {
    color: Theme.text,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Spreads them out nicely
    marginBottom: 40,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 30, // Makes them circular
    backgroundColor: Theme.inputBg,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: Theme.text,
    // Optional shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  otpInputFilled: {
    borderWidth: 1,
    borderColor: Theme.primary,
    backgroundColor: '#FBF8FF', // Very light purple tint when filled
  },
  verifyButton: {
    backgroundColor: Theme.primary,
    paddingVertical: 16,
    borderRadius: 30, // Pill shape like reference
    alignItems: 'center',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
  },
  verifyButtonText: {
    color: Theme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: Theme.textLight,
    fontSize: 14,
    marginBottom: 4,
  },
  timerRow: {
    flexDirection: 'row',
  },
  timerText: {
    color: Theme.text, // Darker text for the timer
    fontWeight: 'bold',
  },
});