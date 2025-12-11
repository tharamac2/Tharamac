import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react'; // Added useMemo for efficient filtering
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/Colors';

// Placeholder data for categories
const CATEGORIES = [
    { id: 1, name: 'All' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Festivals' },
    { id: 4, name: 'Daily Quotes' },
    { id: 5, name: 'Offers' },
];

// Placeholder data for templates (Added category property for filtering)
const FEATURED_TEMPLATES_DATA = [
    { id: 1, title: 'Mega Sale', category: 'Offers', image: 'https://via.placeholder.com/300x300/6C63FF/FFFFFF?text=Sale' },
    { id: 2, title: 'Diwali Wish', category: 'Festivals', image: 'https://via.placeholder.com/300x300/FF6347/FFFFFF?text=Diwali' },
    { id: 3, title: 'Morning Quote', category: 'Daily Quotes', image: 'https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=Quote' },
    { id: 4, title: 'Hiring Now', category: 'Business', image: 'https://via.placeholder.com/300x300/FFC107/000000?text=Hiring' },
    { id: 5, title: 'Summer Offer', category: 'Offers', image: 'https://via.placeholder.com/300x300/17A2B8/FFFFFF?text=Summer' },
    { id: 6, title: 'Christmas Day', category: 'Festivals', image: 'https://via.placeholder.com/300x300/DC3545/FFFFFF?text=Christmas' },
];

export default function HomeScreen() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchText, setSearchText] = useState(''); // New state for search input

    const handleTemplatePress = (id) => {
        router.push(`/(editor)/${id}`);
    };

    // --- Core Filtering Logic using useMemo ---
    const filteredTemplates = useMemo(() => {
        let templates = FEATURED_TEMPLATES_DATA;

        // 1. Filter by Category
        if (activeCategory !== 'All') {
            templates = templates.filter(
                (template) => template.category === activeCategory
            );
        }

        // 2. Filter by Search Text
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            templates = templates.filter(
                (template) => 
                    template.title.toLowerCase().includes(lowerSearch) ||
                    template.category.toLowerCase().includes(lowerSearch)
            );
        }

        return templates;
    }, [activeCategory, searchText]); // Recalculate only when category or search text changes

    // --- Template Change Handler ---
    const handleCategoryChange = (categoryName) => {
        setActiveCategory(categoryName);
        // Optional: Clear search when changing categories
        // setSearchText(''); 
    };
    
    // --- Render Logic ---
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Header Section (Unchanged) */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, User!</Text>
                        <Text style={styles.brandName}>Tharamac</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(main)/profile')}>
                        <View style={styles.profileIcon}>
                            <Text style={styles.profileInitials}>U</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Search Bar (Updated with value and onChangeText) */}
                <View style={styles.searchContainer}>
                    <TextInput 
                        placeholder="Search templates (e.g., Offer, Monday)..." 
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText} // Updates the searchText state
                    />
                </View>

                {/* Banner / Premium Ad (Unchanged) */}
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>Unlock Premium Designs</Text>
                    <Text style={styles.bannerSubText}>Get 5000+ templates for your business.</Text>
                    <TouchableOpacity style={styles.bannerButton}>
                        <Text style={styles.bannerButtonText}>Upgrade Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Categories (Horizontal Scroll) (Updated with new handler) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={[styles.categoryChip, activeCategory === cat.name && styles.categoryChipActive]}
                            onPress={() => handleCategoryChange(cat.name)} // Uses the new handler
                        >
                            <Text style={[styles.categoryText, activeCategory === cat.name && styles.categoryTextActive]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Templates Grid (Now uses filteredTemplates) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {activeCategory === 'All' ? 'Featured' : activeCategory} Templates 
                        ({filteredTemplates.length})
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(main)/templates')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    {/* Display a message if no templates match the filter */}
                    {filteredTemplates.length === 0 ? (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>
                                No templates found matching "{searchText}" in {activeCategory}.
                            </Text>
                        </View>
                    ) : (
                        filteredTemplates.map((item) => ( // Mapping over the filtered list
                            <TouchableOpacity 
                                key={item.id} 
                                style={styles.card}
                                onPress={() => handleTemplatePress(item.id)}
                            >
                                <Image source={{ uri: item.image }} style={styles.cardImage} />
                                <View style={styles.cardFooter}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

// --- Styles (Added a few styles for No Results) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.white,
    },
    greeting: {
        fontSize: 14,
        color: Colors.textLight,
    },
    brandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitials: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    searchInput: {
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
    },
    banner: {
        marginHorizontal: 20,
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 20,
        marginBottom: 25,
    },
    bannerText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bannerSubText: {
        color: '#CCCCCC',
        fontSize: 14,
        marginBottom: 15,
    },
    bannerButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    seeAll: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    categoryScroll: {
        paddingLeft: 20,
        marginBottom: 25,
    },
    categoryChip: {
        backgroundColor: Colors.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    categoryChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryText: {
        color: Colors.text,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: Colors.white,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    cardFooter: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    // New styles for no results message
    noResultsContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noResultsText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
    }
});