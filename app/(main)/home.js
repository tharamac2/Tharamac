import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
// ✅ Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import Context
import { UserContext } from '../../src/context/UserContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const { width, height } = Dimensions.get('window');

// --- 1. STATIC COLORS ---
const Colors = {
    primary: '#ff3b30ff',       // Red
    secondary: '#000000',     // Black
    white: '#FFFFFF',
    cardDark: '#1C1C1E',      
    premiumBg: '#2C0E37',     
    gold: '#FFD700',
    silver: '#C0C0C0',
    platinum: '#E5E4E2',
    lightRed: '#FFF0F0',
    navBarBg: '#111111',
};

// --- 2. DATA ---
const STORIES_DATA = [
    { id: 1, title: 'New', image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Offers', image: 'https://images.unsplash.com/photo-1572584642822-6f8de0243c93?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Diwali', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Winners', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80' },
    { id: 5, title: 'Updates', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80' },
];

const MODULES = [
    { id: 'poster', title: 'Posters', icon: 'palette', type: 'Ionicons' },
    { id: 'video', title: 'Videos', icon: 'videocam', type: 'Ionicons' },
    { id: 'greetings', title: 'Greetings', icon: 'sunny', type: 'Ionicons' },
    { id: 'brochures', title: 'Brochures', icon: 'newspaper', type: 'Ionicons' },
    { id: 'lic', title: 'LIC Plans', icon: 'shield-checkmark', type: 'Ionicons' },
    { id: 'business_card', title: 'Business', icon: 'card', type: 'Ionicons' },
    { id: 'motivation', title: 'Motivation', icon: 'bulb', type: 'Ionicons' },
    { id: 'certificate', title: 'Certificates', icon: 'ribbon', type: 'Ionicons' },
];

const SPECIAL_SCROLL_ITEMS = [
    { 
        id: 1, 
        title: 'Premium Posters', 
        subtitle: 'Get 50% Off Today', 
        btnText: 'Claim', 
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=200&q=80' 
    },
    { 
        id: 2, 
        title: 'Daily Greetings', 
        subtitle: 'New Templates Added', 
        btnText: 'View', 
        image: 'https://images.unsplash.com/photo-1490349368154-73de9c9bc37c?auto=format&fit=crop&w=200&q=80' 
    },
    { 
        id: 3, 
        title: 'LIC Brochures', 
        subtitle: 'Professional Layouts', 
        btnText: 'Explore', 
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&q=80' 
    },
    { 
        id: 4, 
        title: 'Certificates', 
        subtitle: 'Award Designs', 
        btnText: 'Create', 
        image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=200&q=80' 
    },
];

const SUBSCRIPTION_PLANS = [
    { id: 'silver', name: 'Silver Plan', price: '₹499/mo', color: Colors.silver, features: ['50 Premium Posters', 'No Watermark', 'Basic Support'] },
    { id: 'gold', name: 'Gold Plan', price: '₹999/mo', color: Colors.gold, features: ['Unlimited Posters', 'Video Maker Access', 'Priority Support', 'No Ads'] },
    { id: 'platinum', name: 'Platinum Plan', price: '₹1499/mo', color: Colors.platinum, features: ['All Gold Features', 'Source Files Included', 'Personal Account Manager', 'Custom Branding'] },
];

// --- 3. SUB-COMPONENTS ---

const Header = () => {
    const { userData, theme } = useContext(UserContext);
    const [greeting, setGreeting] = useState('');
    // ✅ UPDATED: Local state for display name
    const [displayName, setDisplayName] = useState(userData.name);

    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good Morning ☀️';
            if (hour < 17) return 'Good Afternoon 🌤️';
            return 'Good Evening 🌙';
        };
        setGreeting(getGreeting());
    }, []);

    // ✅ UPDATED: Fetch name from storage when Header loads
    useFocusEffect(
        useCallback(() => {
            const fetchUserName = async () => {
                try {
                    const jsonValue = await AsyncStorage.getItem('userSession');
                    if (jsonValue != null) {
                        const user = JSON.parse(jsonValue);
                        if(user.name) setDisplayName(user.name);
                    }
                } catch(e) {
                    console.log(e);
                }
            };
            fetchUserName();
        }, [])
    );

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTopRow}>
                <View style={styles.profileContainer}>
                    <Image source={{ uri: userData.profileImage }} style={styles.headerProfileImage} />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.welcomeLabel}>{greeting}</Text>
                        {/* ✅ UPDATED: Show fetched name */}
                        <Text style={styles.userNameText}>{displayName || 'Tharamac User'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <Ionicons name="notifications" size={20} color={Colors.white} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <View style={[styles.searchWrapper, { marginTop: 15 }]}>
                <View style={[styles.searchContainer, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="search" size={20} color={theme.textLight} />
                    <TextInput 
                        placeholder="Search..." 
                        placeholderTextColor={theme.textLight} 
                        style={[styles.searchInput, { color: theme.text }]} 
                    />
                </View>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="options-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const StoryViewer = ({ story, onClose }) => {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 15000, 
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                onClose(); 
            }
        });
    }, []);

    if (!story) return null;

    const widthInterpolated = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Modal animationType="fade" transparent={false} visible={true}>
            <View style={styles.fullStoryContainer}>
                <StatusBar hidden />
                <View style={styles.progressBarContainer}>
                    <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
                </View>
                <View style={styles.storyHeader}>
                    <View style={styles.storyUser}>
                        <Image source={{ uri: story.image }} style={styles.storyUserImage} />
                        <Text style={styles.storyUserName}>{story.title}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeStoryBtn}>
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Image source={{ uri: story.image }} style={styles.fullStoryImage} resizeMode="cover" />
            </View>
        </Modal>
    );
};

