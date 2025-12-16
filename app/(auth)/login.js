import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// ✅ Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme Colors
const Theme = {
    primary: '#7C3AED',       
    primaryDark: '#6D28D9',
    background: '#7C3AED',    
    surface: '#FFFFFF',       
    text: '#1F2937',
    textLight: '#9CA3AF',
    inputBg: '#F3F4F6',
    border: '#E5E7EB',
};

// ====================================================
// ✅ SIMULATED DATABASE (MOCK DB)
// Add your test users here. When you login with these 
// numbers, the app will load these specific details.
// ====================================================
const REGISTERED_USERS = {
    '1234567890': {
        name: 'Rahul Sharma',
        businessName: 'Sharma Electronics',
        phone: '1234567890'
    },
    '9876543210': {
        name: 'Priya Verma',
        businessName: 'Priya Designs',
        phone: '9876543210'
    },
    '5555555555': {
        name: 'Demo Admin',
        businessName: 'Master Admin Console',
        phone: '5555555555'
    }
};

export default function LoginScreen() {
    const router = useRouter();
    
    // State variables
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(''); 
    const [generatedOtp, setGeneratedOtp] = useState(null); // Stores the random OTP
    const [showOtpInput, setShowOtpInput] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    
    // Timer state 
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Timer logic
    useEffect(() => {
        let interval;
        if (showOtpInput && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [showOtpInput, timer]);

    // --- STEP 1: SEND RANDOM OTP ---
    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);

        // Simulate Network Delay
        setTimeout(() => {
            setIsLoading(false);

            // ✅ Generate Random 4-Digit OTP
            const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
            setGeneratedOtp(randomCode);

            // ✅ Show OTP in Alert (Simulating SMS)
            Alert.alert('OTP Received', `Your verification code is: ${randomCode}`);

            setShowOtpInput(true);
            setTimer(30);
            setCanResend(false);
        }, 1500);
    };

    // --- STEP 2: VERIFY OTP & LOGIN ---
    const handleVerifyLogin = async () => {
        if (!otp || otp.length < 4) {
            Alert.alert('Error', 'Please enter the valid OTP');
            return;
        }

        setIsLoading(true);

        // Simulate Verification Delay
        setTimeout(async () => {
            setIsLoading(false);

            // ✅ CHECK: Does entered OTP match the generated one?
            if (otp === generatedOtp) {
                
                // ====================================================
                // ✅ FETCH USER DETAILS FROM MOCK DB
                // ====================================================
                try {
                    // Check if this phone number exists in our "Database"
                    let userData = REGISTERED_USERS[phone];

                    // If user is NOT in database, create a default "New User"
                    if (!userData) {
                        userData = {
                            name: 'New User', 
                            businessName: 'My New Business',
                            phone: phone,
                            isNew: true // Optional flag
                        };
                    }

                    // Save the specific user data to storage
                    // The Home & Profile screens will read this data!
                    await AsyncStorage.setItem('userSession', JSON.stringify(userData));
                    
                    // Navigate to Home
                    router.replace('/(main)/home');
                    
                } catch (e) {
                    console.log('Failed to save user data', e);
                }
                // ====================================================

            } else {
                Alert.alert('Login Failed', 'Incorrect OTP. Please try again.');
            }
        }, 1000);
    };

    // Resend Handler
    const handleResendOtp = () => {
        setOtp('');
        setTimer(30);
        setCanResend(false);
        handleSendOtp();
    };

    const handleBackToPhone = () => {
        setShowOtpInput(false);
        setOtp('');
        setGeneratedOtp(null);
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor={Theme.primary} />
            
            {/* Header / Logo Area */}
            <SafeAreaView style={styles.headerArea}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="person" size={40} color={Theme.primary} />
                    </View>
                    <Text style={styles.headerTitle}>Welcome Back</Text>
                    <Text style={styles.headerSubtitle}>
                        {showOtpInput ? `OTP sent to +91 ${phone}` : 'Sign in to continue'}
                    </Text>
                </View>
            </SafeAreaView>

            {/* Form Sheet */}
            <View style={styles.sheetContainer}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.sheetContent}
                >
                    <View style={{ marginBottom: 30 }}>
                        <Text style={styles.welcomeText}>
                            {showOtpInput ? 'Enter OTP' : 'Hello there! 👋'}
                        </Text>
                        <Text style={styles.instructionText}>
                            {showOtpInput 
                                ? 'Enter the verification code shown in the alert.' 
                                : 'Please enter your mobile number to sign in.'
                            }
                        </Text>
                    </View>

                    {/* Conditional Rendering: Phone Input vs OTP Input */}
                    {!showOtpInput ? (
                        // PHONE INPUT VIEW
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color={Theme.textLight} style={{ marginRight: 10 }} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter 10-digit number"
                                    placeholderTextColor={Theme.textLight}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    autoFocus={true}
                                />
                            </View>
                        </View>
                    ) : (
                        // OTP INPUT VIEW
                        <View style={styles.inputGroup}>
                             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.label}>One Time Password</Text>
                                <TouchableOpacity onPress={handleBackToPhone}>
                                    <Text style={{ color: Theme.primary, fontSize: 12, fontWeight: '600' }}>Change Number</Text>
                                </TouchableOpacity>
                             </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={Theme.textLight} style={{ marginRight: 10 }} />
                                <TextInput
                                    style={[styles.input, { letterSpacing: 5, fontSize: 18, fontWeight: 'bold' }]}
                                    placeholder="• • • •"
                                    placeholderTextColor={Theme.textLight}
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    autoFocus={true}
                                />
                            </View>
                            
                            {/* Resend Timer */}
                            <View style={styles.resendContainer}>
                                {canResend ? (
                                    <TouchableOpacity onPress={handleResendOtp}>
                                        <Text style={styles.linkText}>Resend OTP</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Action Button */}
                    <TouchableOpacity 
                        style={styles.primaryButton} 
                        onPress={showOtpInput ? handleVerifyLogin : handleSendOtp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                {showOtpInput ? 'Verify & Login' : 'Get OTP'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer Links */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: Theme.primary },
    headerArea: { flex: 0.35, justifyContent: 'center', alignItems: 'center' },
    logoContainer: { alignItems: 'center' },
    logoCircle: { width: 80, height: 80, backgroundColor: '#FFF', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
    
    sheetContainer: { 
        flex: 0.65, 
        backgroundColor: Theme.surface, 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30,
        overflow: 'hidden'
    },
    sheetContent: { flex: 1, padding: 24, paddingTop: 40 },
    
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: Theme.text, marginBottom: 8 },
    instructionText: { fontSize: 14, color: Theme.textLight },

    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: Theme.text, marginBottom: 8 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.inputBg,
        borderRadius: 12, paddingHorizontal: 15, height: 50,
    },
    input: { flex: 1, color: Theme.text, fontSize: 15 },
    
    resendContainer: { alignItems: 'flex-end', marginTop: 10 },
    timerText: { color: Theme.textLight, fontSize: 13 },

    primaryButton: {
        backgroundColor: Theme.primary, borderRadius: 25, height: 50,
        justifyContent: 'center', alignItems: 'center', marginTop: 10,
        shadowColor: Theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
    },
    primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
    footerText: { color: Theme.textLight, fontSize: 14 },
    linkText: { color: Theme.primary, fontWeight: 'bold', fontSize: 14 },
});