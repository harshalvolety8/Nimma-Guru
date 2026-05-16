import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MapPin, Star, Users, Clock } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DemoGuru } from '@/types/models';

interface GuruCardProps {
  guru: DemoGuru;
  onPress: () => void;
  compact?: boolean;
}

export default function GuruCard({ guru, onPress, compact = false }: GuruCardProps) {
  const topSkills = guru.skills.slice(0, 3);

  return (
    <TouchableOpacity style={[styles.card, compact && styles.cardCompact]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Image source={{ uri: guru.photo_url }} style={[styles.avatar, compact && styles.avatarCompact]} />
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>{guru.full_name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color={Colors.mediumGrey} strokeWidth={2} />
            <Text style={styles.location} numberOfLines={1}>{guru.village}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Star size={13} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
            <Text style={styles.rating}>{guru.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({guru.appreciation_count})</Text>
          </View>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsNumber}>{guru.total_students_taught}</Text>
          <Text style={styles.statsLabel}>Students</Text>
        </View>
      </View>

      {!compact && (
        <Text style={styles.experience} numberOfLines={2}>{guru.experience}</Text>
      )}

      <View style={styles.skillsRow}>
        {topSkills.map((skill) => (
          <View key={skill} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {guru.skills.length > 3 && (
          <View style={styles.skillChipMore}>
            <Text style={styles.skillTextMore}>+{guru.skills.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Clock size={13} color={Colors.mediumGrey} strokeWidth={2} />
          <Text style={styles.footerText}>{guru.preferred_location}</Text>
        </View>
        <View style={styles.footerItem}>
          <Users size={13} color={Colors.mediumGrey} strokeWidth={2} />
          <Text style={styles.footerText}>{guru.hours_contributed}h contributed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  cardCompact: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGrey,
  },
  avatarCompact: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 3,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.darkGrey,
  },
  ratingCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.grey,
  },
  statsBox: {
    alignItems: 'center',
    backgroundColor: Colors.ultraLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 52,
  },
  statsNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.darkGrey,
  },
  statsLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.grey,
  },
  experience: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.mediumGrey,
    lineHeight: 19,
    marginBottom: Spacing.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  skillChip: {
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  skillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: Colors.white,
  },
  skillChipMore: {
    backgroundColor: Colors.lightGrey,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  skillTextMore: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: Colors.mediumGrey,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.ultraLight,
    paddingTop: Spacing.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.mediumGrey,
  },
});
