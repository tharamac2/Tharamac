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

// Mock Videos
const MOCK_VIDEOS = [
    { id: '1', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' },
    { id: '2', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80' },
    { id: '3', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&q=80' },
    { id: '4', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?w=400&q=80' },
];

export default function VideoEventDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // Receive event name and date
    const params = useLocalSearchParams();
    const { eventName, date } = params;

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            
            {/* Play Icon Overlay */}
            <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.8)" />
            </View>

            <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.btnText}>Customize</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="download-outline" size={20} color={theme.text} />
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

            {/* Templates Grid */}
            <FlatList
                data={MOCK_VIDEOS}
                renderItem={renderTemplate}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridWrapper}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Video Templates</Text>
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
    cardImage: { width: '100%', height: 220 },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
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