import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { UserContext } from '../../../src/context/UserContext';

export default function PlanDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // Receive plan details
    const params = useLocalSearchParams();
    const { planName, planNumber } = params;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor="transparent" translucent={true} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Plan Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Plan Banner */}
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80' }} 
                    style={styles.banner} 
                />

                {/* Plan Info */}
                <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.planName, { color: theme.text }]}>{planName}</Text>
                    <Text style={[styles.planNumber, { color: theme.primary }]}>{planNumber}</Text>
                    
                    <View style={styles.divider} />
                    
                    <Text style={[styles.description, { color: theme.textLight }]}>
                        This is a comprehensive insurance plan offering financial security and savings.
                        Ideal for long-term planning and family protection.
                    </Text>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: theme.primary }]}>
                    <Ionicons name="download-outline" size={20} color="#FFF" />
                    <Text style={styles.btnText}>Download Brochure</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.shareBtn, { borderColor: theme.primary }]}>
                    <Ionicons name="share-social-outline" size={20} color={theme.primary} />
                    <Text style={[styles.shareText, { color: theme.primary }]}>Share Plan</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    banner: { width: '100%', height: 200, borderRadius: 15, marginBottom: 20 },
    infoCard: { padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 },
    planName: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    planNumber: { fontSize: 16, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
    description: { fontSize: 14, lineHeight: 22 },
    downloadBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 15 },
    btnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
    shareBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
    shareText: { fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
});