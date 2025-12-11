import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  PixelRatio,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// You must have installed these packages: expo install @expo/vector-icons
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- 1. LOCAL COLOR DEFINITIONS ---
const Colors = {
    primary: '#007AFF',       // Blue
    secondary: '#1A237E',     // Dark Blue for Header
    accent: '#4CAF50',        // Green
    warning: '#FFC107',       // Yellow
    danger: '#DC3545',        // Red
    white: '#FFFFFF',
    black: '#000000',
    text: '#333333',
    textLight: '#999999',
    whatsappGreen: '#4CAF50',
    border: '#E0E0E0',
    lightGrey: '#F8F8F8',
};

// --- 2. GLOBAL DIMENSIONS ---
const { width } = Dimensions.get('window');
const scale = size => size * PixelRatio.getFontScale();

// --- 3. DUMMY DATA ---

// Grid Menu Data (From your request)
const MODULES = [
    { id: 'lead', title: 'Lead Extractor', icon: 'server-network-outline', type: 'MaterialCommunityIcons', route: 'lead-extractor' },
    { id: 'poster', title: 'Personalized Poster', icon: 'palette-outline', type: 'Ionicons', route: 'poster-tool' },
    { id: 'hisab', title: 'Apna Hisab', icon: 'calculator-outline', type: 'Ionicons', route: 'hisab-tool' },
    { id: 'greetings', title: 'Greetings', icon: 'volume-high-outline', type: 'Ionicons', route: 'greetings-tool' },
    { id: 'video', title: 'Video', icon: 'videocam-outline', type: 'Ionicons', route: 'video-tool' },
    { id: 'training', title: 'Training', icon: 'megaphone-outline', type: 'Ionicons', route: 'training-tool' },
    { id: 'frames', title: 'Frames', icon: 'crop-free', type: 'MaterialCommunityIcons', route: 'frames-tool' },
    { id: 'congrats', title: 'Congrats', icon: 'medal-outline', type: 'Ionicons', route: 'congrats-tool' },
    { id: 'invitation', title: 'Invitation', icon: 'mail-outline', type: 'Ionicons', route: 'invitation-tool' },
    { id: 'certificate', title: 'Certificate', icon: 'certificate-outline', type: 'MaterialCommunityIcons', route: 'certificate-tool' },
    { id: 'registration', title: 'Registration', icon: 'tablet-cellphone', type: 'MaterialCommunityIcons', route: 'registration-tool' },
    { id: 'reports', title: 'Reports', icon: 'chart-bar', type: 'FontAwesome', route: 'reports-tool' },
    { id: 'faq', title: 'FAQ', icon: 'help-circle-outline', type: 'Ionicons', route: 'faq-page' },
    { id: 'settings', title: 'Settings', icon: 'cog-outline', type: 'Ionicons', route: 'settings-page' },
];

// Mock Feed Data
const FEED_ITEMS = [
    { id: 1, title: 'Mega Diwali Offer', date: '29 Aug', type: 'Festival', image: 'https://via.placeholder.com/150x150/FF6347/FFFFFF?text=Diwali' },
    { id: 2, title: 'Weekly Business Tips', date: '28 Aug', type: 'Business', image: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=Business' },
    { id: 3, title: 'Upcoming Webinar Invitation', date: '27 Aug', type: 'Event', image: 'https://via.placeholder.com/150x150/6C63FF/FFFFFF?text=Webinar' },
    { id: 4, title: 'New Policy Update', date: '26 Aug', type: 'Update', image: 'https://via.placeholder.com/150x150/FFC107/000000?text=Policy' },
    { id: 5, title: 'Happy Holi Greetings', date: '25 Aug', type: 'Festival', image: 'https://via.placeholder.com/150x150/17A2B8/FFFFFF?text=Holi' },
    { id: 6, title: 'Client Success Story', date: '24 Aug', type: 'Success', image: 'https://via.placeholder.com/150x150/DC3545/FFFFFF?text=Success' },
];

// Mock Statistics Data
const STATS_DATA = [
    { title: 'Total Leads', value: '4,521', icon: 'person-add', color: Colors.primary },
    { title: 'Posters Created', value: '8,901', icon: 'image', color: Colors.accent },
    { title: 'Training Views', value: '1,204', icon: 'video', color: Colors.warning },
    { title: 'Certificates Issued', value: '450', icon: 'medal', color: Colors.secondary },
];

// --- 4. SUB-COMPONENTS ---

// Grid Item Component (for the 3xN menu)
const GridItem = React.memo(({ title, icon, type, onPress }) => {
    const IconComponent = type === 'Ionicons' ? Ionicons : (type === 'MaterialCommunityIcons' ? MaterialCommunityIcons : FontAwesome);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <IconComponent 
                    name={icon} 
                    size={scale(35)} 
                    color={Colors.primary} 
                />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
        </TouchableOpacity>
    );
});

