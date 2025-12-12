import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Colors = { primary: '#FF3B30', background: '#F9F9F9' };

export default function HelpScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
                <Text style={styles.title}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.card}>
                    <Ionicons name="chatbubbles-outline" size={32} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Chat with Us</Text>
                    <Text style={styles.cardSub}>Start a live chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                    <Ionicons name="mail-outline" size={32} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Email Support</Text>
                    <Text style={styles.cardSub}>support@tharamac.com</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                    <Ionicons name="document-text-outline" size={32} color={Colors.primary} />
                    <Text style={styles.cardTitle}>FAQs</Text>
                    <Text style={styles.cardSub}>View common questions</Text>
                </TouchableOpacity>
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
    card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    cardSub: { color: '#888', fontSize: 12 },
});