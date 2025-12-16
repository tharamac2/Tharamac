import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// ✅ Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import API
import { registerUser } from '../../src/services/auth.api';

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

// Component defined outside
const InputField = ({ label, placeholder, value, onChangeText, keyboardType, maxLength }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Theme.textLight}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                maxLength={maxLength}
            />
        </View>
    </View>
);

export default function RegisterScreen() {
    const router = useRouter();
    
    // State variables
    const [name, setName] = useState('');                 
    const [businessName, setBusinessName] = useState(''); 
    const [phone, setPhone] = useState('');               
    
    const [isLoading, setIsLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false); 

    const handleRegister = async () => {
        // Validation
        if (!name || !businessName || !phone) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (phone.length < 10) {
             Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
             return;
        }

        setIsLoading(true);

        try {
            // API Call
            const response = await registerUser({
                name: name,
                business_name: businessName,
                phone: phone
            });

            setIsLoading(false);

            if (response.status === 'success') {
                
                // ✅ SAVE DATA TO STORAGE
                // This saves the details so Home & Profile can read them later
                try {
                    const userData = {
                        name: name,
                        businessName: businessName,
                        phone: phone,
                    };
                    await AsyncStorage.setItem('userSession', JSON.stringify(userData));
                } catch (error) {
                    console.log('Error saving user data:', error);
                }

                setShowWelcome(true);
                setTimeout(() => {
                    setShowWelcome(false);
                    router.replace('/(main)/home'); 
                }, 2000);
            } else {
                Alert.alert('Registration Failed', response.message || 'Please try again.');
            }

        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', 'Network connection failed.');
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor={Theme.primary} />
            
            {/* Header Area */}
            <SafeAreaView style={styles.headerArea}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                         <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Account</Text>
                    <Text style={styles.headerSubtitle}>
                        Sign up to manage your business, leads, and designs all in one place.
                    </Text>
                </View>
            </SafeAreaView>

            {/* Form Sheet */}
            <View style={styles.sheetContainer}>
                <ScrollView 
                    contentContainerStyle={styles.sheetContent} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    
                    <InputField 
                        label="Name" 
                        placeholder="Enter your full name" 
                        value={name} 
                        onChangeText={setName} 
                    />
                    
                    <InputField 
                        label="Business Name" 
                        placeholder="Enter your shop or business name" 
                        value={businessName} 
                        onChangeText={setBusinessName} 
                    />

                    <InputField 
                        label="Mobile Number" 
                        placeholder="Enter 10-digit mobile number" 
                        value={phone} 
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />

                    {/* Submit Button */}
                    <TouchableOpacity 
                        style={styles.primaryButton} 
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Continue Now</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer Links */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.linkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ height: 40 }} /> 
                </ScrollView>
            </View>

            {/* Success Modal */}
            <Modal transparent={true} visible={showWelcome} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark" size={30} color="#FFF" />
                        </View>
                        <Text style={styles.modalTitle}>Success!</Text>
                        <Text style={styles.modalText}>Account created successfully.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: Theme.primary },
    headerArea: { flex: 0.3, justifyContent: 'center' },
    headerContent: { paddingHorizontal: 24, paddingBottom: 20 },
    backButton: { marginBottom: 15 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
    
    sheetContainer: { 
        flex: 0.7, 
        backgroundColor: Theme.surface, 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30,
        overflow: 'hidden'
    },
    sheetContent: { padding: 24, paddingTop: 30 },
    
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: Theme.text, marginBottom: 8 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.surface,
        borderWidth: 1, borderColor: Theme.border, borderRadius: 12, paddingHorizontal: 15, height: 50,
    },
    input: { flex: 1, color: Theme.text, fontSize: 15 },
    
    primaryButton: {
        backgroundColor: Theme.primary, borderRadius: 25, height: 50,
        justifyContent: 'center', alignItems: 'center', marginTop: 10,
        shadowColor: Theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
    },
    primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { color: Theme.textLight, fontSize: 14 },
    linkText: { color: Theme.primary, fontWeight: 'bold', fontSize: 14 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { backgroundColor: '#FFF', width: '80%', padding: 20, borderRadius: 20, alignItems: 'center' },
    successIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    modalText: { color: Theme.textLight },
});