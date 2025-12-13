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
        title: 'JANUARY',
        data: [
            { date: 'Jan 1', name: "New Year’s Day" },
            { date: 'Jan 4', name: "World Braille Day" },
            { date: 'Jan 6', name: "World Day of War Orphans" },
            { date: 'Jan 9', name: "Pravasi Bharatiya Divas" },
            { date: 'Jan 10', name: "World Hindi Day" },
            { date: 'Jan 11', name: "National Human Trafficking Awareness Day" },
            { date: 'Jan 12', name: "National Youth Day (India)" },
            { date: 'Jan 13', name: "Lohri" },
            { date: 'Jan 14', name: "Makar Sankranti / Pongal" },
            { date: 'Jan 15', name: "Indian Army Day" },
            { date: 'Jan 16', name: "National Startup Day (India)" },
            { date: 'Jan 23', name: "Netaji Subhas Chandra Bose Jayanti" },
            { date: 'Jan 24', name: "National Girl Child Day" },
            { date: 'Jan 25', name: "National Voters’ Day" },
            { date: 'Jan 26', name: "Republic Day (India)" },
            { date: 'Jan 27', name: "International Holocaust Remembrance Day" },
            { date: 'Jan 28', name: "Data Privacy Day" },
            { date: 'Jan 30', name: "Martyrs’ Day (India)" },
        ]
    },
    {
        title: 'FEBRUARY',
        data: [
            { date: 'Feb 2', name: "World Wetlands Day" },
            { date: 'Feb 4', name: "World Cancer Day" },
            { date: 'Feb 6', name: "Intl. Day of Zero Tolerance for FGM" },
            { date: 'Feb 10', name: "National Deworming Day (India)" },
            { date: 'Feb 11', name: "Intl. Day of Women & Girls in Science" },
            { date: 'Feb 13', name: "World Radio Day" },
            { date: 'Feb 14', name: "Valentine’s Day" },
            { date: 'Feb 15', name: "International Childhood Cancer Day" },
            { date: 'Feb 20', name: "World Day of Social Justice" },
            { date: 'Feb 21', name: "International Mother Language Day" },
            { date: 'Feb 22', name: "World Thinking Day" },
            { date: 'Feb 24', name: "Central Excise Day (India)" },
            { date: 'Feb 27', name: "World NGO Day" },
            { date: 'Feb 28', name: "National Science Day (India)" },
        ]
    },
    {
        title: 'MARCH',
        data: [
            { date: 'Mar 1', name: "Zero Discrimination Day" },
            { date: 'Mar 3', name: "World Wildlife Day" },
            { date: 'Mar 4', name: "World Obesity Day" },
            { date: 'Mar 8', name: "International Women’s Day" },
            { date: 'Mar 10', name: "CISF Raising Day" },
            { date: 'Mar 14', name: "Pi Day" },
            { date: 'Mar 15', name: "World Consumer Rights Day" },
            { date: 'Mar 16', name: "National Vaccination Day (India)" },
            { date: 'Mar 20', name: "International Day of Happiness" },
            { date: 'Mar 21', name: "World Forestry Day / World Down Syndrome Day" },
            { date: 'Mar 22', name: "World Water Day" },
            { date: 'Mar 23', name: "Shaheed Diwas" },
            { date: 'Mar 24', name: "World Tuberculosis (TB) Day" },
            { date: 'Mar 27', name: "World Theatre Day" },
        ]
    },
    {
        title: 'APRIL',
        data: [
            { date: 'Apr 1', name: "April Fool’s Day" },
            { date: 'Apr 2', name: "World Autism Awareness Day" },
            { date: 'Apr 5', name: "National Maritime Day (India)" },
            { date: 'Apr 7', name: "World Health Day" },
            { date: 'Apr 10', name: "World Homeopathy Day" },
            { date: 'Apr 11', name: "National Safe Motherhood Day" },
            { date: 'Apr 13', name: "Jallianwala Bagh Massacre Remembrance" },
            { date: 'Apr 14', name: "Dr. B. R. Ambedkar Jayanti" },
            { date: 'Apr 17', name: "World Hemophilia Day" },
            { date: 'Apr 18', name: "World Heritage Day" },
            { date: 'Apr 22', name: "Earth Day" },
            { date: 'Apr 23', name: "World Book Day" },
            { date: 'Apr 25', name: "World Malaria Day" },
            { date: 'Apr 29', name: "International Dance Day" },
        ]
    },
    {
        title: 'MAY',
        data: [
            { date: 'May 1', name: "International Labour Day" },
            { date: 'May 3', name: "World Press Freedom Day" },
            { date: 'May 7', name: "World Athletics Day" },
            { date: 'May 8', name: "World Red Cross Day" },
            { date: 'May 11', name: "National Technology Day (India)" },
            { date: 'May 12', name: "International Nurses Day" },
            { date: 'May 15', name: "International Day of Families" },
            { date: 'May 16', name: "International Day of Light" },
            { date: 'May 17', name: "World Telecommunication Day" },
            { date: 'May 20', name: "World Bee Day" },
            { date: 'May 21', name: "Anti-Terrorism Day (India)" },
            { date: 'May 22', name: "International Biodiversity Day" },
            { date: 'May 31', name: "World No Tobacco Day" },
        ]
    },
    {
        title: 'JUNE',
        data: [
            { date: 'Jun 1', name: "Global Parents Day" },
            { date: 'Jun 3', name: "World Bicycle Day" },
            { date: 'Jun 5', name: "World Environment Day" },
            { date: 'Jun 7', name: "World Food Safety Day" },
            { date: 'Jun 8', name: "World Oceans Day" },
            { date: 'Jun 12', name: "World Day Against Child Labour" },
            { date: 'Jun 14', name: "World Blood Donor Day" },
            { date: 'Jun 15', name: "World Elder Abuse Awareness Day" },
            { date: 'Jun 20', name: "World Refugee Day" },
            { date: 'Jun 21', name: "International Yoga Day" },
            { date: 'Jun 23', name: "International Olympic Day" },
            { date: 'Jun 26', name: "International Day Against Drug Abuse" },
        ]
    },
    {
        title: 'JULY',
        data: [
            { date: 'Jul 1', name: "National Doctors’ Day (India)" },
            { date: 'Jul 6', name: "World Zoonoses Day" },
            { date: 'Jul 11', name: "World Population Day" },
            { date: 'Jul 15', name: "World Youth Skills Day" },
            { date: 'Jul 18', name: "Nelson Mandela International Day" },
            { date: 'Jul 28', name: "World Hepatitis Day" },
            { date: 'Jul 29', name: "International Tiger Day" },
        ]
    },
    {
        title: 'AUGUST',
        data: [
            { date: 'Aug 7', name: "National Handloom Day" },
            { date: 'Aug 9', name: "Quit India Movement Day" },
            { date: 'Aug 10', name: "World Lion Day" },
            { date: 'Aug 12', name: "International Youth Day" },
            { date: 'Aug 15', name: "Independence Day (India)" },
            { date: 'Aug 19', name: "World Photography Day" },
            { date: 'Aug 20', name: "World Mosquito Day" },
            { date: 'Aug 23', name: "Intl. Day for Slave Trade Abolition" },
            { date: 'Aug 29', name: "National Sports Day (India)" },
        ]
    },
    {
        title: 'SEPTEMBER',
        data: [
            { date: 'Sep 5', name: "Teachers’ Day (India)" },
            { date: 'Sep 7', name: "International Day of Clean Air" },
            { date: 'Sep 8', name: "International Literacy Day" },
            { date: 'Sep 10', name: "World Suicide Prevention Day" },
            { date: 'Sep 14', name: "Hindi Diwas" },
            { date: 'Sep 15', name: "Engineers’ Day (India)" },
            { date: 'Sep 16', name: "World Ozone Day" },
            { date: 'Sep 21', name: "International Day of Peace" },
            { date: 'Sep 25', name: "World Pharmacists Day" },
            { date: 'Sep 27', name: "World Tourism Day" },
            { date: 'Sep 28', name: "World Rabies Day" },
        ]
    },
    {
        title: 'OCTOBER',
        data: [
            { date: 'Oct 1', name: "International Day of Older Persons" },
            { date: 'Oct 2', name: "Gandhi Jayanti" },
            { date: 'Oct 4', name: "World Animal Welfare Day" },
            { date: 'Oct 5', name: "World Teachers’ Day" },
            { date: 'Oct 8', name: "Indian Air Force Day" },
            { date: 'Oct 10', name: "World Mental Health Day" },
            { date: 'Oct 11', name: "International Girl Child Day" },
            { date: 'Oct 13', name: "World Disaster Reduction Day" },
            { date: 'Oct 15', name: "World Students’ Day" },
            { date: 'Oct 16', name: "World Food Day" },
            { date: 'Oct 24', name: "United Nations Day" },
            { date: 'Oct 31', name: "National Unity Day" },
        ]
    },
    {
        title: 'NOVEMBER',
        data: [
            { date: 'Nov 1', name: "World Vegan Day" },
            { date: 'Nov 5', name: "World Tsunami Awareness Day" },
            { date: 'Nov 8', name: "World Radiography Day" },
            { date: 'Nov 10', name: "World Science Day" },
            { date: 'Nov 14', name: "Children’s Day (India)" },
            { date: 'Nov 16', name: "International Tolerance Day" },
            { date: 'Nov 17', name: "World Students’ Day" },
            { date: 'Nov 19', name: "International Men’s Day" },
            { date: 'Nov 20', name: "Universal Children’s Day" },
            { date: 'Nov 26', name: "Constitution Day (India)" },
        ]
    },
    {
        title: 'DECEMBER',
        data: [
            { date: 'Dec 1', name: "World AIDS Day" },
            { date: 'Dec 2', name: "National Pollution Control Day" },
            { date: 'Dec 3', name: "Intl. Day of Persons with Disabilities" },
            { date: 'Dec 4', name: "Indian Navy Day" },
            { date: 'Dec 5', name: "World Soil Day" },
            { date: 'Dec 7', name: "Armed Forces Flag Day" },
            { date: 'Dec 10', name: "Human Rights Day" },
            { date: 'Dec 11', name: "International Mountain Day" },
            { date: 'Dec 14', name: "National Energy Conservation Day" },
            { date: 'Dec 18', name: "International Migrants Day" },
            { date: 'Dec 24', name: "National Consumer Day" },
            { date: 'Dec 25', name: "Christmas" },
            { date: 'Dec 31', name: "New Year’s Eve" },
        ]
    },
];

