import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const Colors = { primary: '#FF3B30', background: '#F9F9F9' };

export default function SettingsScreen() {
    const router = useRouter();
    const [notif, setNotif] = useState(true);
    const [sound, setSound] = useState(false);

    const SettingItem = ({ label, value, onToggle }) => (
        <View style={styles.item}>
            <Text style={styles.label}>{label}</Text>
            <Switch value={value} onValueChange={onToggle} trackColor={{ true: Colors.primary }} />
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionHeader}>General</Text>
                <SettingItem label="Push Notifications" value={notif} onToggle={setNotif} />
                <SettingItem label="App Sounds" value={sound} onToggle={setSound} />
                <Text style={styles.sectionHeader}>Security</Text>
                <TouchableOpacity style={styles.linkItem}><Text>Change Password</Text><Ionicons name="chevron-forward" size={18} color="#999" /></TouchableOpacity>
                <TouchableOpacity style={styles.linkItem}><Text>Privacy Policy</Text><Ionicons name="chevron-forward" size={18} color="#999" /></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionHeader: { fontSize: 14, color: '#888', marginBottom: 10, marginTop: 20, fontWeight: '600' },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#EEE' },
    label: { fontSize: 16 },
    linkItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#EEE' },
});