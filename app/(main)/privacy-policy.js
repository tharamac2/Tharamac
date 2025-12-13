import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Colors = { primary: '#FF3B30', background: '#F9F9F9', text: '#1F2937' };

export default function PrivacyPolicyScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Status Bar Setup */}
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.lastUpdated}>Last Updated: December 2025</Text>

                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                    Welcome to Tharamac. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your personal information.
                </Text>

                <Text style={styles.sectionTitle}>2. Data Collection</Text>
                <Text style={styles.paragraph}>
                    We collect information such as your name, business details, and contact information to provide you with better services, including our template editing and lead management tools.
                </Text>

                <Text style={styles.sectionTitle}>3. Usage of Data</Text>
                <Text style={styles.paragraph}>
                    Your data is used to personalize your experience, process transactions, and improve our app functionality. We do not sell your data to third parties.
                </Text>

                <Text style={styles.sectionTitle}>4. Security</Text>
                <Text style={styles.paragraph}>
                    We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
                </Text>

                <Text style={styles.sectionTitle}>5. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions regarding this privacy policy, you may contact us using the information in the Help & Support section.
                </Text>
                
                <View style={{ height: 50 }} />
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
    backBtn: { padding: 5 },
    title: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
    content: { padding: 20 },
    lastUpdated: { fontSize: 12, color: '#888', marginBottom: 20, fontStyle: 'italic' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginTop: 15, marginBottom: 8 },
    paragraph: { fontSize: 14, color: '#555', lineHeight: 22, textAlign: 'justify' },
});