const StoriesSection = ({ onStoryPress, theme }) => (
    <View style={styles.storiesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
            {STORIES_DATA.map((story) => (
                <TouchableOpacity key={story.id} style={styles.storyItem} onPress={() => onStoryPress(story)}>
                    <View style={[styles.storyCircle, { borderColor: Colors.primary }]}>
                        <Image source={{ uri: story.image }} style={styles.storyImage} />
                    </View>
                    <Text style={[styles.storyLabel, { color: theme.text }]}>{story.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const SpecialScrollSection = ({ theme }) => (
    <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>#SpecialForYou</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            {SPECIAL_SCROLL_ITEMS.map((item) => (
                <View key={item.id} style={styles.scrollCard}>
                    <View style={styles.scrollCardContent}>
                        <View style={styles.limitedTag}>
                            <Text style={styles.limitedText}>Limited!</Text>
                        </View>
                        <Text style={styles.scrollTitle}>{item.title}</Text>
                        <Text style={styles.scrollSubtitle}>{item.subtitle}</Text>
                        <TouchableOpacity style={styles.claimBtn}>
                            <Text style={styles.claimText}>{item.btnText}</Text>
                        </TouchableOpacity>
                    </View>
                    <Image source={{ uri: item.image }} style={styles.scrollImage} />
                </View>
            ))}
        </ScrollView>
    </View>
);

const CategoryItem = ({ item, onPress, theme }) => {
    const IconComponent = item.type === 'Ionicons' ? Ionicons : (item.type === 'MaterialCommunityIcons' ? MaterialCommunityIcons : FontAwesome);
    return (
        <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
            <View style={[styles.iconCircle, { backgroundColor: theme.isDarkMode ? '#333' : Colors.lightRed }]}>
                <IconComponent name={item.icon} size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.categoryLabel, { color: theme.text }]}>{item.title}</Text>
        </TouchableOpacity>
    );
};

const SubscriptionSection = ({ theme }) => {
    const [expandedId, setExpandedId] = useState(null);
    const toggleExpand = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Premium Plans</Text>
            </View>
            <View style={styles.premiumCard}>
                <View style={styles.premiumHeader}>
                    <Ionicons name="diamond-outline" size={28} color={Colors.white} />
                    <Text style={styles.premiumTitle}>Upgrade to Pro</Text>
                    <Text style={styles.premiumSubtitle}>Unlock exclusive features today!</Text>
                </View>
                {SUBSCRIPTION_PLANS.map((plan) => {
                    const isExpanded = expandedId === plan.id;
                    return (
                        <View key={plan.id} style={styles.planContainer}>
                            <TouchableOpacity style={[styles.planHeader, isExpanded && styles.planHeaderActive, { borderColor: plan.color }]} onPress={() => toggleExpand(plan.id)} activeOpacity={0.9}>
                                <View style={styles.planInfo}>
                                    <View style={[styles.planIcon, { backgroundColor: plan.color }]}>
                                        <MaterialCommunityIcons name="crown" size={16} color={Colors.secondary} />
                                    </View>
                                    <View>
                                        <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                                        <Text style={styles.planPrice}>{plan.price}</Text>
                                    </View>
                                </View>
                                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={Colors.white} />
                            </TouchableOpacity>
                            {isExpanded && (
                                <View style={styles.planDetails}>
                                    {plan.features.map((feature, index) => (
                                        <View key={index} style={styles.featureRow}>
                                            <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                                            <Text style={styles.featureText}>{feature}</Text>
                                        </View>
                                    ))}
                                    <TouchableOpacity style={[styles.subscribeBtn, { backgroundColor: plan.color }]}>
                                        <Text style={styles.subscribeText}>Subscribe Now</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// --- 4. MAIN SCREEN ---
export default function HomeScreen() {
    const router = useRouter();
    const { theme, isDarkMode } = useContext(UserContext); 
    const [activeTab, setActiveTab] = useState('Home'); 
    const [activeStory, setActiveStory] = useState(null);

    useFocusEffect(
        useCallback(() => {
            setActiveTab('Home');
        }, [])
    );

    const handleNavigation = (route) => {
        console.log("Navigating to", route);
    };

    const handleTabPress = (tabName) => {
        setActiveTab(tabName);
        if (tabName === 'Profile') router.push('/(main)/profile'); 
        else if (tabName === 'All Products') router.push('/(main)/allproducts'); 
        else if (tabName === 'Support') router.push('/(main)/help'); 
    };

    const tabs = [
        { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
        { name: 'All Products', icon: 'grid-outline', activeIcon: 'grid' },
        { name: 'Support', icon: 'headset-outline', activeIcon: 'headset' },
        { name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar 
                barStyle={theme.statusBarStyle} 
                backgroundColor="transparent" 
                translucent={true} 
            />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <Header />
                <View style={{ marginTop: 25 }} />
                <StoriesSection onStoryPress={(story) => setActiveStory(story)} theme={theme} />
                <SpecialScrollSection theme={theme} />
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Category</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                    </View>
                    <View style={styles.categoriesGrid}>
                        {MODULES.map((item) => (
                            <CategoryItem key={item.id} item={item} onPress={() => handleNavigation(item.id)} theme={theme} />
                        ))}
                    </View>
                </View>
                <SubscriptionSection theme={theme} />
            </ScrollView>

            <View style={styles.bottomBarContainer}>
                <View style={[styles.bottomBar, { backgroundColor: isDarkMode ? '#1E1E1E' : Colors.navBarBg }]}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.name;
                        return (
                            <TouchableOpacity 
                                key={tab.name} 
                                style={styles.tabItem} 
                                onPress={() => handleTabPress(tab.name)} 
                                activeOpacity={0.8}
                            >
                                {isActive ? (
                                    <View style={styles.activeTabCircle}>
                                        <Ionicons name={tab.activeIcon} size={24} color={Colors.secondary} />
                                    </View>
                                ) : (
                                    <Ionicons name={tab.icon} size={24} color="#888" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {activeStory && (
                <StoryViewer 
                    story={activeStory} 
                    onClose={() => setActiveStory(null)} 
                />
            )}

        </View>
    );
}

// --- 5. STYLES ---
const styles = StyleSheet.create({
    container: { flex: 1 }, 
    
    // Header
    headerContainer: {
        backgroundColor: Colors.primary,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    profileContainer: { flexDirection: 'row', alignItems: 'center' },
    headerProfileImage: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: Colors.white },
    profileTextContainer: { marginLeft: 12 },
    welcomeLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '500' },
    userNameText: { color: Colors.white, fontSize: 18, fontWeight: 'bold', marginTop: 2 },
    notificationBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
    badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: Colors.gold, borderRadius: 4 },

    // Search
    searchWrapper: { flexDirection: 'row', alignItems: 'center' },
    searchContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', 
        paddingHorizontal: 15, height: 50, borderRadius: 12,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    filterBtn: {
        marginLeft: 10, width: 50, height: 50, 
        justifyContent: 'center', alignItems: 'center', borderRadius: 12,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },

    // Stories
    storiesContainer: { marginTop: 30, marginBottom: 10 },
    storyItem: { alignItems: 'center', marginRight: 15 },
    storyCircle: { width: 65, height: 65, borderRadius: 32.5, borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 2 },
    storyImage: { width: '100%', height: '100%', borderRadius: 30 },
    storyLabel: { marginTop: 5, fontSize: 11, fontWeight: '500' },

    // Story Viewer
    fullStoryContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    fullStoryImage: { width: width, height: height, position: 'absolute' },
    storyHeader: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, zIndex: 10 },
    storyUser: { flexDirection: 'row', alignItems: 'center' },
    storyUserImage: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 1, borderColor: '#FFF' },
    storyUserName: { color: '#FFF', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
    closeStoryBtn: { padding: 5 },
    progressBarContainer: { position: 'absolute', top: 40, left: 10, right: 10, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, zIndex: 10 },
    progressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },

    // Sections
    sectionContainer: { marginTop: 20, paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    seeAll: { color: Colors.primary, fontSize: 13, fontWeight: '600' },

    // Scroll Card
    scrollCard: { width: 280, height: 160, backgroundColor: Colors.cardDark, borderRadius: 20, marginRight: 15, flexDirection: 'row', overflow: 'hidden', padding: 20, position: 'relative' },
    scrollCardContent: { flex: 1, justifyContent: 'center', zIndex: 2 },
    limitedTag: { backgroundColor: Colors.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 },
    limitedText: { fontSize: 10, fontWeight: 'bold', color: Colors.secondary },
    scrollTitle: { color: Colors.white, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    scrollSubtitle: { color: Colors.textLight, fontSize: 12, marginBottom: 12 },
    claimBtn: { backgroundColor: Colors.primary, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'flex-start' },
    claimText: { color: Colors.white, fontWeight: 'bold', fontSize: 12 },
    scrollImage: { width: 140, height: 180, resizeMode: 'cover', position: 'absolute', right: -30, bottom: -20, transform: [{ rotate: '-10deg' }] },

    // Category
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryItem: { width: '22%', alignItems: 'center', marginBottom: 20 },
    iconCircle: { width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    categoryLabel: { fontSize: 11, textAlign: 'center', fontWeight: '500' },

    // Premium Card
    premiumCard: { backgroundColor: Colors.premiumBg, borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 },
    premiumHeader: { alignItems: 'center', marginBottom: 20 },
    premiumTitle: { color: Colors.white, fontSize: 22, fontWeight: 'bold', marginTop: 10 },
    premiumSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 5 },
    planContainer: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: 'transparent', borderRadius: 12 },
    planHeaderActive: { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
    planInfo: { flexDirection: 'row', alignItems: 'center' },
    planIcon: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    planName: { fontSize: 16, fontWeight: 'bold' },
    planPrice: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    planDetails: { padding: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    featureText: { color: Colors.white, fontSize: 13, marginLeft: 8 },
    subscribeBtn: { marginTop: 15, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    subscribeText: { color: Colors.secondary, fontWeight: 'bold', fontSize: 14 },

    // Bottom Bar
    bottomBarContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 },
    bottomBar: { flexDirection: 'row', borderRadius: 35, height: 70, width: '100%', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
    tabItem: { width: 60, height: 70, justifyContent: 'center', alignItems: 'center' },
    activeTabCircle: { width: 55, height: 55, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 35, borderWidth: 4, borderColor: Colors.background, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
});