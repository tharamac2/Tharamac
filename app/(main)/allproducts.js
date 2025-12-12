import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- THEME CONFIG ---
const Colors = {
    primary: '#FF3B30',      // Red
    secondary: '#000000',    // Black
    background: '#F9F9F9',   // White/Grey
    white: '#FFFFFF',
    text: '#1F2937',
    textLight: '#9CA3AF',
    cardDark: '#1C1C1E',     // Dark card background
    premiumBg: '#2C0E37',    
    gold: '#FFD700',
    silver: '#C0C0C0',
    platinum: '#E5E4E2',
    lightRed: '#FFF0F0',
    navBarBg: '#111111',
};

export default function AllProductsScreen() {
    const router = useRouter();
    // Default active tab is 'All Products'
    const [activeTab, setActiveTab] = useState('All Products'); 

    // ✅ FIXED: Navigation Logic
    const handleNavigation = (routeName) => {
        setActiveTab(routeName); 
        
        if (routeName === 'Home') {
            router.push('/(main)/home'); // Go to Home
        } else if (routeName === 'Profile') {
            router.push('/(main)/profile'); // Go to Profile
        } else if (routeName === 'Support') {
            router.push('/(main)/help'); // Go to Help/Support
        } 
        // If 'All Products', do nothing (we are already here)
    };

    const tabs = [
        { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
        { name: 'All Products', icon: 'grid-outline', activeIcon: 'grid' },
        { name: 'Support', icon: 'headset-outline', activeIcon: 'headset' },
        { name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
    ];

    return (
        <View style={styles.container}>
            {/* Fix Status Bar overlap */}
            <StatusBar 
                barStyle="dark-content" 
                backgroundColor="transparent" 
                translucent={true} 
            />

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
            >
                {/* Header Title */}
                <Text style={styles.title}>All Products & Templates</Text>
                <Text style={styles.subtitle}>Explore all our design categories.</Text>
                
                {/* Placeholder content for All Products */}
                <View style={styles.placeholderCard}>
                    <Text style={{ color: Colors.text }}>Category List or Grid...</Text>
                </View>

            </ScrollView>

            {/* --- BOTTOM NAVIGATION BAR --- */}
            <View style={styles.bottomBarContainer}>
                <View style={styles.bottomBar}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.name;
                        return (
                            <TouchableOpacity 
                                key={tab.name} 
                                style={styles.tabItem} 
                                onPress={() => handleNavigation(tab.name)}
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

        </View>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60 
    },

    // Content Styles
    title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 5 },
    subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 20 },
    placeholderCard: { height: 400, backgroundColor: Colors.white, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },

    // Bottom Bar Styles
    bottomBarContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 },
    bottomBar: { flexDirection: 'row', backgroundColor: Colors.navBarBg, borderRadius: 35, height: 70, width: '100%', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
    tabItem: { width: 60, height: 70, justifyContent: 'center', alignItems: 'center' },
    activeTabCircle: { width: 55, height: 55, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 35, borderWidth: 4, borderColor: Colors.background, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
});