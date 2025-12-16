import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router'; // ✅ Added useFocusEffect
import { useCallback, useContext } from 'react'; // ✅ Added useCallback
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// ✅ Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the Context
import { UserContext } from '../../src/context/UserContext';

const MENU_ITEMS = [
    { id: 1, title: 'Edit Profile', icon: 'person-outline', type: 'Ionicons', route: '/(main)/edit-profile' },
    { id: 2, title: 'My Subscription', icon: 'crown', type: 'MaterialCommunityIcons', isPremium: true, route: '/(main)/subscription' },
    { id: 3, title: 'Business Details', icon: 'briefcase-outline', type: 'Ionicons', route: '/(main)/business-details' },
    { id: 4, title: 'App Settings', icon: 'settings-outline', type: 'Ionicons', route: '/(main)/settings' },
    { id: 5, title: 'Help & Support', icon: 'headset-outline', type: 'Ionicons', route: '/(main)/help' },
];

export default function ProfileScreen() {
    const router = useRouter();
    // Get live data from Context
    const { userData, setUserData, theme } = useContext(UserContext);

    // ✅ UPDATED: Fetch data from AsyncStorage when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            const loadProfileData = async () => {
                try {
                    const jsonValue = await AsyncStorage.getItem('userSession');
                    if (jsonValue != null) {
                        const savedUser = JSON.parse(jsonValue);
                        // Update the Context with the saved data
                        setUserData(prev => ({
                            ...prev,
                            name: savedUser.name || prev.name,
                            businessName: savedUser.businessName || prev.businessName,
                            phone: savedUser.phone || prev.phone
                        }));
                    }
                } catch (e) {
                    console.error("Failed to load profile", e);
                }
            };
            loadProfileData();
        }, [])
    );

    const handleLogout = async () => {
        // Optional: Clear session on logout
        // await AsyncStorage.removeItem('userSession'); 
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
            setUserData({ ...userData, profileImage: result.assets[0].uri });
        }
    };

    // Dynamic Styles based on Theme
    const dynamicStyles = {
        container: { backgroundColor: theme.background },
        headerBackground: { backgroundColor: theme.headerBg || theme.primary },
        text: { color: theme.text },
        textLight: { color: theme.textLight },
        card: { backgroundColor: theme.surface },
        menuIconBg: '#F3F4F6' 
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <StatusBar 
                barStyle={theme.statusBarStyle} 
                backgroundColor="transparent" 
                translucent={true} 
            />

            <View style={[styles.headerBackground, dynamicStyles.headerBackground]}>
                <View style={styles.headerNav}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    
                    {/* Settings Button Navigation */}
                    <TouchableOpacity 
                        style={styles.iconBtn} 
                        onPress={() => router.push('/(main)/settings')}
                    >
                        <Ionicons name="settings-sharp" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} style={styles.scrollView}>
                
                {/* Profile Card */}
                <View style={[styles.profileCard, dynamicStyles.card]}>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                            <Image source={{ uri: userData.profileImage }} style={[styles.avatar, { borderColor: theme.background }]} />
                            <View style={styles.cameraBtn}>
                                <Ionicons name="camera" size={14} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.premiumBadge}>
                        <MaterialCommunityIcons name="crown" size={14} color="#FFF" />
                        <Text style={styles.premiumText}>Premium Member</Text>
                    </View>

                    {/* ✅ UPDATED: Display Name and Business from Context (which is updated by AsyncStorage) */}
                    <Text style={[styles.userName, dynamicStyles.text]}>{userData.name || 'User'}</Text>
                    <Text style={[styles.userBio, dynamicStyles.textLight]}>{userData.businessName || 'Business Name'}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="image-outline" size={20} color={theme.primary} />
                            <Text style={[styles.statValue, dynamicStyles.text]}>124</Text>
                            <Text style={[styles.statLabel, dynamicStyles.textLight]}>Designs</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Ionicons name="people-outline" size={20} color={theme.primary} />
                            <Text style={[styles.statValue, dynamicStyles.text]}>85</Text>
                            <Text style={[styles.statLabel, dynamicStyles.textLight]}>Leads</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Ionicons name="bookmark-outline" size={20} color={theme.primary} />
                            <Text style={[styles.statValue, dynamicStyles.text]}>40</Text>
                            <Text style={[styles.statLabel, dynamicStyles.textLight]}>Saved</Text>
                        </View>
                    </View>
                </View>

                {/* Menu List */}
                <View style={[styles.menuContainer, dynamicStyles.card]}>
                    {MENU_ITEMS.map((item) => {
                        const IconComponent = item.type === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
                        return (
                            <TouchableOpacity key={item.id} style={[styles.menuItem, { borderBottomColor: theme.border }]} onPress={() => router.push(item.route)}>
                                <View style={[styles.menuIconBox, { backgroundColor: dynamicStyles.menuIconBg }]}>
                                    <IconComponent name={item.icon} size={22} color={item.isPremium ? '#F59E0B' : theme.text} />
                                </View>
                                <Text style={[styles.menuText, dynamicStyles.text]}>{item.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color={theme.textLight} />
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuText, { color: '#EF4444' }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerBackground: { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 30) + 20 : 60, paddingBottom: 80, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    iconBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
    scrollView: { marginTop: -60 },
    profileCard: { marginHorizontal: 20, borderRadius: 24, paddingVertical: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    avatarContainer: { position: 'relative', marginBottom: 10 },
    avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3 },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FF3B30', padding: 6, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
    premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
    premiumText: { fontSize: 10, fontWeight: 'bold' },
    userName: { fontSize: 20, fontWeight: 'bold' },
    userBio: { fontSize: 12, marginBottom: 20 },
    statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 10 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
    statLabel: { fontSize: 11 },
    statDivider: { width: 1, height: 30 },
    menuContainer: { marginHorizontal: 20, marginTop: 20, borderRadius: 24, padding: 10, marginBottom: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1 },
    menuIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuText: { flex: 1, fontSize: 15, fontWeight: '500' },
});