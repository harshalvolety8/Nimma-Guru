import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DemoSession } from '@/types/models';

interface SessionCardProps {
  session: DemoSession;
  onPress?: () => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1565C0',
  Science: '#2E7D32',
  Kannada: '#B71C1C',
  English: '#4A148C',
  'Computer Science': '#E65100',
  Music: '#880E4F',
  History: '#4E342E',
  default: '#37474F',
};

function getSubjectColor(subject: string): string {
  for (const key of Object.keys(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return SUBJECT_COLORS[key];
    }
  }
  return SUBJECT_COLORS.default;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function SessionCard({ session, onPress }: SessionCardProps) {
  const accentColor = getSubjectColor(session.subject);
  const spotsLeft = session.max_capacity - session.attendee_count;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.colorBar, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.dateBadge, { backgroundColor: accentColor + '18' }]}>
            <Calendar size={12} color={accentColor} strokeWidth={2} />
            <Text style={[styles.dateBadgeText, { color: accentColor }]}>
              {formatDate(session.session_date)}
            </Text>
          </View>
          <View style={styles.spotsBadge}>
            <Users size={11} color={spotsLeft < 5 ? Colors.error : Colors.success} strokeWidth={2} />
            <Text style={[styles.spotsText, { color: spotsLeft < 5 ? Colors.error : Colors.success }]}>
              {spotsLeft} spots left
            </Text>
          </View>
        </View>

        <Text style={styles.subject} numberOfLines={2}>{session.subject}</Text>
        <Text style={styles.guruName}>by {session.guru_name}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Clock size={13} color={Colors.mediumGrey} strokeWidth={2} />
            <Text style={styles.detailText}>{formatTime(session.start_time)} – {formatTime(session.end_time)}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={13} color={Colors.mediumGrey} strokeWidth={2} />
          <Text style={styles.detailText} numberOfLines={1}>{session.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  colorBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dateBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  spotsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
  },
  subject: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  guruName: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.mediumGrey,
    marginBottom: Spacing.sm,
  },
  detailsRow: {
    marginBottom: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.mediumGrey,
  },
});