// --- DATA: GREETINGS LIST ---
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

// --- DATA: LIC PLANS LIST ---
const LIC_DATA = [
    {
        title: '1. New Plans Recently Launched (2025)',
        data: [
            { date: 'Plan 880', name: "LIC’s Jan Suraksha" },
            { date: 'Plan 881', name: "LIC’s Bima Lakshmi" },
            { date: 'Plan 886', name: "LIC’s Protection Plus" },
            { date: 'Plan 887', name: "LIC’s Bima Kavach" },
        ]
    },
    {
        title: '2. Endowment & Savings Plans',
        data: [
            { date: 'Plan 717', name: "Single Premium Endowment" },
            { date: 'Plan 714', name: "New Endowment Plan" },
            { date: 'Plan 715', name: "New Jeevan Anand" },
            { date: 'Plan 733', name: "Jeevan Lakshya" },
            { date: 'Plan 736', name: "Jeevan Labh Plan" },
            { date: 'Plan 774', name: "Amritbaal" },
            { date: 'Plan 760', name: "Bima Jyoti" },
            { date: 'Plan 768', name: "Jeevan Azad" },
            { date: 'Plan 912', name: "Nav Jeevan Shree" },
            { date: 'Plan 911', name: "Nav Jeevan Shree - Single" },
            { date: 'Plan 881', name: "Bima Lakshmi" },
        ]
    },
    {
        title: '3. Whole Life Plans',
        data: [
            { date: 'Plan 745', name: "Jeevan Umang" },
            { date: 'Plan 771', name: "Jeevan Utsav" },
        ]
    },
    {
        title: '4. Term Assurance (Pure Life Cover)',
        data: [
            { date: 'Plan 876', name: "Digi Term" },
            { date: 'Plan 878', name: "Digi Credit Life" },
            { date: 'Plan 877', name: "Yuva Credit Life" },
            { date: 'Plan 875', name: "Yuva Term" },
            { date: 'Plan 954', name: "New Tech-Term" },
            { date: 'Plan 955', name: "New Jeevan Amar" },
            { date: 'Plan 859', name: "Saral Jeevan Bima" },
        ]
    },
];

