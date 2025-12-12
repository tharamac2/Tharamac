import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// --- 1. THEME CONFIG (Updated to Red/White) ---
const Colors = {
    primary: '#FF3B30',       // The trendy Red color
    secondary: '#000000',     // Black for contrast
    background: '#F9F9F9',    // Clean White/Grey Background
    white: '#FFFFFF',
    text: '#1F2937',
    textLight: '#9CA3AF',
    cardDark: '#1C1C1E',      // Dark card background
    gold: '#FFD700',          // Accent for offers
};

const { width } = Dimensions.get('window');

// --- 2. DATA (Kept same logic, just updated for UI) ---
const MODULES = [
    { id: 'lead', title: 'Leads', icon: 'server-network', type: 'MaterialCommunityIcons' },
    { id: 'poster', title: 'Posters', icon: 'palette', type: 'Ionicons' },
    { id: 'hisab', title: 'Hisab', icon: 'calculator', type: 'Ionicons' },
    { id: 'greetings', title: 'Greetings', icon: 'volume-high', type: 'Ionicons' },
    { id: 'video', title: 'Videos', icon: 'videocam', type: 'Ionicons' },
    { id: 'frames', title: 'Frames', icon: 'crop-free', type: 'MaterialCommunityIcons' },
    { id: 'certificate', title: 'Certificates', icon: 'certificate', type: 'MaterialCommunityIcons' },
    { id: 'training', title: 'Training', icon: 'megaphone', type: 'Ionicons' },
];

const SPECIAL_OFFER = {
    title: 'Get Special Offer',
    discount: '40%',
    image: 'https://via.placeholder.com/150/000000/FFFFFF?text=Offer', // Replace with your girl image
};

const FESTIVALS_DATA = [
    { id: 1, title: 'Diwali', date: '12 Nov', image: 'https://via.placeholder.com/100/FF6347/FFFFFF?text=Diwali' },
    { id: 2, title: 'Holi', date: '25 Mar', image: 'https://via.placeholder.com/100/FFC0CB/FFFFFF?text=Holi' },
    { id: 3, title: 'Eid', date: '10 Apr', image: 'https://via.placeholder.com/100/4CAF50/FFFFFF?text=Eid' },
];

// --- 3. SUB-COMPONENTS ---

// Red Header with Location & Notification
const Header = () => (
    <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
            <View>
                <Text style={styles.locationLabel}>Location</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={16} color={Colors.white} />
                    <Text style={styles.locationText}> New York, USA</Text>
                    <Ionicons name="chevron-down" size={16} color={Colors.white} />
                </View>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
                <Ionicons name="notifications" size={20} color={Colors.white} />
                <View style={styles.badge} />
            </TouchableOpacity>
        </View>

        {/* Search Bar (Overlapping) */}
        <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.textLight} />
                <TextInput 
                    placeholder="Search..." 
                    placeholderTextColor={Colors.textLight}
                    style={styles.searchInput}
                />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
        </View>
    </View>
);

// SpecialForYou Card (The Black Card)
const SpecialOfferCard = () => (
    <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special For You</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <View style={styles.offerCard}>
            <View style={styles.offerContent}>
                <View style={styles.limitedTag}>
                    <Text style={styles.limitedText}>Limited time!</Text>
                </View>
                <Text style={styles.offerTitle}>{SPECIAL_OFFER.title}</Text>
                <Text style={styles.offerDiscount}>Up to {SPECIAL_OFFER.discount}</Text>
                <TouchableOpacity style={styles.claimBtn}>
                    <Text style={styles.claimText}>Claim</Text>
                </TouchableOpacity>
            </View>
            <Image 
                source={{ uri: 'https://img.freepik.com/free-photo/portrait-expressive-young-woman-posing_23-2149021815.jpg' }} 
                style={styles.offerImage} 
            />
        </View>
    </View>
);

// Circular Category Item
const CategoryItem = ({ item, onPress }) => {
    const IconComponent = item.type === 'Ionicons' ? Ionicons : (item.type === 'MaterialCommunityIcons' ? MaterialCommunityIcons : FontAwesome);
    return (
        <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
            <View style={styles.iconCircle}>
                <IconComponent name={item.icon} size={24} color={Colors.primary} />
            </View>
            <Text style={styles.categoryLabel}>{item.title}</Text>
        </TouchableOpacity>
    );
};

