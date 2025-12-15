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

const MOCK_BROCHURES = [
    { id: '1', image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?w=400&q=80' },
    { id: '2', image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&q=80' },
    { id: '3', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
    { id: '4', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' },
];

export default function BrochureDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    const params = useLocalSearchParams();
    const { type, code } = params;

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.btnText}>Use Design</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}>
                    <Ionicons name="eye-outline" size={20} color={theme.text} />
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
                    <Text style={[styles.headerTitle, { color: theme.text }]}>{type}</Text>
                    <Text style={[styles.headerSub, { color: theme.textLight }]}>{code} Series</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Templates Grid */}
            <FlatList
                data={MOCK_BROCHURES}
                renderItem={renderTemplate}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridWrapper}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Brochure Templates</Text>
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
    cardImage: { width: '100%', height: 200 },
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