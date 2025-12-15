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

// Mock Templates for Motivation (Posters, Social Media quotes)
const MOCK_TEMPLATES = [
    { id: '1', image: 'https://images.unsplash.com/photo-1552508744-1696d4464960?w=400&q=80' },
    { id: '2', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' },
    { id: '3', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
    { id: '4', image: 'https://images.unsplash.com/photo-1533227297464-96878eedb0a9?w=400&q=80' },
    { id: '5', image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3a8?w=400&q=80' },
    { id: '6', image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80' },
];

export default function MotivationDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // Receive motivation details
    const params = useLocalSearchParams();
    const { title, tag } = params;

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.btnText}>Use</Text>
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
                    <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.headerSub, { color: theme.textLight }]}>{tag}</Text>
                </View>
                <View style={{ width: 40 }} />
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
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Inspiring Designs</Text>
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