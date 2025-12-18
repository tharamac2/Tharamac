import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    PanResponder,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import ViewShot from "react-native-view-shot";
import { UserContext } from '../../../src/context/UserContext';

// ✅ IMPORT API CONFIG
import { API_BASE_URL } from '../../../src/config/ApiConfig';

const TEXT_COLORS = [
    '#E91E63', '#1A237E', '#000000', '#4CAF50', '#FF9800', 
    '#9C27B0', '#F44336', '#2196F3', '#009688', '#795548'
];

export default function EditorScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    const { image } = useLocalSearchParams();
    const viewShotRef = useRef();

    // --- STATES ---
    const [profile, setProfile] = useState(null);
    const [recipientName, setRecipientName] = useState('');
    const [nameColor, setNameColor] = useState('#E91E63'); 
    const [footerBg, setFooterBg] = useState('rgba(255,255,255,0.95)');
    const [footerTextColor, setFooterTextColor] = useState('#1A237E');
    const [overlayImage, setOverlayImage] = useState(null);
    
    // --- 1. AUTO-FETCH DATA ---
    useEffect(() => {
        const fetchProfileFromDB = async () => {
            try {
                const session = await AsyncStorage.getItem('userSession');
                if (session) {
                    const sessionData = JSON.parse(session);
                    const userPhone = sessionData.phone; 

                    console.log("Fetching profile for:", userPhone);

                    const response = await fetch(`${API_BASE_URL}/get_profile.php?phone=${userPhone}`);
                    const json = await response.json();

                    console.log("API Response:", json); // ✅ CHECK YOUR CONSOLE FOR THIS

                    if (json.status === 'success') {
                        setProfile(json.data);
                    } else {
                        Alert.alert("Notice", "Profile not found. Please set up your business profile.");
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfileFromDB();
    }, []);

    // --- DRAG SETUP ---
    const panText = useRef(new Animated.ValueXY()).current;
    const panPhoto = useRef(new Animated.ValueXY()).current;

    const createPanResponder = (panValue) => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            panValue.setOffset({ x: panValue.x._value, y: panValue.y._value });
            panValue.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: panValue.x, dy: panValue.y }], { useNativeDriver: false }),
        onPanResponderRelease: () => { panValue.flattenOffset(); },
    });

    const textPanResponder = useRef(createPanResponder(panText)).current;
    const photoPanResponder = useRef(createPanResponder(panPhoto)).current;

    const handleAddPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
        if (!result.canceled) setOverlayImage(result.assets[0].uri);
    };

    const confirmDelete = (type) => {
        Alert.alert("Delete", `Remove this ${type}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => {
                if(type === 'text') { setRecipientName(''); panText.setValue({x:0, y:0}); }
                else { setOverlayImage(null); panPhoto.setValue({x:0, y:0}); }
            }}
        ]);
    };

    const handleAction = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            await Sharing.shareAsync(uri);
        } catch (e) { console.log(e); }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                
                <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 45 : 10 }]}>
                    <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={30} color={theme.text} /></TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>Editor</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* INPUT SECTION */}
                    <View style={styles.topSection}>
                        <Text style={[styles.label, { color: theme.textLight }]}>Recipient Name:</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                            placeholder="Type name here..."
                            value={recipientName}
                            onChangeText={setRecipientName}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPickerRow}>
                            {TEXT_COLORS.map((color) => (
                                <TouchableOpacity 
                                    key={color} 
                                    onPress={() => setNameColor(color)}
                                    style={[styles.colorOption, { backgroundColor: color, borderColor: nameColor === color ? '#000' : 'transparent' }]}
                                >
                                    {nameColor === color && <Ionicons name="checkmark" size={16} color="white" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* CANVAS AREA */}
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1.0 }}>
                        <View style={styles.canvas}>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                            
                            {overlayImage && (
                                <Animated.View {...photoPanResponder.panHandlers} style={[panPhoto.getLayout(), styles.draggableWrapper]}>
                                    <Image source={{ uri: overlayImage }} style={styles.userOverlay} />
                                </Animated.View>
                            )}
                            
                            {recipientName !== '' && (
                                <Animated.View {...textPanResponder.panHandlers} style={[panText.getLayout(), styles.draggableWrapper, { width: '100%' }]}>
                                    <Text style={[styles.overlayRecipient, { color: nameColor }]}>{recipientName}</Text>
                                </Animated.View>
                            )}

                            {/* --- BUSINESS FOOTER --- */}
                            <View style={[styles.businessFooter, { backgroundColor: footerBg }]}>
                                <View style={styles.footerRow}>
                                    
                                    {/* 1. LOGO */}
                                    <View style={styles.logoContainer}>
                                        {profile?.company_logo ? (
                                            <Image source={{ uri: profile.company_logo }} style={styles.logoImage} resizeMode="contain" />
                                        ) : (
                                            <Ionicons name="business" size={24} color={footerTextColor} />
                                        )}
                                    </View>

                                    {/* 2. DETAILS (Stacked) */}
                                    <View style={styles.detailsContainer}>
                                        
                                        {/* Company Name */}
                                        <Text style={[styles.bizName, { color: footerTextColor }]} numberOfLines={1}>
                                            {profile?.company_name || "Company Name"}
                                        </Text>

                                        {/* Address - Force show 'Address not set' if null to debug */}
                                        <Text style={[styles.bizAddress, { color: footerTextColor }]} numberOfLines={2}>
                                            {profile?.company_address || "Address not set"}
                                        </Text>

                                        {/* Contact Row: Phone | Website */}
                                        <View style={styles.contactRow}>
                                            <Text style={[styles.contactText, { color: footerTextColor }]}>
                                                📞 {profile?.company_phone || profile?.phone || "No Phone"}
                                            </Text>
                                            
                                            {/* Show website if exists */}
                                            {profile?.website ? (
                                                <Text style={[styles.contactText, { color: footerTextColor, marginLeft: 8 }]}>
                                                    🌐 {profile.website}
                                                </Text>
                                            ) : null}
                                        </View>
                                        
                                        {/* Email */}
                                        {profile?.self_email ? (
                                            <Text style={[styles.contactText, { color: footerTextColor, marginTop: 2 }]}>
                                                ✉️ {profile.self_email}
                                            </Text>
                                        ) : null}
                                    </View>

                                </View>
                            </View>
                        </View>
                    </ViewShot>

                    {/* BUTTONS */}
                    <View style={styles.buttonSection}>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.btn} onPress={handleAddPhoto}>
                                <Ionicons name="image-outline" size={20} color={theme.primary} />
                                <Text style={styles.btnLabel}>Add Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => setFooterBg(footerBg === '#F5F5F5' ? 'rgba(255,255,255,0.95)' : '#F5F5F5')}>
                                <Ionicons name="color-fill-outline" size={20} color={theme.primary} />
                                <Text style={styles.btnLabel}>Toggle Footer</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={[styles.row, { marginTop: 12 }]}>
                            <TouchableOpacity style={[styles.btn, styles.whatsappBtn]} onPress={handleAction}>
                                <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                                <Text style={styles.whiteBtnText}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={handleAction}>
                                <Ionicons name="share-social-outline" size={20} color="#FFF" />
                                <Text style={styles.whiteBtnText}>Share</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row, { marginTop: 12 }]}>
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete('text')}>
                                <Ionicons name="trash-outline" size={18} color="#FF5252" />
                                <Text style={styles.deleteText}>Delete Name</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete('photo')}>
                                <Ionicons name="trash-outline" size={18} color="#FF5252" />
                                <Text style={styles.deleteText}>Delete Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold' },
    scrollContent: { padding: 20 },
    topSection: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
    input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 15, marginBottom: 15 },
    colorPickerRow: { flexDirection: 'row', paddingVertical: 5 },
    colorOption: { width: 34, height: 34, borderRadius: 17, marginRight: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    
    // Canvas
    canvas: { width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EEE', position: 'relative' },
    image: { width: '100%', height: '100%' },
    draggableWrapper: { position: 'absolute', zIndex: 100 },
    userOverlay: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#FFF' },
    overlayRecipient: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    
    // Footer Styles (Optimized for space)
    businessFooter: { 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        paddingVertical: 8, 
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)'
    },
    footerRow: { 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    logoContainer: { 
        width: 50, 
        height: 50, 
        marginRight: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 6,
        overflow: 'hidden'
    },
    logoImage: { width: '100%', height: '100%' },
    detailsContainer: { 
        flex: 1, 
        justifyContent: 'center' 
    },
    bizName: { fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
    bizAddress: { fontSize: 9, marginBottom: 2, opacity: 0.8 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
    contactText: { fontSize: 9, fontWeight: '600', marginRight: 8 },

    // Buttons
    buttonSection: { marginTop: 25, paddingBottom: 30 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    btn: { flex: 0.48, height: 48, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDD' },
    btnLabel: { marginLeft: 8, fontWeight: '600' },
    whatsappBtn: { backgroundColor: '#25D366', borderColor: '#25D366' },
    whiteBtnText: { color: '#FFF', marginLeft: 8, fontWeight: 'bold' },
    deleteBtn: { flex: 0.48, height: 40, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FF5252' },
    deleteText: { color: '#FF5252', marginLeft: 6, fontWeight: '600', fontSize: 13 }
});