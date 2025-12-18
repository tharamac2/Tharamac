import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useContext } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { UserContext } from '../../../src/context/UserContext';

// Templates for this event (New Year’s Day)
const MOCKTEMPLATES = [
  { id: 1, image: require('../../../assets/images/posters/new-year/ny1.jpg') },
  { id: 2, image: require('../../../assets/images/posters/new-year/ny2.jpg') },
  { id: 3, image: require('../../../assets/images/posters/new-year/ny3.jpg') },
  { id: 4, image: require('../../../assets/images/posters/new-year/ny4.jpg') },
];

export default function EventDetailsScreen() {
  const router = useRouter();
  const { theme } = useContext(UserContext);
  const params = useLocalSearchParams();
  const { eventName, date } = params;

  // EDIT: open editor with this template
  const handleEdit = (image) => {
    const asset = Image.resolveAssetSource(image);
    router.push({
      pathname: '/(main)/editor',
      params: { image: asset.uri }, // URI string for editor
    });
  };

  // DOWNLOAD: save local bundled image to gallery
const handleDownload = async (image) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();  // ✅ no options
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to save images.');
      return;
    }

    const asset = await Asset.fromModule(image).downloadAsync();
    const localUri = asset.localUri || asset.uri;
    await MediaLibrary.createAssetAsync(localUri);
    Alert.alert('Saved!', 'Image saved to your Gallery successfully.');
  } catch (error) {
    console.error('Download Error:', error);
    Alert.alert('Error', `Could not save image. Try again.\n${String(error)}`);
  }
};




  // SHARE: share local bundled image
  const handleShare = async (image) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device.');
        return;
      }

      const asset = await Asset.fromModule(image).downloadAsync();
      const sourceUri = asset.localUri || asset.uri;

      await Sharing.shareAsync(sourceUri);
    } catch (error) {
      console.error('Share Error:', error);
      Alert.alert('Error', `Could not share image.\n${String(error)}`);
    }
  };

  const renderTemplate = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Image source={item.image} style={styles.cardImage} resizeMode="cover" />

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.primary }]}
          onPress={() => handleEdit(item.image)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}
          onPress={() => handleDownload(item.image)}
        >
          <Ionicons name="download-outline" size={20} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.inputBg }]}
          onPress={() => handleShare(item.image)}
        >
          <Ionicons name="share-social-outline" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.statusBarStyle || 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Language tabs */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {['All', 'English', 'Hindi', 'Tamil', 'Marathi'].map((lang, index) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: index === 0 ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: index === 0 ? '#FFF' : theme.text },
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Templates grid */}
        <FlatList
          data={MOCKTEMPLATES}
          renderItem={renderTemplate}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.gridWrapper}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Select a Design
            </Text>
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerDate: {
    fontSize: 13,
    marginTop: 2,
  },
  filterContainer: {
    marginVertical: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gridWrapper: {
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardFooter: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 6,
  },
  btnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconBtn: {
    padding: 6,
    borderRadius: 6,
    marginLeft: 4,
  },
});
