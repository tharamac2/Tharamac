import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Colors = { primary: '#FF3B30', background: '#F9F9F9', text: '#1F2937', inputBg: '#FFFFFF', border: '#E5E7EB' };

export default function EditProfile() {
    const router = useRouter();
    const [name, setName] = useState('Tharamac User');
    const [email, setEmail] = useState('user@example.com');
    const [phone, setPhone] = useState('9876543210');

    return (
        <View style={styles.container}>
            {/* ✅ Fix: Translucent Status Bar */}
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Text style={styles.label}>Email Address</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.background,
        // ✅ Fix: Add padding for Android Status Bar
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 15 },
    input: { backgroundColor: Colors.inputBg, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, fontSize: 16 },
    saveBtn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});