import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Search, ChevronRight, Star, Award, BookOpen, Users } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { DemoGuru } from '@/types/models';
import { Colors, Spacing, Radius, SKILL_CATEGORIES } from '@/constants/theme';
import GuruCard from '@/components/GuruCard';

const { width } = Dimensions.get('window');

const FEATURED_CATEGORIES = [
  { label: 'Mathematics', emoji: '📐' },
  { label: 'Science', emoji: '🔬' },
  { label: 'English', emoji: '📚' },
  { label: 'Kannada', emoji: '🌿' },
  { label: 'Computer Science', emoji: '💻' },
  { label: 'Music', emoji: '🎵' },
  { label: 'Arts & Crafts', emoji: '🎨' },
  { label: 'History', emoji: '🏛️' },
];

export default function HomeScreen() {
  const [gurus, setGurus] = useState<DemoGuru[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGurus();
  }, []);

  const fetchGurus = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('demo_gurus').select('*').eq('is_active', true);
    if (!error && data) setGurus(data as DemoGuru[]);
    setLoading(false);
  };

  const featuredGurus = gurus.slice(0, 4);
  const topGurus = [...gurus].sort((a, b) => b.rating - a.rating).slice(0, 3);

  const totalStudents = gurus.reduce((sum, g) => sum + g.total_students_taught, 0);
  const totalHours = gurus.reduce((sum, g) => sum + g.hours_contributed, 0);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: '/(tabs)/search', params: { q: searchQuery.trim() } });
    } else {
      router.push('/(tabs)/search');
    }
  };

  const handleCategoryPress = (category: string) => {
    router.push({ pathname: '/(tabs)/search', params: { skill: category } });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextRow}>
            <Text style={styles.headerTag}>ನಿಮ್ಮ ಗುರು</Text>
          </View>
          <Text style={styles.headerTitle}>Nimma-Guru</Text>
          <Text style={styles.headerSubtitle}>
            Connecting retired professionals with students for free community mentorship
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Users size={18} color={Colors.white} strokeWidth={2} />
            <Text style={styles.statNumber}>{gurus.length}</Text>
            <Text style={styles.statLabel}>Active Gurus</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <BookOpen size={18} color={Colors.white} strokeWidth={2} />
            <Text style={styles.statNumber}>{totalStudents}</Text>
            <Text style={styles.statLabel}>Students Helped</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Award size={18} color={Colors.white} strokeWidth={2} />
            <Text style={styles.statNumber}>{totalHours}</Text>
            <Text style={styles.statLabel}>Hours Shared</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={handleSearch} activeOpacity={0.9}>
          <Search size={20} color={Colors.mediumGrey} strokeWidth={2} />
          <Text style={styles.searchPlaceholder}>Search by skill, name, or location...</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {FEATURED_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={styles.categoryChip}
              onPress={() => handleCategoryPress(cat.label)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Gurus */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Gurus</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')} style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color={Colors.darkGrey} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.darkGrey} style={{ marginVertical: 24 }} />
        ) : (
          featuredGurus.map((guru) => (
            <GuruCard
              key={guru.id}
              guru={guru}
              onPress={() => router.push(`/guru/${guru.id}`)}
            />
          ))
        )}
      </View>

      {/* Wall of Fame Preview */}
      <View style={styles.fameSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleLight}>Wall of Fame</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/fame')} style={styles.seeAllLight}>
            <Text style={styles.seeAllTextLight}>View all</Text>
            <ChevronRight size={14} color={Colors.white} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text style={styles.fameSubtitle}>Our most appreciated mentors this month</Text>

        {topGurus.map((guru, index) => (
          <TouchableOpacity
            key={guru.id}
            style={styles.fameCard}
            onPress={() => router.push(`/guru/${guru.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.fameRank}>
              <Text style={styles.fameRankText}>{index + 1}</Text>
            </View>
            <Image source={{ uri: guru.photo_url }} style={styles.fameAvatar} />
            <View style={styles.fameInfo}>
              <Text style={styles.fameName}>{guru.full_name}</Text>
              <Text style={styles.fameSkills}>{guru.skills.slice(0, 2).join(' • ')}</Text>
            </View>
            <View style={styles.fameStats}>
              <Star size={13} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
              <Text style={styles.fameRating}>{guru.rating.toFixed(1)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mission Statement */}
      <View style={styles.missionCard}>
        <Text style={styles.missionTitle}>Gyaan-Daan</Text>
        <Text style={styles.missionSubtitle}>ಜ್ಞಾನ-ದಾನ</Text>
        <Text style={styles.missionText}>
          A non-commercial platform where retired professionals give back to the community through free knowledge sharing. No fees. No ads. Pure mentorship.
        </Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.85}
        >
          <Text style={styles.joinButtonText}>Become a Guru</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ultraLight,
  },
  header: {
    backgroundColor: Colors.darkGrey,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    marginBottom: Spacing.lg,
  },
  headerTextRow: {
    marginBottom: Spacing.xs,
  },
  headerTag: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.grey,
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.lightGrey,
    lineHeight: 21,
    maxWidth: 280,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.lightGrey,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: -24,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchPlaceholder: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey,
    flex: 1,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.darkGrey,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.darkGrey,
  },
  categoriesRow: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 88,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: Colors.darkGrey,
    textAlign: 'center',
  },
  fameSection: {
    backgroundColor: Colors.charcoal,
    margin: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitleLight: {
    fontFamily: 'Playfair-Bold',
    fontSize: 20,
    color: Colors.white,
  },
  seeAllLight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllTextLight: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.lightGrey,
  },
  fameSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.grey,
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  fameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  fameRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fameRankText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: Colors.white,
  },
  fameAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkMedium,
  },
  fameInfo: {
    flex: 1,
  },
  fameName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 2,
  },
  fameSkills: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.grey,
  },
  fameStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  fameRating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.white,
  },
  missionCard: {
    margin: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  missionTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 26,
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  missionSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: Spacing.md,
  },
  missionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  joinButton: {
    backgroundColor: Colors.darkGrey,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  joinButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
});
