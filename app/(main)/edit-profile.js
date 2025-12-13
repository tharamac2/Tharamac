import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UserContext } from '../../src/context/UserContext';

export default function EditProfile() {
    const router = useRouter();
    const { userData, setUserData, theme } = useContext(UserContext); // ✅ Get Theme

    const [name, setName] = useState(userData.name);
    // ... (rest of logic)

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.form}>
                <Text style={[styles.label, { color: theme.textLight }]}>Full Name</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} value={name} onChangeText={setName} />
                {/* ... other inputs use same style ... */}
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={() => router.back()}>
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 14, marginBottom: 8, marginTop: 15 },
    input: { padding: 15, borderRadius: 12, borderWidth: 1, fontSize: 16 },
    saveBtn: { padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});