// Mock Analytics/Stats Card Component
const StatCard = React.memo(({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
        <View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
        <FontAwesome name={icon} size={scale(24)} color={color} />
    </View>
));

// Feed Item Component (for the vertical list at the bottom)
const FeedItem = React.memo(({ item }) => (
    <View style={styles.feedItem}>
        <Image source={{ uri: item.image }} style={styles.feedImage} />
        <View style={styles.feedContent}>
            <Text style={styles.feedTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.feedFooter}>
                <Text style={styles.feedDate}>{item.date}</Text>
                <View style={[styles.feedTypeChip, { backgroundColor: item.type === 'Festival' ? Colors.danger : Colors.accent }]}>
                    <Text style={styles.feedTypeChipText}>{item.type}</Text>
                </View>
            </View>
        </View>
        <Ionicons name="chevron-forward-outline" size={scale(18)} color={Colors.textLight} />
    </View>
));

// --- 5. MAIN SCREEN COMPONENT ---
export default function MegaUIScreen({ navigation }) { // Passing navigation mock for internal use
    const handleModulePress = (route) => {
        console.log(`Navigating to: ${route}`);
        // In a real Expo Router app, you'd use: router.push(`/(main)/${route}`);
    };

    const renderFeedItem = ({ item }) => <FeedItem item={item} />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* --- A. HEADER SECTION (Your requested style) --- */}
                <View style={styles.header}>
                    <Text style={styles.brandName}>Agent Saathi</Text>
                    <View style={styles.headerRight}>
                        <Text style={styles.language}>ENGLISH</Text>
                        <Ionicons name="caret-down-outline" size={scale(14)} color={Colors.white} style={{ marginLeft: 4 }} />
                        <TouchableOpacity style={{ marginLeft: 15 }}><Ionicons name="logo-whatsapp" size={scale(24)} color={Colors.whatsappGreen} /></TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 15 }}><Ionicons name="person-circle-outline" size={scale(28)} color={Colors.white} /></TouchableOpacity>
                    </View>
                </View>
                
                {/* --- B. STATUS/VIDEO SECTION (Your requested style) --- */}
                <View style={styles.topSection}>
                    <Text style={styles.topSectionText}>Today Status Videos</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* --- C. ANALYTICS/DASHBOARD SECTION --- */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Performance Dashboard</Text>
                </View>
                <View style={styles.statsContainer}>
                    {STATS_DATA.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </View>
                
                <View style={styles.chartPlaceholder}>
                    <Text style={styles.placeholderText}></Text>
                </View>

                {/* --- D. GRID MENU SECTION (Your core request) --- */}
                <View style={[styles.sectionHeader, { marginTop: scale(20) }]}>
                    <Text style={styles.sectionTitle}>Agent Tools</Text>
                </View>
                <View style={styles.gridWrapper}>
                    <View style={styles.grid}>
                        {MODULES.map((module) => (
                            <GridItem 
                                key={module.id}
                                title={module.title}
                                icon={module.icon}
                                type={module.type}
                                onPress={() => handleModulePress(module.route)}
                            />
                        ))}
                    </View>
                </View>
                
                {/* --- E. NEWS/FEED LIST SECTION --- */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Latest Updates & News</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>More</Text>
                    </TouchableOpacity>
                </View>
                
                <FlatList
                    data={FEED_ITEMS}
                    renderItem={renderFeedItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false} // Since it's inside a ScrollView
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.feedList}
                />
                
                <View style={{ height: 50 }} /> {/* Final padding for content under tabs */}

            </ScrollView>
        </SafeAreaView>
    );
}

