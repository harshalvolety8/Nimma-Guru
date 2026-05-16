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
} from 'react-native';
import { router } from 'expo-router';
import { Trophy, Star, Users, Clock, MessageCircleHeart, Medal } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { DemoGuru, DemoAppreciation } from '@/types/models';
import { Colors, Spacing, Radius } from '@/constants/theme';

export default function WallOfFameScreen() {
  const [gurus, setGurus] = useState<DemoGuru[]>([]);
  const [appreciations, setAppreciations] = useState<DemoAppreciation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [guruRes, apprRes] = await Promise.all([
      supabase.from('demo_gurus').select('*').eq('is_active', true),
      supabase.from('demo_appreciations').select('*').order('created_at', { ascending: false }),
    ]);
    if (guruRes.data) {
      const sorted = (guruRes.data as DemoGuru[]).sort((a, b) => {
        const scoreA = a.rating * 20 + a.appreciation_count * 2 + a.total_students_taught;
        const scoreB = b.rating * 20 + b.appreciation_count * 2 + b.total_students_taught;
        return scoreB - scoreA;
      });
      setGurus(sorted);
    }
    if (apprRes.data) setAppreciations(apprRes.data as DemoAppreciation[]);
    setLoading(false);
  };

  const top3 = gurus.slice(0, 3);
  const rest = gurus.slice(3);

  const RANK_COLORS = [Colors.gold, Colors.silver, Colors.bronze];
  const RANK_LABELS = ['Gold', 'Silver', 'Bronze'];

  const getGuruName = (guruId: string) => {
    return gurus.find((g) => g.id === guruId)?.full_name ?? 'Unknown Guru';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.darkGrey} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Trophy size={32} color={Colors.gold} strokeWidth={2} />
        <Text style={styles.headerTitle}>Wall of Fame</Text>
        <Text style={styles.headerTitleKn}>ಗೌರವ ಗೋಡೆ</Text>
        <Text style={styles.headerSubtitle}>
          Celebrating our most dedicated community mentors
        </Text>
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podiumSection}>
        <Text style={styles.sectionTitle}>Top Gurus This Month</Text>

        {top3.map((guru, index) => (
          <TouchableOpacity
            key={guru.id}
            style={[styles.topCard, index === 0 && styles.topCardFirst]}
            onPress={() => router.push(`/guru/${guru.id}`)}
            activeOpacity={0.85}
          >
            {/* Rank badge */}
            <View style={[styles.rankBadge, { backgroundColor: RANK_COLORS[index] }]}>
              <Medal size={14} color={Colors.white} strokeWidth={2} />
              <Text style={styles.rankText}>{RANK_LABELS[index]}</Text>
            </View>

            <View style={styles.topCardInner}>
              <View style={styles.rankNumber}>
                <Text style={[styles.rankNumberText, { color: RANK_COLORS[index] }]}>#{index + 1}</Text>
              </View>

              <Image source={{ uri: guru.photo_url }} style={[styles.topAvatar, index === 0 && styles.topAvatarFirst]} />

              <View style={styles.topInfo}>
                <Text style={styles.topName}>{guru.full_name}</Text>
                <Text style={styles.topSkills}>{guru.skills.slice(0, 2).join(' • ')}</Text>
                <Text style={styles.topLocation}>{guru.village}</Text>

                <View style={styles.topStatsRow}>
                  <View style={styles.topStat}>
                    <Star size={12} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
                    <Text style={styles.topStatText}>{guru.rating.toFixed(1)}</Text>
                  </View>
                  <View style={styles.topStat}>
                    <Users size={12} color={Colors.mediumGrey} strokeWidth={2} />
                    <Text style={styles.topStatText}>{guru.total_students_taught}</Text>
                  </View>
                  <View style={styles.topStat}>
                    <MessageCircleHeart size={12} color={Colors.mediumGrey} strokeWidth={2} />
                    <Text style={styles.topStatText}>{guru.appreciation_count}</Text>
                  </View>
                  <View style={styles.topStat}>
                    <Clock size={12} color={Colors.mediumGrey} strokeWidth={2} />
                    <Text style={styles.topStatText}>{guru.hours_contributed}h</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Community Mentors</Text>
          {rest.map((guru, index) => (
            <TouchableOpacity
              key={guru.id}
              style={styles.leaderRow}
              onPress={() => router.push(`/guru/${guru.id}`)}
              activeOpacity={0.85}
            >
              <Text style={styles.leaderRank}>#{index + 4}</Text>
              <Image source={{ uri: guru.photo_url }} style={styles.leaderAvatar} />
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName}>{guru.full_name}</Text>
                <Text style={styles.leaderSkills}>{guru.skills.slice(0, 2).join(', ')}</Text>
              </View>
              <View style={styles.leaderStats}>
                <View style={styles.leaderStatRow}>
                  <Star size={11} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
                  <Text style={styles.leaderStatText}>{guru.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.leaderStudents}>{guru.total_students_taught} students</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recent Appreciations */}
      <View style={styles.appreciationsSection}>
        <Text style={styles.sectionTitle}>Recent Thank-You Notes</Text>
        <Text style={styles.sectionSubtitle}>Students celebrating their Gurus</Text>

        {appreciations.slice(0, 6).map((appr) => (
          <View key={appr.id} style={styles.appreciationCard}>
            <View style={styles.appreciationQuote}>
              <Text style={styles.quoteSymbol}>"</Text>
            </View>
            <View style={styles.appreciationContent}>
              <Text style={styles.appreciationMessage} numberOfLines={3}>{appr.message}</Text>
              <View style={styles.appreciationFooter}>
                <Text style={styles.appreciationFrom}>— {appr.student_name}</Text>
                <Text style={styles.appreciationTo}>to {getGuruName(appr.guru_id)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Stats banner */}
      <View style={styles.statsBanner}>
        <Text style={styles.statsBannerTitle}>Community Impact</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBlock}>
            <Text style={styles.statBlockNumber}>{gurus.length}</Text>
            <Text style={styles.statBlockLabel}>Active Gurus</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statBlockNumber}>
              {gurus.reduce((sum, g) => sum + g.total_students_taught, 0)}
            </Text>
            <Text style={styles.statBlockLabel}>Students Helped</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statBlockNumber}>
              {gurus.reduce((sum, g) => sum + g.hours_contributed, 0)}
            </Text>
            <Text style={styles.statBlockLabel}>Hours Shared</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statBlockNumber}>
              {gurus.reduce((sum, g) => sum + g.appreciation_count, 0)}
            </Text>
            <Text style={styles.statBlockLabel}>Appreciations</Text>
          </View>
        </View>
      </View>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
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
  },
  header: {
    backgroundColor: Colors.darkGrey,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 30,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  headerTitleKn: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey,
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.grey,
    textAlign: 'center',
    maxWidth: 260,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.darkGrey,
    marginBottom: 4,
    paddingHorizontal: Spacing.md,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.mediumGrey,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  podiumSection: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  topCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  topCardFirst: {
    borderWidth: 2,
    borderColor: Colors.gold + '60',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  rankText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.white,
  },
  topCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  rankNumber: {
    width: 32,
    alignItems: 'center',
  },
  rankNumberText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  topAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGrey,
  },
  topAvatarFirst: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  topInfo: {
    flex: 1,
  },
  topName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  topSkills: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.mediumGrey,
    marginBottom: 1,
  },
  topLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.grey,
    marginBottom: Spacing.xs,
  },
  topStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  topStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  topStatText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  leaderboardSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ultraLight,
    gap: Spacing.sm,
  },
  leaderRank: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.mediumGrey,
    width: 28,
  },
  leaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightGrey,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  leaderSkills: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  leaderStats: {
    alignItems: 'flex-end',
  },
  leaderStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  leaderStatText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.darkGrey,
  },
  leaderStudents: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.grey,
  },
  appreciationsSection: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  appreciationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  appreciationQuote: {
    marginRight: Spacing.sm,
  },
  quoteSymbol: {
    fontFamily: 'Playfair-Bold',
    fontSize: 48,
    color: Colors.lightGrey,
    lineHeight: 44,
    marginTop: -8,
  },
  appreciationContent: {
    flex: 1,
  },
  appreciationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.mediumGrey,
    lineHeight: 21,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  appreciationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appreciationFrom: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.darkGrey,
  },
  appreciationTo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  statsBanner: {
    backgroundColor: Colors.charcoal,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statsBannerTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 20,
    color: Colors.white,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statBlock: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  statBlockNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.white,
  },
  statBlockLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.grey,
  },
});
