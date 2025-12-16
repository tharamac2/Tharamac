import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import {
    FlatList,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { UserContext } from '../../../src/context/UserContext';

// Mock Templates (These represent the designs for the specific event selected)
const MOCK_TEMPLATES = [
    { id: '1', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80' },
    { id: '2', image: 'https://images.unsplash.com/photo-1557683311-525160706b50?w=400&q=80' },
    { id: '3', image: 'https://images.unsplash.com/photo-1557682223-ed885b009498?w=400&q=80' },
    { id: '4', image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80' },
    { id: '5', image: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=400&q=80' },
    { id: '6', image: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&q=80' },
];

export default function EventDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // ✅ Receive the specific Event Name and Date passed from All Products
    const params = useLocalSearchParams();
    const { eventName, date } = params;

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="download-outline" size={20} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="share-social-outline" size={20} color={theme.text} />
                </TouchableOpacity>
            </View>
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
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>{eventName}</Text>
                    <Text style={[styles.headerDate, { color: theme.textLight }]}>{date}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Language/Filter Tabs (Optional) */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {['All', 'English', 'Hindi', 'Tamil', 'Marathi'].map((lang, index) => (
                        <TouchableOpacity 
                            key={lang} 
                            style={[
                                styles.filterChip, 
                                { 
                                    backgroundColor: index === 0 ? theme.primary : theme.surface, 
                                    borderColor: theme.border 
                                }
                            ]}
                        >
                            <Text style={[
                                styles.filterText, 
                                { color: index === 0 ? '#FFF' : theme.text }
                            ]}>{lang}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Templates Grid */}
            <FlatList
                data={MOCK_TEMPLATES}
                renderItem={renderTemplate}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridWrapper}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Select a Design</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 20, 
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerDate: { fontSize: 13, marginTop: 2 },
    
    // Filters
    filterContainer: { marginVertical: 15 },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
    },
    filterText: { fontSize: 13, fontWeight: '600' },

    // Grid
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    gridWrapper: { justifyContent: 'space-between' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },

    // Cards
    card: {
        width: '48%',
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    cardImage: { width: '100%', height: 180 },
    cardFooter: { 
        flexDirection: 'row', 
        padding: 8, 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
        marginRight: 6
    },
    btnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    iconBtn: {
        padding: 6,
        borderRadius: 6,
        marginLeft: 4
    }
});