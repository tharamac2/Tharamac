import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { UserContext } from '../../src/context/UserContext';

// --- DATA: CATEGORIES ---
const CATEGORIES = [
    { id: 'All', title: 'All' },
    { id: 'Posters', title: 'Posters' },
    { id: 'Videos', title: 'Videos' },
    { id: 'Greetings', title: 'Greetings' },
    { id: 'Brochures', title: 'Brochures' },
    { id: 'LIC Plans', title: 'LIC Plans' },
    { id: 'Business', title: 'Business' },
    { id: 'Motivation', title: 'Motivation' },
    { id: 'Certificates', title: 'Certificates' },
];

// --- DATA: STANDARD PRODUCTS (Grid View) ---
const ALL_PRODUCTS = [
    { id: '1', title: 'Diwali Festival', category: 'Posters', image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80' },
    { id: '2', title: 'New Year 2025', category: 'Videos', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' },
    { id: '3', title: 'Good Morning', category: 'Greetings', image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80' },
    { id: '4', title: 'Jeevan Anand', category: 'LIC Plans', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80' },
    { id: '5', title: 'Business Card', category: 'Business', image: 'https://images.unsplash.com/photo-1559333086-b0a56225a93c?w=400&q=80' },
    { id: '6', title: 'Success Quote', category: 'Motivation', image: 'https://images.unsplash.com/photo-1552508744-1696d4464960?w=400&q=80' },
    { id: '7', title: 'Award Certificate', category: 'Certificates', image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400&q=80' },
    { id: '8', title: 'Company Brochure', category: 'Brochures', image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?w=400&q=80' },
    { id: '9', title: 'Holi Special', category: 'Posters', image: 'https://images.unsplash.com/photo-1615967676759-994c6328325e?w=400&q=80' },
];

// --- DATA: CALENDAR 2026 (Posters & Videos) ---
const CALENDAR_DATA_2026 = [
    {
        title: 'January 2026',
        data: [
            { date: 'Jan 1', name: "New Year's Day" },
            { date: 'Jan 13', name: "Lohri" },
            { date: 'Jan 14', name: "Makar Sankranti/Pongal" },
            { date: 'Jan 23', name: "Vasant Panchami / Parakram Diwas" },
            { date: 'Jan 26', name: "Republic Day (India)" },
        ]
    },
    {
        title: 'March 2026',
        data: [
            { date: 'Mar 3', name: "Holika Dahan (Optional)" },
            { date: 'Mar 4', name: "Holi" },
            { date: 'Mar 19', name: "Gudi Padwa/Ugadi" },
            { date: 'Mar 27', name: "Ram Navami" },
            { date: 'Mar 29', name: "Eid-ul-Fitr (Tentative)" },
        ]
    },
    {
        title: 'April 2026',
        data: [
            { date: 'Apr 3', name: "Good Friday" },
            { date: 'Apr 5', name: "Easter Sunday (Optional)" },
            { date: 'Apr 14', name: "Vaisakhi" },
        ]
    },
    {
        title: 'May 2026',
        data: [
            { date: 'May 1', name: "Buddha Purnima/May Day" },
            { date: 'May 10', name: "Mother's Day" },
        ]
    },
    {
        title: 'August 2026',
        data: [
            { date: 'Aug 15', name: "Independence Day (India)" },
            { date: 'Aug 26', name: "Onam/Thiruvonam" },
            { date: 'Aug 28', name: "Raksha Bandhan" },
        ]
    },
    {
        title: 'September 2026',
        data: [
            { date: 'Sep 4', name: "Krishna Janmashtami" },
            { date: 'Sep 5', name: "Teacher's Day" },
            { date: 'Sep 14', name: "Ganesh Chaturthi" },
        ]
    },
    {
        title: 'October 2026',
        data: [
            { date: 'Oct 2', name: "Gandhi Jayanti" },
            { date: 'Oct 9-17', name: "Navratri" },
            { date: 'Oct 20', name: "Dussehra (Vijayadashami)" },
            { date: 'Oct 28', name: "Karva Chauth (Optional)" },
        ]
    },
    {
        title: 'November 2026',
        data: [
            { date: 'Nov 6', name: "Dhanteras (Optional)" },
            { date: 'Nov 8', name: "Diwali (Deepavali)" },
            { date: 'Nov 9', name: "Govardhan Puja" },
            { date: 'Nov 11', name: "Bhai Dooj" },
            { date: 'Nov 14', name: "Children's Day" },
            { date: 'Nov 15', name: "Chhath Puja" },
            { date: 'Nov 24', name: "Guru Nanak Jayanti" },
        ]
    },
    {
        title: 'December 2026',
        data: [
            { date: 'Dec 25', name: "Christmas" },
        ]
    },
];

// --- NEW DATA: GREETINGS LIST ---
const GREETINGS_DATA = [
    {
        title: 'Personal Milestones',
        data: [
            { date: 'Anytime', name: "Birthday Wishes" },
            { date: 'Anytime', name: "Wedding Anniversary" },
            { date: 'Anytime', name: "Housewarming" },
            { date: 'Anytime', name: "Baby Birth Congratulations" },
            { date: 'Anytime', name: "Retirement Wishes" },
            { date: 'Anytime', name: "New Business Opening" },
            { date: 'Anytime', name: "New Job / Promotion Wishes" },
        ]
    },
    {
        title: 'March',
        data: [{ date: 'Mar 8', name: "International Women’s Day" }]
    },
    {
        title: 'April',
        data: [{ date: 'Apr 7', name: "World Health Day" }]
    },
    {
        title: 'May',
        data: [{ date: 'May 10', name: "Mother's Day" }]
    },
    {
        title: 'June',
        data: [
            { date: 'Jun 5', name: "World Environment Day" },
            { date: 'Jun 21', name: "Father's Day" },
        ]
    },
    {
        title: 'July',
        data: [{ date: 'Jul 1', name: "Doctor’s Day" }]
    },
    {
        title: 'August',
        data: [{ date: 'Aug 21', name: "World Senior Citizens Day" }]
    },
    {
        title: 'September',
        data: [{ date: 'Sep 5', name: "Teacher's Day" }]
    },
    {
        title: 'November',
        data: [{ date: 'Nov 14', name: "Children’s Day" }]
    },
];

export default function AllProductsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext); 
    
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // --- Filter Logic for Grid Items ---
    const filteredProducts = ALL_PRODUCTS.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // --- Navigation Handler ---
    const handleUseProduct = (item) => {
        router.push({
            pathname: '/(main)/product-details',
            params: { 
                id: item.id || Math.random().toString(), 
                category: item.category || selectedCategory, 
                title: item.title || item.name, 
                // Default images
                image: item.image || (selectedCategory === 'Videos' 
                    ? 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' 
                    : 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80') 
            }
        });
    };

    // --- Determine which List Data to show ---
    const getListData = () => {
        if (selectedCategory === 'Greetings') return GREETINGS_DATA;
        if (selectedCategory === 'Posters' || selectedCategory === 'Videos') return CALENDAR_DATA_2026;
        return [];
    };

    const isListView = ['Posters', 'Videos', 'Greetings'].includes(selectedCategory);

    // --- Render Category Chip ---
    const renderCategory = ({ item }) => {
        const isSelected = selectedCategory === item.id;
        return (
            <TouchableOpacity 
                style={[
                    styles.categoryChip, 
                    { 
                        backgroundColor: isSelected ? theme.primary : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border 
                    }
                ]}
                onPress={() => setSelectedCategory(item.id)}
            >
                <Text style={[
                    styles.categoryText, 
                    { color: isSelected ? '#FFF' : theme.text }
                ]}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    // --- Render Grid Product ---
    const renderProduct = ({ item }) => (
        <TouchableOpacity style={[styles.productCard, { backgroundColor: theme.surface }]} onPress={() => handleUseProduct(item)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={[styles.productTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.productCategory, { color: theme.textLight }]}>{item.category}</Text>
                <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: theme.primary }]} onPress={() => handleUseProduct(item)}>
                    <Text style={styles.btnText}>Use</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // --- Render List Item (Shared for Calendar & Greetings) ---
    const renderListItem = ({ item }) => (
        <View style={[styles.calendarItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.dateBox}>
                <Text style={[styles.dateText, { color: theme.primary }]}>
                    {item.date.includes(' ') ? item.date.split(' ')[1] : ''}
                </Text>
                <Text style={[styles.monthText, { color: theme.textLight }]}>
                    {item.date.includes(' ') ? item.date.split(' ')[0] : item.date}
                </Text>
            </View>
            <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: theme.text }]}>{item.name}</Text>
            </View>
            <TouchableOpacity style={[styles.exploreBtn, { backgroundColor: theme.primary }]} onPress={() => handleUseProduct(item)}>
                <Text style={[styles.exploreText, { color: '#FFF' }]}>Explore</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.statusBarStyle} backgroundColor="transparent" translucent={true} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>All Products</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchWrapper}>
                <View style={[styles.searchContainer, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="search" size={20} color={theme.textLight} />
                    <TextInput 
                        placeholder="Search templates..." 
                        placeholderTextColor={theme.textLight} 
                        style={[styles.searchInput, { color: theme.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Categories Scroll */}
            <View style={styles.categoryContainer}>
                <FlatList
                    data={CATEGORIES}
                    renderItem={renderCategory}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            {/* CONDITIONAL CONTENT */}
            {isListView ? (
                // 1. Show List View (Calendar / Greetings)
                <SectionList
                    sections={getListData()}
                    keyExtractor={(item, index) => item.name + index}
                    renderItem={renderListItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={[styles.sectionHeaderBox, { backgroundColor: theme.background }]}>
                            <Text style={[styles.sectionHeaderTitle, { color: theme.textLight }]}>{title}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                // 2. Show Grid for Everything Else
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.gridWrapper}
                    contentContainerStyle={styles.gridContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={{ color: theme.textLight }}>No products found</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    
    searchWrapper: { paddingHorizontal: 20, marginBottom: 15 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 12 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },

    categoryContainer: { marginBottom: 15 },
    categoryList: { paddingHorizontal: 20 },
    categoryChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 10, height: 40, justifyContent: 'center' },
    categoryText: { fontSize: 14, fontWeight: '600' },

    // Grid Styles
    gridWrapper: { justifyContent: 'space-between' },
    gridContent: { paddingHorizontal: 20, paddingBottom: 20 },
    productCard: { width: '48%', borderRadius: 16, marginBottom: 15, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    productImage: { width: '100%', height: 140, resizeMode: 'cover' },
    productInfo: { padding: 10 },
    productTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
    productCategory: { fontSize: 12, marginBottom: 8 },
    downloadBtn: { paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

    // List View Styles
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionHeaderBox: { paddingVertical: 10, marginTop: 10 },
    sectionHeaderTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    
    calendarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
    },
    dateBox: {
        width: 55,
        alignItems: 'center',
        marginRight: 15,
        borderRightWidth: 1,
        borderRightColor: '#EEE',
        paddingRight: 15
    },
    dateText: { fontSize: 18, fontWeight: 'bold' },
    monthText: { fontSize: 12, textTransform: 'uppercase', textAlign: 'center' },
    eventInfo: { flex: 1 },
    eventTitle: { fontSize: 16, fontWeight: '600' },
    exploreBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    exploreText: { fontSize: 12, fontWeight: 'bold' },

    emptyState: { alignItems: 'center', marginTop: 50 },
});