// --- NEW DATA: BUSINESS LIST ---
const BUSINESS_DATA = [
    {
        title: 'Growth & Strategy',
        data: [
            { date: 'Biz Quote', name: "Motivational Quote for Entrepreneurs" },
            { date: 'Pro Tip', name: "Tip of the Day" },
            { date: 'Daily Insp', name: "Daily Business Inspiration" },
            { date: 'How To', name: "How-To Tips & Hacks" },
        ]
    },
    {
        title: 'Marketing & Promotion',
        data: [
            { date: 'New Launch', name: "New Service Launch" },
            { date: 'Hot Sale', name: "Seasonal Offer / Sale" },
            { date: 'Show Case', name: "Product Showcase" },
            { date: 'Top Pick', name: "Service Highlight" },
        ]
    },
    {
        title: 'Brand & Community',
        data: [
            { date: 'User Review', name: "Client Testimonial" },
            { date: 'Our Team', name: "Team Spotlight" },
            { date: 'BTS View', name: "Behind-the-Scenes" },
            { date: 'Big Win', name: "Business Milestone" },
        ]
    },
    {
        title: 'Industry Insights',
        data: [
            { date: 'Key Stat', name: "Industry Fact / Statistic" },
            { date: 'New Trend', name: "Market Trend Alert" },
            { date: 'Save Date', name: "Upcoming Event Reminder" },
        ]
    }
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
        if (selectedCategory === 'LIC Plans') return LIC_DATA;
        if (selectedCategory === 'Business') return BUSINESS_DATA; // ✅ Added Business Data
        if (selectedCategory === 'Posters' || selectedCategory === 'Videos') return CALENDAR_DATA_2026;
        return [];
    };

    // ✅ Added 'Business' to list view check
    const isListView = ['Posters', 'Videos', 'Greetings', 'LIC Plans', 'Business'].includes(selectedCategory);

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

    // --- Render List Item (Shared for Calendar, Greetings, LIC, Business) ---
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
                // 1. Show List View
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