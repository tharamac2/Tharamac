import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- THEME CONFIG ---
const Colors = {
    primary: '#FF3B30',       // Red
    secondary: '#000000',     // Black
    background: '#F8F9FA',    // Light Grey
    white: '#FFFFFF',
    text: '#1F2937',
    textLight: '#9CA3AF',
    gold: '#FFD700',
    cardShadow: 'rgba(0,0,0,0.05)',
};

// --- DATA ---
const MENU_ITEMS = [
    { id: 1, title: 'Edit Profile', icon: 'person-outline', type: 'Ionicons' },
    { id: 2, title: 'My Subscription', icon: 'diamond-stone', type: 'MaterialCommunityIcons', isPremium: true },
    { id: 3, title: 'Business Details', icon: 'briefcase-outline', type: 'Ionicons' },
    { id: 4, title: 'App Settings', icon: 'settings-outline', type: 'Ionicons' },
    { id: 5, title: 'Help & Support', icon: 'headset-outline', type: 'Ionicons' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80');

    const handleLogout = () => {
        router.replace('/(auth)/login');
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {/* ✅ FIXED: Translucent Status Bar for Premium Look */}
            <StatusBar 
                barStyle="light-content" 
                backgroundColor="transparent" 
                translucent={true} 
            />

            {/* --- RED HEADER BACKGROUND --- */}
            <View style={styles.headerBackground}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.headerNav}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                            <Ionicons name="arrow-back" size={24} color={Colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="settings-sharp" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 100 }}
                style={styles.scrollView}
            >
                {/* --- PROFILE CARD --- */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                            <Image source={{ uri: profileImage }} style={styles.avatar} />
                            <View style={styles.cameraBtn}>
                                <Ionicons name="camera" size={14} color={Colors.white} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.premiumBadge}>
                        <MaterialCommunityIcons name="crown" size={14} color={Colors.white} />
                        <Text style={styles.premiumText}>Premium Member</Text>
                    </View>

                    <Text style={styles.userName}>Tharamac User</Text>
                    <Text style={styles.userBio}>Digital Marketer | Chennai</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="image-outline" size={20} color={Colors.primary} />
                            <Text style={styles.statValue}>124</Text>
                            <Text style={styles.statLabel}>Designs</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="people-outline" size={20} color={Colors.primary} />
                            <Text style={styles.statValue}>85</Text>
                            <Text style={styles.statLabel}>Leads</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="bookmark-outline" size={20} color={Colors.primary} />
                            <Text style={styles.statValue}>40</Text>
                            <Text style={styles.statLabel}>Saved</Text>
                        </View>
                    </View>
                </View>

                {/* --- REFER BANNER --- */}
                <TouchableOpacity style={styles.bannerContainer}>
                    <View>
                        <Text style={styles.bannerTitle}>Refer & Earn</Text>
                        <Text style={styles.bannerSub}>Get 1 Month Premium Free</Text>
                    </View>
                    <View style={styles.bannerIcon}>
                        <Ionicons name="gift" size={24} color={Colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* --- MENU LIST --- */}
                <View style={styles.menuContainer}>
                    {MENU_ITEMS.map((item) => {
                        const IconComponent = item.type === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
                        return (
                            <TouchableOpacity key={item.id} style={styles.menuItem}>
                                <View style={[styles.menuIconBox, item.isPremium && { backgroundColor: '#FFF8E1' }]}>
                                    <IconComponent name={item.icon} size={22} color={item.isPremium ? '#F59E0B' : Colors.text} />
                                </View>
                                <Text style={styles.menuText}>{item.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                            </TouchableOpacity>
                        );
                    })}

                    <View style={styles.menuItem}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="moon-outline" size={22} color={Colors.text} />
                        </View>
                        <Text style={styles.menuText}>Dark Mode</Text>
                        <Switch 
                            value={isDarkMode} 
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: '#E5E7EB', true: Colors.primary }}
                            thumbColor={Colors.white}
                        />
                    </View>

                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="log-out-outline" size={22} color={Colors.primary} />
                        </View>
                        <Text style={[styles.menuText, { color: Colors.primary }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    
    // Header
    headerBackground: {
        backgroundColor: Colors.primary,
        height: 200, // Slightly taller to account for status bar
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
    },
    safeArea: {
        // ✅ FIXED: Adds padding on Android so content doesn't hide behind status bar
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0, 
    },
    headerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },

    // Main Content
    scrollView: {
        marginTop: -90, // Adjusted overlap
    },

    // Profile Card
    profileCard: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        borderRadius: 24,
        paddingVertical: 25,
        alignItems: 'center',
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: Colors.background,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F59E0B', 
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 10,
    },
    premiumText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    userBio: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: 4,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.textLight,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E5E7EB',
    },

    // Banner
    bannerContainer: {
        backgroundColor: '#E0F2FE', 
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0284C7',
    },
    bannerSub: {
        fontSize: 11,
        color: '#0EA5E9',
    },
    bannerIcon: {
        backgroundColor: Colors.white,
        padding: 8,
        borderRadius: 12,
    },

    // Menu
    menuContainer: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 24,
        padding: 10,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuIconBox: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text,
    },
});