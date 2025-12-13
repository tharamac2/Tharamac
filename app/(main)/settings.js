import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Keyboard, KeyboardAvoidingView,
    Modal, Platform,
    StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import { UserContext } from '../../src/context/UserContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext); // ✅ Get Theme
    const [notif, setNotif] = useState(true);
    const [sound, setSound] = useState(false);
    
    // Modal State
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    
    // ... (Keep existing password logic) ...

    const SettingItem = ({ label, value, onToggle }) => (
        <View style={[styles.item, { borderColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <Switch value={value} onValueChange={onToggle} trackColor={{ true: theme.primary }} />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionHeader}>General</Text>
                <SettingItem label="Push Notifications" value={notif} onToggle={setNotif} />
                <SettingItem label="App Sounds" value={sound} onToggle={setSound} />
                
                <Text style={styles.sectionHeader}>Security</Text>
                
                <TouchableOpacity style={[styles.linkItem, { borderColor: theme.border }]} onPress={() => setPasswordModalVisible(true)}>
                    <Text style={[styles.label, { color: theme.text }]}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={18} color={theme.textLight} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.linkItem, { borderColor: theme.border }]} onPress={() => router.push('/(main)/privacy-policy')}>
                    <Text style={[styles.label, { color: theme.text }]}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={18} color={theme.textLight} />
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal animationType="fade" transparent={true} visible={isPasswordModalVisible} onRequestClose={() => setPasswordModalVisible(false)}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        {/* Modal uses Surface Color */}
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Change Password</Text>
                            <Text style={[styles.modalSub, { color: theme.textLight }]}>Enter your details to update password.</Text>

                            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]} placeholder="Old Password" placeholderTextColor={theme.textLight} secureTextEntry />
                            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]} placeholder="New Password" placeholderTextColor={theme.textLight} secureTextEntry />
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={() => setPasswordModalVisible(false)}><Text style={{ color: theme.textLight, padding: 10 }}>Cancel</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]}><Text style={styles.saveText}>Update</Text></TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionHeader: { fontSize: 14, color: '#888', marginBottom: 10, marginTop: 20, fontWeight: '600' },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1 },
    linkItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, alignItems: 'center' },
    label: { fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', borderRadius: 20, padding: 25 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    modalSub: { fontSize: 14, marginBottom: 20 },
    input: { padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
    saveBtn: { padding: 15, borderRadius: 12, alignItems: 'center' },
    saveText: { color: '#FFF', fontWeight: 'bold' },
});