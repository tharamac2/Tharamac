import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To get User Name
import * as FileSystem from 'expo-file-system'; // ✅ Import for Download
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing'; // ✅ Import for Sharing
import { useCallback, useContext, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

// REPLACE WITH YOUR COMPUTER'S IP
const API_BASE = 'http://192.168.0.11/api'; 

export default function EventDetailsScreen() {
    const router = useRouter();
    const { theme } = useContext(UserContext);
    
    // Receive params (Event Name & Date) from AllProducts
    const params = useLocalSearchParams();
    const { eventName, date } = params;

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 1. FETCH TEMPLATES FOR THIS SPECIFIC EVENT
    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            // Send eventName and date to filter results
            const url = `${API_BASE}/get_event_templates.php?event_name=${encodeURIComponent(eventName)}&event_date=${encodeURIComponent(date)}`;
            const response = await fetch(url);
            const json = await response.json();
            
            if (json.status === 'success') {
                setTemplates(json.data);
            }
        } catch (error) {
            console.log("Error loading templates:", error);
        } finally {
            setLoading(false);
        }
    }, [eventName, date]);

    useFocusEffect(
        useCallback(() => {
            fetchTemplates();
        }, [fetchTemplates])
    );

    // 2. UPLOAD IMAGE TO SERVER
    const pickAndUploadImage = async () => {
        // Permission check
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Allow access to photos to upload.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            handleUpload(result.assets[0]);
        }
    };

    const handleUpload = async (imageAsset) => {
        setUploading(true);
        try {
            // Get User Details
            const jsonValue = await AsyncStorage.getItem('userSession');
            const user = jsonValue != null ? JSON.parse(jsonValue) : { name: 'Anonymous' };

            const formData = new FormData();
            formData.append('title', eventName);
            formData.append('uploaded_by', user.name);
            formData.append('event_name', eventName); // ✅ Tag with Event Name
            formData.append('event_date', date);      // ✅ Tag with Event Date

            const filename = imageAsset.uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: imageAsset.uri,
                name: filename,
                type: type,
            });

            const response = await fetch(`${API_BASE}/upload_event_template.php`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const json = await response.json();

            if (json.status === 'success') {
                Alert.alert("Success", "Template uploaded successfully!");
                fetchTemplates(); // Refresh list
            } else {
                Alert.alert("Error", json.message);
            }
        } catch (error) {
            Alert.alert("Error", "Upload failed. Check network.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    // 3. DOWNLOAD FUNCTION
    const handleDownload = async (imageUrl) => {
        try {
            const filename = imageUrl.split('/').pop();
            const fileUri = FileSystem.documentDirectory + filename;
            const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
            
            if (Platform.OS === 'android') {
                // Save to gallery requires extra permissions, simplified here to share
                Sharing.shareAsync(uri);
            } else {
                Sharing.shareAsync(uri);
            }
        } catch (e) {
            Alert.alert("Error", "Could not download image.");
        }
    };

    // 4. SHARE FUNCTION
    const handleShare = async (imageUrl) => {
        try {
            // Need to download locally first to share image properly
            const filename = imageUrl.split('/').pop();
            const fileUri = FileSystem.documentDirectory + filename;
            await FileSystem.downloadAsync(imageUrl, fileUri);
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            Alert.alert("Error", "Could not share image.");
        }
    };

    const renderTemplate = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
            
            {/* User Info Overlay */}
            <View style={styles.userOverlay}>
                <Text style={styles.userText}>By {item.uploaded_by}</Text>
            </View>

            <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                
                {/* Download Button */}
                <TouchableOpacity 
                    style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}
                    onPress={() => handleDownload(item.image_url)}
                >
                    <Ionicons name="download-outline" size={20} color={theme.text} />
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity 
                    style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}
                    onPress={() => handleShare(item.image_url)}
                >
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

            {/* Grid List */}
            <FlatList
                data={templates}
                renderItem={renderTemplate}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.gridWrapper}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Text style={{ color: theme.textLight }}>No templates yet. Be the first to upload!</Text>
                        </View>
                    )
                }
                ListHeaderComponent={
                    <View style={{ marginBottom: 20 }}>
                        {/* Upload Button */}
                        <TouchableOpacity 
                            style={[styles.uploadBtn, { borderColor: theme.primary }]} 
                            onPress={pickAndUploadImage}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <ActivityIndicator color={theme.primary} />
                            ) : (
                                <>
                                    <Ionicons name="cloud-upload-outline" size={28} color={theme.primary} />
                                    <Text style={[styles.uploadText, { color: theme.primary }]}>
                                        Upload Design for {date}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>
                            Available Designs
                        </Text>
                    </View>
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
    
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    gridWrapper: { justifyContent: 'space-between' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', marginTop: 50 },

    uploadBtn: {
        height: 80,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        marginBottom: 10
    },
    uploadText: { fontSize: 14, fontWeight: '600', marginTop: 5 },

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
    userOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 5
    },
    userText: { color: '#FFF', fontSize: 10, textAlign: 'center' },
    
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
    iconBtn: { padding: 6, borderRadius: 6, marginLeft: 4 }
});