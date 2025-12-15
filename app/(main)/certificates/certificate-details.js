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

// Mock Certificate Templates (Horizontal usually)
const MOCK_CERTIFICATES = [
    { id: '1', image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400&q=80' },
    { id: '2', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80' },
    { id: '3', image: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&q=80' },
    { id: '4', image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&q=80' },
];

export default function CertificateDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // Receive certificate details
    const params = useLocalSearchParams();
    const { title, code } = params;

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
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
                    <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.headerSub, { color: theme.textLight }]}>{code} Collection</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Templates Grid (Full Width for Certificates usually) */}
            <FlatList
                data={MOCK_CERTIFICATES}
                renderItem={renderTemplate}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Professional Templates</Text>
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
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15 },

    // Cards (Full Width)
    card: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    cardImage: { width: '100%', height: 220 },
    cardFooter: { 
        flexDirection: 'row', 
        padding: 12, 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10
    },
    btnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    iconBtn: {
        padding: 10,
        borderRadius: 8,
        marginLeft: 5
    }
});