import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import {
    FlatList,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { UserContext } from '../../../src/context/UserContext';

// Mock Templates for Business (Quotes, Stats, etc.)
const MOCK_BUSINESS_TEMPLATES = [
    { id: '1', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
    { id: '2', image: 'https://images.unsplash.com/photo-1552508744-1696d4464960?w=400&q=80' },
    { id: '3', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' },
    { id: '4', image: 'https://images.unsplash.com/photo-1559333086-b0a56225a93c?w=400&q=80' },
    { id: '5', image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&q=80' },
    { id: '6', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80' },
];

export default function BusinessDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // Receive business details
    const params = useLocalSearchParams();
    const { topic, shortCode } = params;

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.btnText}>Use</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="eye-outline" size={20} color={theme.text} />
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
                    <Text style={[styles.headerTitle, { color: theme.text }]}>{topic}</Text>
                    <Text style={[styles.headerSub, { color: theme.textLight }]}>{shortCode} Collection</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Templates Grid */}
            <FlatList
                data={MOCK_BUSINESS_TEMPLATES}
                renderItem={renderTemplate}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridWrapper}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Designs</Text>
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
    headerTitle: { fontSize: 18, fontWeight: 'bold', maxWidth: 250 },
    headerSub: { fontSize: 12, marginTop: 2 },
    
    content: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 15 },
    gridWrapper: { justifyContent: 'space-between' },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15 },

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