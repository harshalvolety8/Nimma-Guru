import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, MapPin, Clock, Users, Award, Share2, MessageCircleHeart, BookOpen, CircleCheck as CheckCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { DemoGuru, DemoAppreciation } from '@/types/models';
import { Colors, Spacing, Radius } from '@/constants/theme';

type TabType = 'about' | 'schedule' | 'reviews';

export default function GuruDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [guru, setGuru] = useState<DemoGuru | null>(null);
  const [appreciations, setAppreciations] = useState<DemoAppreciation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('about');

  useEffect(() => {
    if (id) {
      fetchGuru();
      fetchAppreciations();
    }
  }, [id]);

  const fetchGuru = async () => {
    const { data } = await supabase.from('demo_gurus').select('*').eq('id', id).maybeSingle();
    if (data) setGuru(data as DemoGuru);
    setLoading(false);
  };

  const fetchAppreciations = async () => {
    const { data } = await supabase
      .from('demo_appreciations')
      .select('*')
      .eq('guru_id', id)
      .order('created_at', { ascending: false });
    if (data) setAppreciations(data as DemoAppreciation[]);
  };

  const handleShare = async () => {
    if (!guru) return;
    try {
      await Share.share({
        message: `Meet ${guru.full_name} — a Nimma-Guru mentor offering free ${guru.skills.slice(0, 2).join(', ')} classes in ${guru.village}!`,
      });
    } catch {}
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.darkGrey} size="large" />
      </View>
    );
  }

  if (!guru) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Guru not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scheduleEntries = Object.entries(guru.available_hours);

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={{ uri: guru.photo_url }} style={styles.heroBg} blurRadius={3} />
        <View style={styles.heroOverlay} />

        <View style={styles.heroTopBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color={Colors.white} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleShare}>
            <Share2 size={20} color={Colors.white} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContent}>
          <Image source={{ uri: guru.photo_url }} style={styles.profilePic} />
          <Text style={styles.heroName}>{guru.full_name}</Text>
          <Text style={styles.heroAge}>Age {guru.age} • {guru.preferred_location}</Text>

          <View style={styles.heroLocationRow}>
            <MapPin size={14} color={Colors.lightGrey} strokeWidth={2} />
            <Text style={styles.heroLocation}>{guru.village}, {guru.street}</Text>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Star size={15} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
              <Text style={styles.heroStatValue}>{guru.rating.toFixed(1)}</Text>
              <Text style={styles.heroStatLabel}>Rating</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Users size={15} color={Colors.lightGrey} strokeWidth={2} />
              <Text style={styles.heroStatValue}>{guru.total_students_taught}</Text>
              <Text style={styles.heroStatLabel}>Students</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <MessageCircleHeart size={15} color={Colors.lightGrey} strokeWidth={2} />
              <Text style={styles.heroStatValue}>{guru.appreciation_count}</Text>
              <Text style={styles.heroStatLabel}>Thanks</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Clock size={15} color={Colors.lightGrey} strokeWidth={2} />
              <Text style={styles.heroStatValue}>{guru.hours_contributed}h</Text>
              <Text style={styles.heroStatLabel}>Contributed</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['about', 'schedule', 'reviews'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* About Tab */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <BookOpen size={18} color={Colors.darkGrey} strokeWidth={2} />
                <Text style={styles.cardTitle}>About</Text>
              </View>
              <Text style={styles.experienceText}>{guru.experience}</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Award size={18} color={Colors.darkGrey} strokeWidth={2} />
                <Text style={styles.cardTitle}>Skills & Expertise</Text>
              </View>
              <View style={styles.skillsGrid}>
                {guru.skills.map((skill) => (
                  <View key={skill} style={styles.skillBadge}>
                    <CheckCircle size={13} color={Colors.darkGrey} strokeWidth={2} />
                    <Text style={styles.skillBadgeText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Users size={18} color={Colors.darkGrey} strokeWidth={2} />
                <Text style={styles.cardTitle}>Languages</Text>
              </View>
              <View style={styles.languageRow}>
                {guru.languages.map((lang) => (
                  <View key={lang} style={styles.languageChip}>
                    <Text style={styles.languageChipText}>{lang}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <View style={styles.tabContent}>
            <Text style={styles.scheduleNote}>
              All sessions are free of charge at the preferred location. Contact the Guru to confirm availability.
            </Text>
            {scheduleEntries.map(([day, slots]) => (
              <View key={day} style={styles.scheduleCard}>
                <Text style={styles.scheduleDay}>{day}</Text>
                <View style={styles.slotsRow}>
                  {(slots as string[]).map((slot: string) => (
                    <View key={slot} style={styles.slotChip}>
                      <Clock size={12} color={Colors.darkGrey} strokeWidth={2} />
                      <Text style={styles.slotText}>{slot}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.scheduleLocation}>
                  <MapPin size={13} color={Colors.mediumGrey} strokeWidth={2} />
                  <Text style={styles.scheduleLocationText}>{guru.preferred_location}</Text>
                </View>
              </View>
            ))}
            {scheduleEntries.length === 0 && (
              <Text style={styles.emptySchedule}>No schedule available yet. Contact the Guru directly.</Text>
            )}
          </View>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            {appreciations.length === 0 ? (
              <View style={styles.emptyReviews}>
                <Text style={styles.emptyReviewsEmoji}>💝</Text>
                <Text style={styles.emptyReviewsText}>No appreciations yet</Text>
              </View>
            ) : (
              appreciations.map((appr) => (
                <View key={appr.id} style={styles.appreciationCard}>
                  <View style={styles.appreciationHeader}>
                    <View style={styles.appreciationAvatar}>
                      <Text style={styles.appreciationAvatarText}>
                        {appr.student_name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.appreciationStudent}>{appr.student_name}</Text>
                      <Text style={styles.appreciationDate}>
                        {new Date(appr.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.appreciationMessage}>{appr.message}</Text>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ultraLight,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ultraLight,
  },
  errorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.darkGrey,
    marginBottom: Spacing.md,
  },
  backButton: {
    backgroundColor: Colors.darkGrey,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
  },
  backButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    fontSize: 14,
  },
  hero: {
    height: 320,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  heroTopBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.white,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.charcoal,
  },
  heroName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: Colors.white,
    marginBottom: 2,
    textAlign: 'center',
  },
  heroAge: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.lightGrey,
    marginBottom: 4,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  heroLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.lightGrey,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  heroStat: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  heroStatValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: Colors.white,
  },
  heroStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 9,
    color: Colors.grey,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.darkGrey,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.grey,
  },
  tabTextActive: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.darkGrey,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.darkGrey,
  },
  experienceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 22,
  },
  skillsGrid: {
    gap: Spacing.sm,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ultraLight,
  },
  skillBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  languageChip: {
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  languageChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.white,
  },
  scheduleNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.mediumGrey,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  scheduleDay: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: Spacing.sm,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.ultraLight,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  slotText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.darkGrey,
  },
  scheduleLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleLocationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  emptySchedule: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyReviews: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  emptyReviewsEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyReviewsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.grey,
  },
  appreciationCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  appreciationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  appreciationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appreciationAvatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  appreciationStudent: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  appreciationDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.grey,
  },
  appreciationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