// --- 4. MAIN SCREEN ---
export default function HomeScreen() {
    const router = useRouter();

    const handleNavigation = (route) => {
        console.log("Navigating to", route);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                
                {/* 1. Big Red Header */}
                <Header />

                {/* Spacer because Search bar overlaps */}
                <View style={{ marginTop: 20 }} />

                {/* 2. Special Offer Card */}
                <SpecialOfferCard />

                {/* 3. Categories (Grid) */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Category</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                    </View>
                    <View style={styles.categoriesGrid}>
                        {MODULES.map((item) => (
                            <CategoryItem key={item.id} item={item} onPress={() => handleNavigation(item.id)} />
                        ))}
                    </View>
                </View>

                {/* 4. Flash Sale / Festivals */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Flash Sale</Text>
                        <View style={styles.timerTag}>
                            <Text style={styles.timerText}>Closing in: 02:12:56</Text>
                        </View>
                    </View>
                    
                    {/* Filter Pills */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
                        <TouchableOpacity style={[styles.pill, styles.activePill]}><Text style={styles.activePillText}>All</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>Newest</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>Popular</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>Clothes</Text></TouchableOpacity>
                    </ScrollView>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
                        {FESTIVALS_DATA.map((item) => (
                            <View key={item.id} style={styles.flashCard}>
                                <Image source={{ uri: item.image }} style={styles.flashImage} />
                                <TouchableOpacity style={styles.heartBtn}>
                                    <Ionicons name="heart-outline" size={16} color={Colors.primary} />
                                </TouchableOpacity>
                                <Text style={styles.flashTitle}>{item.title}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            {/* 5. Custom Bottom Tab Bar (Floating) */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomBarItem}>
                    <View style={styles.activeIconBg}><Ionicons name="home" size={20} color={Colors.primary} /></View>
                    <Text style={[styles.bottomLabel, { color: Colors.primary }]}>Home</Text>
                </View>
                <View style={styles.bottomBarItem}><Ionicons name="heart-outline" size={24} color="#999" /><Text style={styles.bottomLabel}>Wishlist</Text></View>
                <View style={styles.bottomBarItem}><Ionicons name="cart-outline" size={24} color="#999" /><Text style={styles.bottomLabel}>Cart</Text></View>
                <View style={styles.bottomBarItem}><Ionicons name="chatbubble-outline" size={24} color="#999" /><Text style={styles.bottomLabel}>Chat</Text></View>
                <View style={styles.bottomBarItem}><Ionicons name="person-outline" size={24} color="#999" /><Text style={styles.bottomLabel}>Profile</Text></View>
            </View>
        </View>
    );
}

// --- 5. STYLES ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    
    // Header
    headerContainer: {
        backgroundColor: Colors.primary,
        paddingTop: 50, // Safe area
        paddingBottom: 30, // Space for search bar overlap
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    locationLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    locationText: { color: Colors.white, fontSize: 16, fontWeight: '600', marginRight: 5 },
    notificationBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
    badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: Colors.gold, borderRadius: 4 },

    // Search Bar
    searchWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: -50 }, // Negative margin to overlap
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 12,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: Colors.text },
    filterBtn: {
        marginLeft: 10,
        width: 50, height: 50,
        backgroundColor: Colors.white,
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 12,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },

    // Sections
    sectionContainer: { marginTop: 25, paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
    seeAll: { color: Colors.primary, fontSize: 13, fontWeight: '600' },

    // Special Offer Card
    offerCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: 20,
        height: 160,
        flexDirection: 'row',
        overflow: 'hidden',
        padding: 20,
    },
    offerContent: { flex: 1, justifyContent: 'center' },
    limitedTag: { backgroundColor: Colors.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 },
    limitedText: { fontSize: 10, fontWeight: 'bold' },
    offerTitle: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
    offerDiscount: { color: Colors.white, fontSize: 24, fontWeight: 'bold', marginVertical: 5 },
    claimBtn: { backgroundColor: Colors.primary, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'flex-start' },
    claimText: { color: Colors.white, fontWeight: 'bold', fontSize: 12 },
    offerImage: { width: 120, height: 160, resizeMode: 'cover', position: 'absolute', right: -20, bottom: -20 },

    // Categories
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryItem: { width: '22%', alignItems: 'center', marginBottom: 15 },
    iconCircle: {
        width: 55, height: 55,
        backgroundColor: '#FFF0F0', // Very light red
        borderRadius: 27.5,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 8,
    },
    categoryLabel: { fontSize: 12, color: Colors.text, textAlign: 'center', fontWeight: '500' },

    // Flash Sale
    timerTag: { flexDirection: 'row', alignItems: 'center' },
    timerText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
    pillScroll: { marginBottom: 15 },
    pill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E5E5', marginRight: 10 },
    activePill: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    pillText: { color: Colors.textLight },
    activePillText: { color: Colors.white, fontWeight: 'bold' },
    
    flashCard: { width: 140, marginRight: 15, backgroundColor: Colors.white, padding: 10, borderRadius: 15, elevation: 2 },
    flashImage: { width: 120, height: 100, borderRadius: 10, alignSelf: 'center' },
    flashTitle: { marginTop: 10, fontWeight: 'bold', fontSize: 14 },
    heartBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.white, padding: 5, borderRadius: 15, elevation: 2 },

    // Bottom Bar
    bottomBar: {
        position: 'absolute', bottom: 20, left: 20, right: 20,
        backgroundColor: Colors.white,
        borderRadius: 25,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
    },
    bottomBarItem: { alignItems: 'center' },
    activeIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
    bottomLabel: { fontSize: 10, color: '#999' },
});