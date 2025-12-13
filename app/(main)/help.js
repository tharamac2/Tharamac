import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Linking,
    Modal,
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

const Colors = { primary: '#FF3B30', background: '#F9F9F9', white: '#FFFFFF', chatUser: '#FF3B30', chatAI: '#E5E5EA' };

// --- FAQ DATA ---
const FAQS = [
    { id: 1, q: "How do I upgrade to Premium?", a: "Go to Profile > My Subscription and choose a plan that suits you." },
    { id: 2, q: "Can I download posters without watermark?", a: "Yes, watermarks are removed automatically for all Premium users." },
    { id: 3, q: "How do I change my business details?", a: "Navigate to Profile > Business Details to update your information." },
    { id: 4, q: "Is my data safe?", a: "Absolutely. We use industry-standard encryption to protect your data." },
    { id: 5, q: "How do I contact support?", a: "You can use the 'Chat with Us' feature or email us directly from this screen." },
];

export default function HelpScreen() {
    const router = useRouter();
    
    // --- STATE MANAGEMENT ---
    const [faqVisible, setFaqVisible] = useState(false);
    const [chatVisible, setChatVisible] = useState(false);
    const [messages, setMessages] = useState([
        { id: '1', text: "Hello! I'm your Tharamac AI assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    // --- 1. EMAIL SUPPORT ---
    const handleEmail = () => {
        Linking.openURL('mailto:support@tharamac.com?subject=Support Request');
    };

    // --- 2. CHAT FUNCTIONS ---
    const sendMessage = () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg = { 
                id: (Date.now() + 1).toString(), 
                text: "Thanks for reaching out! Our team will check this and get back to you shortly.", 
                sender: 'ai' 
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    // --- 3. FAQ ITEM COMPONENT ---
    const FAQItem = ({ item }) => {
        const [expanded, setExpanded] = useState(false);
        return (
            <TouchableOpacity style={styles.faqItem} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
                <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{item.q}</Text>
                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                </View>
                {expanded && <Text style={styles.faqAnswer}>{item.a}</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* 1. CHAT BUTTON */}
                <TouchableOpacity style={styles.card} onPress={() => setChatVisible(true)}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="chatbubbles" size={28} color="#2196F3" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Live Chat</Text>
                        <Text style={styles.cardSub}>Chat with our AI Assistant</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>

                {/* 2. EMAIL BUTTON */}
                <TouchableOpacity style={styles.card} onPress={handleEmail}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="mail" size={28} color="#F44336" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Email Support</Text>
                        <Text style={styles.cardSub}>support@tharamac.com</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>

                {/* 3. FAQ BUTTON */}
                <TouchableOpacity style={styles.card} onPress={() => setFaqVisible(true)}>
                    <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                        <Ionicons name="document-text" size={28} color="#4CAF50" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>FAQs</Text>
                        <Text style={styles.cardSub}>Common questions & answers</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>
            </View>

            {/* --- FAQ MODAL --- */}
            <Modal animationType="slide" visible={faqVisible} presentationStyle="pageSheet" onRequestClose={() => setFaqVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
                        <TouchableOpacity onPress={() => setFaqVisible(false)}>
                            <Ionicons name="close-circle" size={30} color="#999" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        {FAQS.map(item => <FAQItem key={item.id} item={item} />)}
                    </ScrollView>
                </View>
            </Modal>

            {/* --- LIVE CHAT MODAL --- */}
            <Modal animationType="slide" visible={chatVisible} onRequestClose={() => setChatVisible(false)}>
                <SafeAreaView style={styles.chatContainer}>
                    <View style={styles.chatHeader}>
                        <TouchableOpacity onPress={() => setChatVisible(false)}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.chatTitleContainer}>
                            <Text style={styles.chatTitle}>Tharamac Support</Text>
                            <View style={styles.onlineIndicator}>
                                <View style={styles.dot} />
                                <Text style={styles.onlineText}>Online</Text>
                            </View>
                        </View>
                        <View style={{ width: 24 }} />
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ padding: 15 }}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                            renderItem={({ item }) => (
                                <View style={[
                                    styles.msgBubble, 
                                    item.sender === 'user' ? styles.userMsg : styles.aiMsg
                                ]}>
                                    <Text style={[
                                        styles.msgText, 
                                        item.sender === 'user' ? { color: '#FFF' } : { color: '#000' }
                                    ]}>{item.text}</Text>
                                </View>
                            )}
                        />
                        
                        <View style={styles.inputArea}>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Type a message..." 
                                value={inputText}
                                onChangeText={setInputText}
                            />
                            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                                <Ionicons name="send" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    backBtn: { padding: 5 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
    
    content: { padding: 20 },
    card: { 
        backgroundColor: '#FFF', 
        padding: 20, 
        borderRadius: 16, 
        marginBottom: 15, 
        flexDirection: 'row', 
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOpacity: 0.05, 
        shadowRadius: 10, 
        elevation: 2 
    },
    iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    cardSub: { color: '#888', fontSize: 13, marginTop: 2 },

    // FAQ Styles
    modalContainer: { flex: 1, backgroundColor: '#F9F9F9' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#EEE', alignItems: 'center', marginTop: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    faqItem: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1, marginRight: 10 },
    faqAnswer: { marginTop: 10, fontSize: 14, color: '#666', lineHeight: 20 },

    // Chat Styles
    chatContainer: { flex: 1, backgroundColor: '#F5F5F5' },
    chatHeader: { backgroundColor: Colors.primary, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    chatTitleContainer: { alignItems: 'center' },
    chatTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    onlineIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 5 },
    onlineText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
    
    msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
    userMsg: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
    aiMsg: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 4 },
    msgText: { fontSize: 15 },
    
    inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, marginRight: 10, fontSize: 16 },
    sendBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});