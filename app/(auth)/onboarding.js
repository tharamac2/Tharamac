import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ IMPORT API URL
import { API_BASE_URL } from '../../src/config/ApiConfig';

// ✅ BRAND THEME
const THEME = {
    primary: '#ff3b30ff',       // Main Purple (Same as Register/Home)
    primaryDark: '#ff3b30ff',
    background: '#F9FAFB',    
    surface: '#FFFFFF',       
    text: '#1F2937',          
    textLight: '#6B7280',     
    border: '#E5E7EB',        
    inputBg: '#F3F4F6',       
};

export default function OnboardingScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userPhone, setUserPhone] = useState('');

    // Form State
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [compPhone, setCompPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [logo, setLogo] = useState(null);

    const [selfName, setSelfName] = useState('');
    const [designation, setDesignation] = useState('');
    const [photo, setPhoto] = useState(null);
    const [selfEmail, setSelfEmail] = useState('');
    
    // Load User Data
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('userSession');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    setUserPhone(parsed.phone);
                    setCompanyName(parsed.businessName || '');
                    setSelfName(parsed.name || '');
                    setCompPhone(parsed.phone || '');
                }
            } catch (e) {
                console.error("Failed to load user session");
            }
        };
        loadUser();
    }, []);

    // Pick Image
    const pickImage = async (setFunction) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFunction(result.assets[0].uri);
        }
    };

    // Save Data Function
    const handleReview = async () => {
        if (!companyName || !selfName) {
            Alert.alert("Missing Info", "Please fill Company Name and Name.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        
        formData.append('user_phone', userPhone);
        formData.append('company_name', companyName);
        formData.append('company_address', address);
        formData.append('company_phone', compPhone);
        formData.append('website', website);
        formData.append('self_name', selfName);
        formData.append('designation', designation);
        formData.append('self_email', selfEmail);
        formData.append('save_format', 'PNG');

        if (logo) {
            let filename = logo.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image/jpeg`;
            formData.append('logo', { uri: logo, name: filename, type });
        }
        if (photo) {
            let filename = photo.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image/jpeg`;
            formData.append('photo', { uri: photo, name: filename, type });
        }

        try {
            const response = await fetch(`${API_BASE_URL}/save_onboarding.php`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const result = await response.json();

            if (result.status === 'success') {
                Alert.alert("Success", "Profile Setup Complete!");
                router.replace('/(main)/home'); 
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network request failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
            
            {/* Header */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    
                    <Text style={styles.headerTitle}>Business Profile</Text>
                    
                    {/* ✅ Save button removed from here, an empty view keeps layout balanced */}
                    <View style={{ width: 24 }} /> 
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* --- COMPANY CARD --- */}
                <View style={styles.card}>
                    <SectionTitle icon="business" title="Company Details" />
                    
                    <InputField label="Company Name" value={companyName} onChangeText={setCompanyName} placeholder="Ex: Tharamac Digitals" />
                    
                    <Text style={styles.label}>Company Logo</Text>
                    <TouchableOpacity style={styles.imageUploadBox} onPress={() => pickImage(setLogo)}>
                        {logo ? (
                            <Image source={{ uri: logo }} style={styles.uploadedImage} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Ionicons name="cloud-upload-outline" size={32} color={THEME.primary} />
                                <Text style={styles.uploadText}>Tap to Upload Logo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Full Address" multiline />
                    <InputField label="Business Phone" value={compPhone} onChangeText={setCompPhone} keyboardType="phone-pad" placeholder="+91 98765 43210" />
                    <InputField label="Website" value={website} onChangeText={setWebsite} placeholder="www.yourwebsite.com" />
                </View>

                {/* --- SELF CARD --- */}
                <View style={styles.card}>
                    <SectionTitle icon="person" title="Personal Details" />

                    <InputField label="Your Name" value={selfName} onChangeText={setSelfName} placeholder="John Doe" />
                    <InputField label="Designation" value={designation} onChangeText={setDesignation} placeholder="Ex: CEO / Manager" />

                    <Text style={styles.label}>Your Photo</Text>
                    <TouchableOpacity style={styles.imageUploadBox} onPress={() => pickImage(setPhoto)}>
                        {photo ? (
                            <Image source={{ uri: photo }} style={styles.uploadedImage} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Ionicons name="camera-outline" size={32} color={THEME.primary} />
                                <Text style={styles.uploadText}>Tap to Upload Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <InputField label="Email" value={selfEmail} onChangeText={setSelfEmail} keyboardType="email-address" placeholder="email@example.com" />
                </View>

                {/* --- SETTINGS CARD --- */}
                <View style={styles.card}>
                    <SectionTitle icon="settings" title="Preferences" />
                    
                    <View style={styles.rowItem}>
                        <Text style={styles.rowLabel}>Save Format</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>PNG</Text>
                        </View>
                    </View>
                    
                    <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
                        <Text style={styles.rowLabel}>Enable Notifications</Text>
                        <Ionicons name="checkbox" size={24} color={THEME.primary} />
                    </View>
                </View>

                {/* Bottom Action Button */}
                <TouchableOpacity style={styles.mainButton} onPress={handleReview} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainButtonText}>Save & Continue</Text>}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

// --- Reusable Components ---

const SectionTitle = ({ icon, title }) => (
    <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
            <Ionicons name={icon} size={18} color={THEME.primary} />
        </View>
        <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
);

const InputField = ({ label, value, onChangeText, placeholder, multiline, keyboardType }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput 
            style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]} 
            value={value} 
            onChangeText={onChangeText} 
            placeholder={placeholder}
            placeholderTextColor={THEME.textLight}
            multiline={multiline}
            keyboardType={keyboardType}
        />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    
    // Header
    header: { backgroundColor: THEME.primary, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    iconBtn: { padding: 5 },

    // Content
    scrollContent: { padding: 16 },

    // Card Style
    card: {
        backgroundColor: THEME.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    // Section Header
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    sectionTitleText: { fontSize: 16, fontWeight: 'bold', color: THEME.text },

    // Inputs
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 13, fontWeight: '600', color: THEME.text, marginBottom: 6 },
    input: {
        backgroundColor: THEME.inputBg,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: THEME.text,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    // Image Upload
    imageUploadBox: {
        height: 120,
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        overflow: 'hidden'
    },
    uploadPlaceholder: { alignItems: 'center' },
    uploadText: { marginTop: 8, fontSize: 12, color: THEME.primary, fontWeight: '600' },
    uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    // Settings Row
    rowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    rowLabel: { fontSize: 14, color: THEME.text },
    badge: { backgroundColor: '#E0E7FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 12, color: THEME.primary, fontWeight: 'bold' },

    // Main Button
    mainButton: {
        backgroundColor: THEME.primary,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    mainButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});