import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
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
    '#9C27B0', '#F44336', '#2196F3', '#009688', '#795548', '#FFFFFF'
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
    const [fontFamily, setFontFamily] = useState('System');
    const [textSize, setTextSize] = useState(28);
    const [footerBg, setFooterBg] = useState('rgba(255,255,255,0.95)');
    const [footerTextColor, setFooterTextColor] = useState('#1A237E');
    const [overlayImage, setOverlayImage] = useState(null);
    
    // --- AUTO-FETCH DATA ---
    useEffect(() => {
        const fetchProfileFromDB = async () => {
            try {
                const session = await AsyncStorage.getItem('userSession');
                if (session) {
                    const sessionData = JSON.parse(session);
                    const userPhone = sessionData.phone; 
                    const response = await fetch(`${API_BASE_URL}/get_profile.php?phone=${userPhone}`);
                    const json = await response.json();
                    if (json.status === 'success') {
                        setProfile(json.data);
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

    // --- HANDLERS ---
    const handleEditStyle = () => {
        const fonts = Platform.OS === 'ios' ? ['System', 'Georgia', 'Courier', 'Times New Roman'] : ['normal', 'monospace', 'serif', 'sans-serif-light'];
        const next = fonts[(fonts.indexOf(fontFamily) + 1) % fonts.length];
        setFontFamily(next);
    };

    const handleBackgroundChange = () => {
        const bgConfigs = [
            { bg: 'rgba(255,255,255,0.95)', text: '#1A237E' }, 
            { bg: '#1A237E', text: '#FFFFFF' },
            { bg: '#000000', text: '#FFFFFF' },
            { bg: '#F5F5F5', text: '#333333' },
            { bg: '#FFD700', text: '#000000' },
            { bg: '#008080', text: '#FFFFFF' },
            { bg: '#E91E63', text: '#FFFFFF' },
            { bg: '#4CAF50', text: '#FFFFFF' }
        ];
        const currentIndex = bgConfigs.findIndex(c => c.bg === footerBg);
        const next = bgConfigs[(currentIndex + 1) % bgConfigs.length];
        setFooterBg(next.bg);
        setFooterTextColor(next.text);
    };

    const handleAddPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
        if (!result.canceled) setOverlayImage(result.assets[0].uri);
    };

    const confirmDelete = (type) => {
        Alert.alert("Delete Item", `Are you sure you want to remove this ${type}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => {
                if(type === 'text') { setRecipientName(''); panText.setValue({x:0, y:0}); }
                else { setOverlayImage(null); panPhoto.setValue({x:0, y:0}); }
            }}
        ]);
    };

    const handleAction = async () => {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 45 : 10 }]}>
                    <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={30} color={theme.text} /></TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>Editor</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Tool Section */}
                    <View style={styles.topSection}>
                        <View style={styles.labelRow}>
                            <Text style={[styles.label, { color: theme.textLight }]}>Recipient Name:</Text>
                            <TouchableOpacity onPress={handleEditStyle} style={styles.fontBtn}>
                                <Ionicons name="text" size={16} color={theme.primary} />
                                <Text style={{ color: theme.primary, fontWeight: '700', marginLeft: 5 }}>Change Font</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                            placeholder="Type name here..."
                            value={recipientName}
                            onChangeText={setRecipientName}
                        />

                        {/* Color Picker */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPickerRow}>
                            {TEXT_COLORS.map((color) => (
                                <TouchableOpacity 
                                    key={color} 
                                    onPress={() => setNameColor(color)}
                                    style={[styles.colorCircle, { backgroundColor: color, borderColor: nameColor === color ? theme.primary : '#DDD', borderWidth: nameColor === color ? 3 : 1 }]}
                                />
                            ))}
                        </ScrollView>

                        {/* ✅ TEXT SIZE SLIDER */}
                        <View style={styles.sliderRow}>
                            <Ionicons name="resize" size={20} color={theme.textLight} />
                            <Slider
                                style={{ flex: 1, height: 40, marginLeft: 10 }}
                                minimumValue={18}
                                maximumValue={80}
                                step={1}
                                value={textSize}
                                onValueChange={(val) => setTextSize(val)}
                                minimumTrackTintColor={theme.primary}
                                maximumTrackTintColor="#DDD"
                                thumbTintColor={theme.primary}
                            />
                            <Text style={{color: theme.textLight, marginLeft: 5, fontSize: 12}}>{Math.round(textSize)}</Text>
                        </View>
                    </View>

                    {/* Canvas Area */}
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
                                    {/* ✅ FIXED: Applied textSize and fontFamily state here */}
                                    <Text style={[
                                        styles.overlayRecipient, 
                                        { color: nameColor, fontSize: textSize, fontFamily: fontFamily }
                                    ]}>
                                        {recipientName}
                                    </Text>
                                </Animated.View>
                            )}

                            {/* Business Footer */}
                            <View style={[styles.businessFooter, { backgroundColor: footerBg }]}>
                                <View style={styles.footerRow}>
                                    <View style={styles.logoContainer}>
                                        {profile?.company_logo ? (
                                            <Image source={{ uri: profile.company_logo }} style={styles.logoImage} resizeMode="contain" />
                                        ) : (
                                            <Ionicons name="business" size={24} color={footerTextColor} />
                                        )}
                                    </View>
                                    <View style={styles.detailsContainer}>
                                        <Text style={[styles.bizName, { color: footerTextColor }]} numberOfLines={1}>
                                            {profile?.company_name || "Company Name"}
                                        </Text>
                                        <Text style={[styles.bizAddress, { color: footerTextColor }]} numberOfLines={2}>
                                            {profile?.company_address || "Address not set"}
                                        </Text>
                                        <View style={styles.contactRow}>
                                            <Text style={[styles.contactText, { color: footerTextColor }]}>
                                                📞 {profile?.company_phone || profile?.phone || "No Phone"}
                                            </Text>
                                            {profile?.website && (
                                                <Text style={[styles.contactText, { color: footerTextColor, marginLeft: 8 }]}>
                                                    🌐 {profile.website}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ViewShot>

                    {/* Buttons Section */}
                    <View style={styles.buttonSection}>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.btn} onPress={handleAddPhoto}>
                                <Ionicons name="image-outline" size={20} color={theme.primary} />
                                <Text style={styles.btnLabel}>Add Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={handleBackgroundChange}>
                                <Ionicons name="color-fill-outline" size={20} color={theme.primary} />
                                <Text style={styles.btnLabel}>Background</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={[styles.row, { marginTop: 12 }]}>
                            <TouchableOpacity style={[styles.btn, styles.waBtn]} onPress={handleAction}>
                                <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                                <Text style={styles.whiteText}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={handleAction}>
                                <Ionicons name="share-social-outline" size={20} color="#FFF" />
                                <Text style={styles.whiteText}>Share</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row, { marginTop: 12 }]}>
                            <TouchableOpacity 
                                style={[styles.delBtn, { borderColor: recipientName ? '#FF5252' : '#EEE' }]} 
                                onPress={() => confirmDelete('text')}
                                disabled={!recipientName}
                            >
                                <Ionicons name="trash-outline" size={18} color={recipientName ? "#FF5252" : "#CCC"} />
                                <Text style={[styles.delText, { color: recipientName ? "#FF5252" : "#CCC" }]}>Delete Name</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.delBtn, { borderColor: overlayImage ? '#FF5252' : '#EEE' }]} 
                                onPress={() => confirmDelete('photo')}
                                disabled={!overlayImage}
                            >
                                <Ionicons name="trash-outline" size={18} color={overlayImage ? "#FF5252" : "#CCC"} />
                                <Text style={[styles.delText, { color: overlayImage ? "#FF5252" : "#CCC" }]}>Delete Photo</Text>
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
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    label: { fontSize: 14, fontWeight: '700' },
    fontBtn: { flexDirection: 'row', alignItems: 'center' },
    input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 15 },
    colorPickerRow: { marginTop: 15, flexDirection: 'row' },
    colorCircle: { width: 34, height: 34, borderRadius: 17, marginRight: 12 },
    sliderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    canvas: { width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EEE' },
    image: { width: '100%', height: '100%' },
    draggableWrapper: { position: 'absolute', zIndex: 100 },
    userOverlay: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#FFF' },
    overlayRecipient: { fontWeight: 'bold', textAlign: 'center' },
    businessFooter: { position: 'absolute', bottom: 0, width: '100%', paddingVertical: 10, paddingHorizontal: 10 },
    footerRow: { flexDirection: 'row', alignItems: 'center' },
    logoContainer: { width: 45, height: 45, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
    logoImage: { width: '100%', height: '100%' },
    detailsContainer: { flex: 1 },
    bizName: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    bizAddress: { fontSize: 8, marginTop: 1 },
    contactRow: { flexDirection: 'row', marginTop: 2 },
    contactText: { fontSize: 8, fontWeight: '700' },
    buttonSection: { marginTop: 25, paddingBottom: 40 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    btn: { flex: 0.48, height: 48, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDD' },
    btnLabel: { marginLeft: 8, fontWeight: 'bold' },
    waBtn: { backgroundColor: '#25D366', borderColor: '#25D366' },
    whiteText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
    delBtn: { flex: 0.48, height: 45, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    delText: { marginLeft: 6, fontWeight: 'bold', fontSize: 13 }
});