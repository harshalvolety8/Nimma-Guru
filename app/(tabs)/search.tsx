import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Search, X, SlidersHorizontal, MapPin } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { DemoGuru } from '@/types/models';
import { Colors, Spacing, Radius, SKILL_CATEGORIES } from '@/constants/theme';
import GuruCard from '@/components/GuruCard';

const DAYS_FILTER = ['Any Day', 'Saturday', 'Sunday'];
const LOCATIONS_FILTER = ['Any Location', 'Samudaya Bhavana', 'Community Center', 'Home'];

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string; skill?: string }>();
  const [gurus, setGurus] = useState<DemoGuru[]>([]);
  const [filtered, setFiltered] = useState<DemoGuru[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.q ?? '');
  const [selectedSkill, setSelectedSkill] = useState(params.skill ?? 'All');
  const [selectedDay, setSelectedDay] = useState('Any Day');
  const [selectedLocation, setSelectedLocation] = useState('Any Location');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchGurus();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [gurus, query, selectedSkill, selectedDay, selectedLocation]);

  const fetchGurus = async () => {
    setLoading(true);
    const { data } = await supabase.from('demo_gurus').select('*').eq('is_active', true);
    if (data) setGurus(data as DemoGuru[]);
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...gurus];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (g) =>
          g.full_name.toLowerCase().includes(q) ||
          g.skills.some((s) => s.toLowerCase().includes(q)) ||
          g.village.toLowerCase().includes(q) ||
          g.experience.toLowerCase().includes(q)
      );
    }

    if (selectedSkill !== 'All') {
      result = result.filter((g) =>
        g.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()))
      );
    }

    if (selectedDay !== 'Any Day') {
      result = result.filter((g) => g.available_hours[selectedDay]?.length > 0);
    }

    if (selectedLocation !== 'Any Location') {
      result = result.filter((g) =>
        g.preferred_location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFiltered(result);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedSkill('All');
    setSelectedDay('Any Day');
    setSelectedLocation('Any Location');
  };

  const hasActiveFilters =
    query.trim() || selectedSkill !== 'All' || selectedDay !== 'Any Day' || selectedLocation !== 'Any Location';

  const DISPLAYED_SKILLS = SKILL_CATEGORIES.slice(0, 12);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Guru</Text>
        <Text style={styles.headerSubtitle}>Search by subject, name, or location</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.mediumGrey} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Mathematics, Ramaiah, Jayanagar..."
              placeholderTextColor={Colors.grey}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={16} color={Colors.grey} strokeWidth={2} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} color={showFilters ? Colors.white : Colors.darkGrey} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Skills chips - always visible */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.skillsScroll}
        contentContainerStyle={styles.skillsContent}
      >
        {DISPLAYED_SKILLS.map((skill) => (
          <TouchableOpacity
            key={skill}
            style={[styles.skillChip, selectedSkill === skill && styles.skillChipActive]}
            onPress={() => setSelectedSkill(skill)}
          >
            <Text style={[styles.skillChipText, selectedSkill === skill && styles.skillChipTextActive]}>
              {skill}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Expanded filters */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterGroupLabel}>Availability</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {DAYS_FILTER.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.filterChip, selectedDay === day && styles.filterChipActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.filterChipText, selectedDay === day && styles.filterChipTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.filterGroupLabel}>Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {LOCATIONS_FILTER.map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[styles.filterChip, selectedLocation === loc && styles.filterChipActive]}
                onPress={() => setSelectedLocation(loc)}
              >
                <MapPin size={11} color={selectedLocation === loc ? Colors.white : Colors.mediumGrey} strokeWidth={2} />
                <Text style={[styles.filterChipText, selectedLocation === loc && styles.filterChipTextActive]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {loading ? 'Loading...' : `${filtered.length} Guru${filtered.length !== 1 ? 's' : ''} found`}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator color={Colors.darkGrey} style={{ marginTop: 48 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No Gurus Found</Text>
          <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GuruCard
              guru={item}
              onPress={() => router.push(`/guru/${item.id}`)}
            />
          )}
          contentContainerStyle={{ paddingVertical: Spacing.sm, paddingBottom: Spacing.xxl }}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingBottom: Spacing.md,
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
    marginBottom: Spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  filterToggle: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleActive: {
    backgroundColor: Colors.black,
  },
  skillsScroll: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ultraLight,
    maxHeight: 52,
  },
  skillsContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: Spacing.sm,
  },
  skillChip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.white,
  },
  skillChipActive: {
    backgroundColor: Colors.darkGrey,
    borderColor: Colors.darkGrey,
  },
  skillChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.darkGrey,
  },
  skillChipTextActive: {
    color: Colors.white,
  },
  filtersPanel: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ultraLight,
  },
  filterGroupLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.mediumGrey,
    paddingHorizontal: Spacing.md,
    marginBottom: 6,
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.darkGrey,
    borderColor: Colors.darkGrey,
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.darkGrey,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  resultsCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.mediumGrey,
  },
  clearText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.error,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.darkGrey,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  clearButton: {
    backgroundColor: Colors.darkGrey,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
  },
  clearButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
});
