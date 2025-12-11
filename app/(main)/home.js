import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../constants/Colors';

// Placeholder data for categories
const CATEGORIES = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Business' },
  { id: 3, name: 'Festivals' },
  { id: 4, name: 'Daily Quotes' },
  { id: 5, name: 'Offers' },
];

// Placeholder data for templates
const FEATURED_TEMPLATES = [
  { id: 1, title: 'Mega Sale', image: 'https://via.placeholder.com/300x300/6C63FF/FFFFFF?text=Sale' },
  { id: 2, title: 'Diwali Wish', image: 'https://via.placeholder.com/300x300/FF6347/FFFFFF?text=Diwali' },
  { id: 3, title: 'Morning Quote', image: 'https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=Quote' },
  { id: 4, title: 'Hiring Now', image: 'https://via.placeholder.com/300x300/FFC107/000000?text=Hiring' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  const handleTemplatePress = (id) => {
    // Navigate to the editor with this template ID
    router.push(`/(editor)/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, User!</Text>
            <Text style={styles.brandName}>Tharamac</Text>
          </View>
          {/* Profile Icon Placeholder */}
          <TouchableOpacity onPress={() => router.push('/(main)/profile')}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitials}>U</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput 
            placeholder="Search templates (e.g., Offer, Monday)..." 
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* Banner / Premium Ad */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Unlock Premium Designs</Text>
          <Text style={styles.bannerSubText}>Get 5000+ templates for your business.</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        {/* Categories (Horizontal Scroll) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryChip, activeCategory === cat.name && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.name)}
            >
              <Text style={[styles.categoryText, activeCategory === cat.name && styles.categoryTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Templates Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Templates</Text>
          <TouchableOpacity onPress={() => router.push('/(main)/templates')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {FEATURED_TEMPLATES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => handleTemplatePress(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardFooter}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 80, // Space for bottom tab bar if you add one later
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textLight,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  banner: {
    marginHorizontal: 20,
    backgroundColor: Colors.secondary, // Dark background
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  bannerText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bannerSubText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingLeft: 20,
    marginBottom: 25,
  },
  categoryChip: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.text,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: Colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // 2 columns
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardFooter: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});