import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Colors = { primary: '#FF3B30', background: '#F9F9F9', text: '#1F2937', inputBg: '#FFFFFF', border: '#E5E7EB' };

export default function BusinessDetails() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={Colors.text} /></TouchableOpacity>
                <Text style={styles.title}>Business Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>Business Name</Text>
                <TextInput style={styles.input} placeholder="Tharamac Agency" />
                <Text style={styles.label}>Designation</Text>
                <TextInput style={styles.input} placeholder="CEO / Manager" />
                <Text style={styles.label}>Website</Text>
                <TextInput style={styles.input} placeholder="www.yourbusiness.com" />
                <Text style={styles.label}>Address</Text>
                <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="123 Street, City, State" />
                <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnText}>Update Info</Text></TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.background,
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