import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

// Theme Colors
const Theme = {
    primary: '#7C3AED', 
    background: '#FFFFFF',
    text: '#1F2937',
    textLight: '#9CA3AF',
    inputBg: '#F3F4F6',
};

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

        // --- SIMULATION ---
        setTimeout(() => {
            setIsLoading(false);
            router.push({ pathname: '/(auth)/otp', params: { phone: phone } });
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        
                        {/* Header Back Button */}
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={Theme.text} />
                        </TouchableOpacity>

                        {/* 3D Illustration Placeholder */}
                        <View style={styles.illustrationContainer}>
                            <Image 
                                source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/security-check-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--login-password-shield-user-interface-pack-icons-4869687.png' }} 
                                style={styles.illustration}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Title Section */}
                        <View style={styles.textSection}>
                            <Text style={styles.title}>Verify Phone Number</Text>
                            <Text style={styles.subtitle}>
                                Allow a call and call log access to automatically{'\n'}verify your phone number easily.
                            </Text>
                        </View>

                        {/* Input Section */}
                        <View style={styles.bottomSection}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.countryCode}>(+91)  <Ionicons name="chevron-down" size={14}/></Text>
                                <View style={styles.verticalLine} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="98765 43210"
                                    placeholderTextColor={Theme.textLight}
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                    maxLength={10}
                                />
                                {phone.length > 0 && (
                                    <TouchableOpacity onPress={() => setPhone('')}>
                                        <Ionicons name="close-circle" size={20} color={Theme.textLight} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Main Action Button */}
                            <TouchableOpacity 
                                style={styles.primaryButton} 
                                onPress={handleLogin}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {isLoading ? 'Processing...' : 'Keep Going'}
                                </Text>
                            </TouchableOpacity>

                            {/* NEW: Sign Up Option */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>New user? </Text>
                                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                    <Text style={styles.linkText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.background },
    content: { flex: 1, padding: 24 },
    
    backButton: { 
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', 
        justifyContent: 'center', alignItems: 'center', marginTop: 10 
    },
    
    illustrationContainer: { alignItems: 'center', marginVertical: 30, flex: 1, justifyContent: 'center' },
    illustration: { width: 200, height: 200 },
    
    textSection: { alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: Theme.text, marginBottom: 10 },
    subtitle: { fontSize: 14, color: Theme.textLight, textAlign: 'center', lineHeight: 20 },
    
    bottomSection: { marginBottom: 20 },
    
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Theme.inputBg, borderRadius: 16, height: 60, paddingHorizontal: 20, marginBottom: 20,
    },
    countryCode: { fontSize: 16, color: Theme.text, fontWeight: '600', marginRight: 10 },
    verticalLine: { width: 1, height: 24, backgroundColor: '#D1D5DB', marginRight: 15 },
    input: { flex: 1, fontSize: 18, color: Theme.text, fontWeight: '500' },
    
    primaryButton: {
        backgroundColor: Theme.primary, borderRadius: 30, height: 55,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: Theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
    },
    primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

    // Footer Styles
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { color: Theme.textLight, fontSize: 14 },
    linkText: { color: Theme.primary, fontWeight: 'bold', fontSize: 14 },
});