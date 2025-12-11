import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useAuth } from '@/context/AuthContext'; // ✅ Import hook
import Colors from '@constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();  // Get phone from login screen
  const { verifyOtp, requestOtp, loading, error } = useAuth();  // ✅ Use hook
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [localError, setLocalError] = useState('');
  const inputRefs = useRef([]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Input Change
  const handleChange = (text, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    // If all filled, dismiss keyboard
    if (index === 3 && text) {
      Keyboard.dismiss();
    }
  };

  // Handle Backspace
  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Verify
  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    setLocalError('');

    if (enteredOtp.length !== 4) {
      setLocalError('Please enter a valid 4-digit code');
      return;
    }

    try {
      await verifyOtp(phone, enteredOtp);  // ✅ Call API function
      // Navigate to Main App (Home)
      router.replace('/(main)/home');
    } catch (err) {
      setLocalError(err.message || 'Invalid OTP. Please try again.');
    }
  };

  // Handle Resend
  const handleResend = async () => {
    if (timer === 0) {
      try {
        setLocalError('');
        await requestOtp(phone);  // ✅ Resend OTP
        setTimer(30);
        setOtp(['', '', '', '']);
      } catch (err) {
        setLocalError('Failed to resend OTP.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to {phone}
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
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
              editable={!loading}
            />
          ))}
        </View>

        {(localError || error) && (
          <Text style={styles.errorText}>{localError || error}</Text>
        )}

        {/* Verify Button */}
        <PrimaryButton
          title={loading ? 'Verifying...' : 'Verify'}
          onPress={handleVerify}
          disabled={loading}
        />

        {/* Timer & Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code?{' '}</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={timer > 0}
          >
            <Text
              style={[
                styles.resendLink,
                timer > 0 && styles.disabledLink,
              ]}
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
            </Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  disabledLink: {
    color: Colors.textLight,
    opacity: 0.6,
  },
});
