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

// Mock Templates for Greetings
const MOCK_TEMPLATES = [
    { id: '1', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80' },
    { id: '2', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?w=400&q=80' },
    { id: '3', image: 'https://images.unsplash.com/photo-1496360166961-10a51d5f367a?w=400&q=80' },
    { id: '4', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=400&q=80' },
    { id: '5', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80' },
    { id: '6', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80' },
];

export default function GreetingsEventDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // ✅ Receive event name and date
    const params = useLocalSearchParams();
    const { eventName, date } = params;

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.btnText}>Customize</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="heart-outline" size={20} color={theme.text} />
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
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose a Greeting</Text>
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