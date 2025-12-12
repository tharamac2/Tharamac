import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Colors = { primary: '#FF3B30', background: '#111', card: '#1C1C1E', text: '#FFF', gold: '#FFD700' };

export default function SubscriptionScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* ✅ Fix: Light content for dark background */}
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Plan</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Current Plan Card */}
                <View style={styles.currentPlanCard}>
                    <View style={styles.planBadge}><Text style={styles.badgeText}>CURRENT</Text></View>
                    <Text style={styles.planName}>Gold Plan</Text>
                    <Text style={styles.expiry}>Expires on: 25 Dec 2025</Text>
                    <View style={styles.divider} />
                    <View style={styles.featureRow}><Ionicons name="checkmark-circle" color={Colors.gold} size={18} /><Text style={styles.featureText}>Unlimited Posters</Text></View>
                    <View style={styles.featureRow}><Ionicons name="checkmark-circle" color={Colors.gold} size={18} /><Text style={styles.featureText}>No Watermark</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Upgrade Options</Text>
                
                {/* Upgrade Card */}
                <View style={styles.upgradeCard}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="crown" size={24} color={Colors.primary} />
                        <Text style={styles.upgradeName}>Platinum Plan</Text>
                    </View>
                    <Text style={styles.price}>₹1499<Text style={styles.year}>/year</Text></Text>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Upgrade Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    headerTitle: { color: Colors.text, fontSize: 18, fontWeight: 'bold' },
    currentPlanCard: { backgroundColor: '#2C0E37', padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: '#5B21B6' },
    planBadge: { backgroundColor: '#5B21B6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
    badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    planName: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    expiry: { color: '#A78BFA', fontSize: 14, marginBottom: 15 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 15 },
    featureRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
    featureText: { color: '#DDD', marginLeft: 8 },
    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    upgradeCard: { backgroundColor: Colors.card, padding: 20, borderRadius: 16, marginBottom: 15 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    upgradeName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    price: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    year: { fontSize: 14, color: '#888' },
    btn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, marginTop: 15, alignItems: 'center' },
    btnText: { color: '#FFF', fontWeight: 'bold' },
});