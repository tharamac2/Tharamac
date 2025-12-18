import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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

// ✅ Brand Colors (Purple)
const Colors = { 
    primary: '#7C3AED', 
    background: '#F9FAFB', 
    text: '#1F2937', 
    textLight: '#6B7280',
    inputBg: '#FFFFFF', 
    border: '#E5E7EB',
    surface: '#FFFFFF'
};

export default function BusinessDetails() {
    const router = useRouter();

    // --- State Variables for All Fields ---
    const [companyName, setCompanyName] = useState('');
    const [logo, setLogo] = useState(null);
    const [address, setAddress] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [website, setWebsite] = useState('');

    const [selfName, setSelfName] = useState('');
    const [designation, setDesignation] = useState('');
    const [photo, setPhoto] = useState(null);
    const [selfPhone, setSelfPhone] = useState('');
    const [email, setEmail] = useState('');

    // --- Image Picker ---
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

    const handleSave = () => {
        // Add your API save logic here
        Alert.alert("Success", "Business details updated!");
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Business Profile</Text>
                <View style={{ width: 24 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                
                {/* --- COMPANY SECTION --- */}
                <View style={styles.sectionContainer}>
                    <SectionHeader title="Company Details" icon="business" />

                    <InputField label="Company Name" value={companyName} onChangeText={setCompanyName} placeholder="Ex: Tharamac Digitals" />
                    
                    {/* Logo Upload */}
                    <Text style={styles.label}>Company Logo</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setLogo)}>
                        {logo ? (
                            <Image source={{ uri: logo }} style={styles.uploadedImg} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="cloud-upload-outline" size={28} color={Colors.primary} />
                                <Text style={styles.placeholderText}>Upload Logo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Full Address" multiline />
                    <InputField label="Company Phone" value={companyPhone} onChangeText={setCompanyPhone} keyboardType="phone-pad" placeholder="+91 98765 43210" />
                    <InputField label="Website" value={website} onChangeText={setWebsite} placeholder="www.yourwebsite.com" />
                </View>

                {/* --- SELF SECTION --- */}
                <View style={styles.sectionContainer}>
                    <SectionHeader title="Personal Details" icon="person" />

                    <InputField label="Your Name" value={selfName} onChangeText={setSelfName} placeholder="John Doe" />
                    <InputField label="Designation" value={designation} onChangeText={setDesignation} placeholder="Ex: CEO / Manager" />

                    {/* Photo Upload */}
                    <Text style={styles.label}>Your Photo</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setPhoto)}>
                        {photo ? (
                            <Image source={{ uri: photo }} style={styles.uploadedImg} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="camera-outline" size={28} color={Colors.primary} />
                                <Text style={styles.placeholderText}>Upload Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <InputField label="Your Phone" value={selfPhone} onChangeText={setSelfPhone} keyboardType="phone-pad" placeholder="+91 98765 43210" />
                    <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="email@example.com" />
                </View>

                {/* --- SAVE BUTTON --- */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Update Profile</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

// --- Helper Components ---
const InputField = ({ label, value, onChangeText, placeholder, multiline, keyboardType }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput 
            style={[styles.input, multiline && styles.textArea]} 
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline={multiline}
            keyboardType={keyboardType}
        />
    </View>
);

const SectionHeader = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={20} color={Colors.primary} style={{ marginRight: 8 }} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 20, 
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
    
    form: { padding: 16 },

    // Sections
    sectionContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 8
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },

    // Inputs
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 13, color: Colors.text, marginBottom: 6, fontWeight: '600' },
    input: { 
        backgroundColor: Colors.background, 
        padding: 12, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: Colors.border, 
        fontSize: 14,
        color: Colors.text 
    },
    textArea: { height: 80, textAlignVertical: 'top' },

    // Images
    imageBox: {
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
    placeholder: { alignItems: 'center' },
    placeholderText: { marginTop: 6, fontSize: 12, color: Colors.primary, fontWeight: '600' },
    uploadedImg: { width: '100%', height: '100%', resizeMode: 'cover' },

    // Button
    saveBtn: { 
        backgroundColor: Colors.primary, 
        padding: 16, 
        borderRadius: 30, 
        alignItems: 'center', 
        marginBottom: 20,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOpacity: 0.3
    },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});