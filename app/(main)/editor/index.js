import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot from "react-native-view-shot";
import { UserContext } from '../../../src/context/UserContext';

export default function EditorScreen() {
    const router = useRouter();
    const { theme, user } = useContext(UserContext);
    const { image } = useLocalSearchParams();
    
    // Ref for capturing the image
    const viewShotRef = useRef();

    // State for user input
    const [recipientName, setRecipientName] = useState('');
    const [selectedTab, setSelectedTab] = useState('Text');

    // Profile Details
    const businessName = user?.businessName || "Your Business Name";
    const phoneNumber = user?.phone || "9445438846";
    const website = user?.website || "www.yourwebsite.com";

    // --- SAVE TO GALLERY FUNCTION ---
    const handleSave = async () => {
        try {
            // Request only 'photo' permissions specifically
            const { status } = await MediaLibrary.requestPermissionsAsync(false); 
            
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Please allow gallery access in settings to save posters.");
                return;
            }

            const uri = await viewShotRef.current.capture();
            await MediaLibrary.createAssetAsync(uri);
            Alert.alert("Success ✅", "Poster saved to your mobile gallery!");
        } catch (error) {
            console.error(error);
            // If it still fails in Expo Go, it's likely the Android 14 restriction
            Alert.alert("Error", "Expo Go has limited gallery access on newer Android versions. You may need to create a 'Development Build'.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>Editor</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={[styles.save, { color: theme.primary }]}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* 1. REAL-TIME CANVAS PREVIEW (This part gets saved) */}
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1.0 }}>
                        <View style={[styles.canvas, { backgroundColor: '#FFF' }]}>
                            {image && (
                                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                            )}
                            
                            {/* Personalization Overlays */}
                            <View style={styles.overlayContainer}>
                                <Text style={styles.overlayRecipient}>
                                    {recipientName || ""}
                                </Text>

                                {/* Business Footer */}
                                <View style={styles.businessFooter}>
                                    <Text style={styles.bizName}>{businessName}</Text>
                                    <Text style={styles.bizTagline}>Digital Marketing & Services</Text>
                                    <View style={styles.bizContactRow}>
                                        <Text style={styles.bizContactText}>{phoneNumber}</Text>
                                        <Text style={styles.bizContactText}>{website}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ViewShot>

                    {/* 2. PERSONALIZATION TOOLS (Moved below the image) */}
                    <View style={styles.toolSection}>
                        <View style={styles.labelRow}>
                            <Text style={[styles.label, { color: theme.textLight }]}>Recipient Name:</Text>
                            <View style={styles.inputTools}>
                                <Ionicons name="color-wand-outline" size={18} color={theme.primary} />
                                <Text style={{ marginHorizontal: 8, color: theme.text, fontSize: 12 }}>Edit Styles</Text>
                            </View>
                        </View>
                        
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: theme.inputBg, 
                                color: theme.text, 
                                borderColor: theme.border 
                            }]}
                            placeholder="Type name here..."
                            placeholderTextColor={theme.textLight}
                            value={recipientName}
                            onChangeText={setRecipientName}
                        />

                        <View style={styles.quickActions}>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="image-outline" size={20} color={theme.primary} />
                                <Text style={[styles.actionText, { color: theme.text }]}>Add Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="color-palette-outline" size={20} color={theme.primary} />
                                <Text style={[styles.actionText, { color: theme.text }]}>Background</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Editor Tabs */}
                <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                    <Tool icon="text" label="Text" active={selectedTab === 'Text'} onPress={() => setSelectedTab('Text')} theme={theme} />
                    <Tool icon="happy" label="Sticker" active={selectedTab === 'Sticker'} onPress={() => setSelectedTab('Sticker')} theme={theme} />
                    <Tool icon="color-filter" label="Filter" active={selectedTab === 'Filter'} onPress={() => setSelectedTab('Filter')} theme={theme} />
                    <Tool icon="crop" label="Crop" active={selectedTab === 'Crop'} onPress={() => setSelectedTab('Crop')} theme={theme} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const Tool = ({ icon, label, active, onPress, theme }) => (
    <TouchableOpacity style={styles.tool} onPress={onPress}>
        <Ionicons name={active ? icon : `${icon}-outline`} size={22} color={active ? theme.primary : theme.textLight} />
        <Text style={[styles.toolLabel, { color: active ? theme.primary : theme.textLight }]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 1 },
    title: { fontSize: 18, fontWeight: 'bold' },
    save: { fontSize: 16, fontWeight: 'bold' },
    scrollContent: { padding: 15 },
    
    // Canvas Styling
    canvas: { 
        width: '100%', 
        aspectRatio: 1, 
        borderRadius: 12, 
        overflow: 'hidden', 
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        position: 'relative'
    },
    image: { width: '100%', height: '100%' },
    overlayContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    overlayRecipient: {
        fontSize: 26,
        fontWeight: '900',
        color: '#E91E63',
        textAlign: 'center',
        marginTop: '20%',
        textShadowColor: 'rgba(255,255,255,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    businessFooter: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 6,
        alignItems: 'center'
    },
    bizName: { fontSize: 13, fontWeight: 'bold', color: '#1A237E' },
    bizTagline: { fontSize: 9, color: '#555', textTransform: 'uppercase' },
    bizContactRow: { flexDirection: 'row', marginTop: 2 },
    bizContactText: { fontSize: 9, color: '#333', marginHorizontal: 8, fontWeight: '500' },

    // Tool Section
    toolSection: { marginTop: 20, paddingBottom: 20 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    label: { fontSize: 14, fontWeight: '700' },
    inputTools: { flexDirection: 'row', alignItems: 'center' },
    input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 15, fontSize: 16, marginBottom: 15 },
    quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
    actionBtn: { flex: 0.48, height: 45, borderRadius: 10, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    actionText: { marginLeft: 8, fontSize: 13, fontWeight: '600' },

    // Footer
    footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1 },
    tool: { alignItems: 'center', flex: 1 },
    toolLabel: { fontSize: 11, marginTop: 4 },
});