// --- 6. STYLES ---

// Constants for Grid Calculation
const GRID_PADDING_H = 40; // Total horizontal padding
const CARD_MARGIN_H = 20; // Margin between cards
const CARD_SIZE_W = (width - GRID_PADDING_H - 2 * CARD_MARGIN_H) / 3; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGrey,
    },
    scrollContent: {
        paddingBottom: scale(100), // Extra padding for safe scrolling past the bottom bar
    },

    // A. HEADER STYLES
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: scale(15),
        backgroundColor: Colors.secondary,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    brandName: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: Colors.white,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    language: {
        fontSize: scale(14),
        color: Colors.white,
        fontWeight: '600',
    },

    // B. STATUS/VIDEO SECTION STYLES
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: scale(12),
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    topSectionText: {
        fontSize: scale(16),
        color: Colors.text,
        fontWeight: '600',
    },
    viewAllText: {
        fontSize: scale(14),
        color: Colors.primary,
        fontWeight: '500',
    },

    // C. ANALYTICS/DASHBOARD STYLES
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        marginTop: scale(20),
        marginBottom: scale(10),
    },
    sectionTitle: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: Colors.text,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: scale(15),
    },
    statCard: {
        width: '48%',
        backgroundColor: Colors.white,
        padding: scale(15),
        borderRadius: scale(8),
        marginBottom: scale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: scale(5),
        elevation: 1,
    },
    statValue: {
        fontSize: scale(20),
        fontWeight: 'bold',
        color: Colors.text,
    },
    statTitle: {
        fontSize: scale(12),
        color: Colors.textLight,
        marginTop: scale(4),
    },
    chartPlaceholder: {
        marginHorizontal: scale(20),
        height: scale(150),
        backgroundColor: Colors.white,
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: scale(10),
    },
    placeholderText: {
        color: Colors.textLight,
        fontStyle: 'italic',
        fontSize: scale(14),
    },

    // D. GRID MENU STYLES
    gridWrapper: {
        paddingHorizontal: scale(20),
        paddingVertical: scale(10),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: Colors.white, 
        borderRadius: scale(10),
        padding: scale(10),
        elevation: 5, 
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    card: {
        width: CARD_SIZE_W,
        height: CARD_SIZE_W + scale(20), 
        marginBottom: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: scale(60),
        height: scale(60),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightGrey,
        borderRadius: scale(12),
        marginBottom: scale(8),
    },
    cardTitle: {
        fontSize: scale(12),
        textAlign: 'center',
        color: Colors.text,
        fontWeight: '500',
    },

    // E. NEWS/FEED LIST STYLES
    feedList: {
        paddingHorizontal: scale(20),
    },
    feedItem: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingVertical: scale(15),
        alignItems: 'center',
    },
    feedImage: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(8),
        marginRight: scale(15),
    },
    feedContent: {
        flex: 1,
        justifyContent: 'center',
    },
    feedTitle: {
        fontSize: scale(15),
        fontWeight: '600',
        color: Colors.text,
        marginBottom: scale(4),
    },
    feedFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(2),
    },
    feedDate: {
        fontSize: scale(12),
        color: Colors.textLight,
        marginRight: scale(10),
    },
    feedTypeChip: {
        paddingHorizontal: scale(8),
        paddingVertical: scale(3),
        borderRadius: scale(4),
    },
    feedTypeChipText: {
        fontSize: scale(10),
        color: Colors.white,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: scale(20),
    }
});