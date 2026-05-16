import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { DemoSession } from '@/types/models';
import { Colors, Spacing, Radius } from '@/constants/theme';
import SessionCard from '@/components/SessionCard';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarScreen() {
  const today = new Date();
  const [sessions, setSessions] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('demo_sessions')
      .select('*')
      .order('session_date', { ascending: true });
    if (data) setSessions(data as DemoSession[]);
    setLoading(false);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const sessionDates = new Set(sessions.map((s) => s.session_date));

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const formatDateKey = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  const filteredSessions = selectedDate
    ? sessions.filter((s) => s.session_date === selectedDate)
    : sessions;

  const upcomingSessions = sessions.filter((s) => {
    const d = new Date(s.session_date);
    d.setHours(23, 59, 59);
    return d >= today;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Class Calendar</Text>
        <Text style={styles.headerSubtitle}>Upcoming free community sessions</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <ChevronLeft size={20} color={Colors.darkGrey} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <ChevronRight size={20} color={Colors.darkGrey} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAY_NAMES.map((d) => (
              <View key={d} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Day cells */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <View key={`empty-${idx}`} style={styles.dayCell} />;
              }
              const dateKey = formatDateKey(day);
              const hasSession = sessionDates.has(dateKey);
              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();
              const isSelected = dateKey === selectedDate;

              return (
                <TouchableOpacity
                  key={dateKey}
                  style={[
                    styles.dayCell,
                    isToday && styles.dayCellToday,
                    isSelected && styles.dayCellSelected,
                  ]}
                  onPress={() => setSelectedDate(isSelected ? null : dateKey)}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      isToday && styles.dayCellTextToday,
                      isSelected && styles.dayCellTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasSession && (
                    <View style={[styles.sessionDot, isSelected && styles.sessionDotSelected]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedDate && (
            <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearDateBtn}>
              <Text style={styles.clearDateText}>Clear selection</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sessions list */}
        <View style={styles.sessionsSection}>
          <View style={styles.sessionsSectionHeader}>
            <Calendar size={16} color={Colors.darkGrey} strokeWidth={2} />
            <Text style={styles.sectionTitle}>
              {selectedDate
                ? `Sessions on ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}`
                : 'All Upcoming Sessions'}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.darkGrey} style={{ marginTop: 32 }} />
          ) : filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>No Sessions Found</Text>
              <Text style={styles.emptyText}>
                {selectedDate ? 'No classes on this date.' : 'No upcoming sessions scheduled.'}
              </Text>
            </View>
          ) : (
            filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onPress={() => router.push(`/guru/${session.guru_id}`)}
              />
            ))
          )}
        </View>

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
  header: {
    backgroundColor: Colors.darkGrey,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: Colors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.grey,
  },
  calendarCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.ultraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYear: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: Colors.darkGrey,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  dayHeaderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.grey,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    position: 'relative',
  },
  dayCellToday: {
    backgroundColor: Colors.ultraLight,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  dayCellSelected: {
    backgroundColor: Colors.darkGrey,
  },
  dayCellText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  dayCellTextToday: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.darkGrey,
  },
  dayCellTextSelected: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  sessionDot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.darkGrey,
  },
  sessionDotSelected: {
    backgroundColor: Colors.white,
  },
  clearDateBtn: {
    alignSelf: 'center',
    marginTop: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  clearDateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.mediumGrey,
    textDecorationLine: 'underline',
  },
  sessionsSection: {
    marginTop: Spacing.xs,
  },
  sessionsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.darkGrey,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
  },
});
