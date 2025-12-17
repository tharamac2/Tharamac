import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { image } = params; // URI string passed from EventDetails

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Editor</Text>

        <TouchableOpacity onPress={() => alert('Saved to Gallery!')}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas Area */}
      <View style={styles.canvas}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>

      {/* Bottom Tools */}
      <View style={styles.footer}>
        <Tool icon="text" label="Text" />
        <Tool icon="happy" label="Sticker" />
        <Tool icon="color-filter" label="Filter" />
        <Tool icon="crop" label="Crop" />
      </View>
    </SafeAreaView>
  );
}

const Tool = ({ icon, label }) => (
  <TouchableOpacity style={styles.tool}>
    <Ionicons name={icon} size={24} color="#FFF" />
    <Text style={styles.toolLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  save: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  canvas: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '80%' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  tool: { alignItems: 'center' },
  toolLabel: { color: '#AAA', fontSize: 12, marginTop: 5 },
});
