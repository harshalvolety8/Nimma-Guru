import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import {
  User,
  GraduationCap,
  MapPin,
  Phone,
  BookOpen,
  Clock,
  Star,
  ChevronRight,
  Info,
  Heart,
  Globe,
} from 'lucide-react-native';
import { Colors, Spacing, Radius, SKILL_CATEGORIES, LOCATIONS } from '@/constants/theme';

type UserRole = 'guru' | 'student' | null;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProfileScreen() {
  const [role, setRole] = useState<UserRole>(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [village, setVillage] = useState('');
  const [street, setStreet] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('Community Center');
  const [days, setDays] = useState<string[]>([]);
  const [profileCreated, setProfileCreated] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!name.trim() || !age.trim() || !village.trim()) {
        setError('Please fill in all required fields');
        return;
      }
    }
    if (step === 2 && role === 'guru') {
      if (skills.length === 0) {
        setError('Please select at least one skill');
        return;
      }
    }
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      setProfileCreated(true);
    }
  };

  // Role selection screen
  if (!role) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.centeredContent}>
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeTitle}>Join Nimma-Guru</Text>
          <Text style={styles.welcomeSubtitle}>ನಿಮ್ಮ ಗುರು</Text>
          <Text style={styles.welcomeDesc}>
            A non-commercial community platform connecting retired professionals with students for free mentorship.
          </Text>
        </View>

        <Text style={styles.choiceLabel}>I am a...</Text>

        <TouchableOpacity style={styles.roleCard} onPress={() => setRole('guru')} activeOpacity={0.85}>
          <View style={styles.roleIcon}>
            <GraduationCap size={32} color={Colors.white} strokeWidth={2} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Guru (Mentor)</Text>
            <Text style={styles.roleDesc}>
              I am a retired professional who wants to share knowledge and teach students for free in my community.
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.mediumGrey} strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.roleCard} onPress={() => setRole('student')} activeOpacity={0.85}>
          <View style={[styles.roleIcon, styles.roleIconStudent]}>
            <BookOpen size={32} color={Colors.white} strokeWidth={2} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Student (Learner)</Text>
            <Text style={styles.roleDesc}>
              I am a student looking for free after-school tutoring or skill development from experienced mentors.
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.mediumGrey} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.nonCommercialBanner}>
          <Heart size={16} color={Colors.error} fill={Colors.error} strokeWidth={0} />
          <Text style={styles.nonCommercialText}>100% Free • No Ads • Community Driven • Non-Commercial</Text>
        </View>

        <View style={styles.missionBox}>
          <Text style={styles.missionBoxTitle}>Our Mission: Gyaan-Daan</Text>
          <Text style={styles.missionBoxText}>
            Gyaan-Daan (ಜ್ಞಾನ-ದಾನ) — the gift of knowledge. We believe every retired professional has wisdom worth sharing, and every student deserves access to quality mentorship regardless of their economic background.
          </Text>
        </View>

        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Globe size={20} color={Colors.darkGrey} strokeWidth={2} />
            <Text style={styles.featureText}>Bilingual{'\n'}Kannada & English</Text>
          </View>
          <View style={styles.featureItem}>
            <MapPin size={20} color={Colors.darkGrey} strokeWidth={2} />
            <Text style={styles.featureText}>Village-level{'\n'}Matching</Text>
          </View>
          <View style={styles.featureItem}>
            <Star size={20} color={Colors.gold} strokeWidth={2} />
            <Text style={styles.featureText}>Wall of{'\n'}Fame</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Profile created success
  if (profileCreated) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>{role === 'guru' ? '🎓' : '📚'}</Text>
        <Text style={styles.successTitle}>
          {role === 'guru' ? 'Welcome, Guru!' : 'Welcome, Student!'}
        </Text>
        <Text style={styles.successTitleKn}>
          {role === 'guru' ? 'ಸ್ವಾಗತ, ಗುರುಗಳೇ!' : 'ಸ್ವಾಗತ, ವಿದ್ಯಾರ್ಥಿ!'}
        </Text>
        <Text style={styles.successText}>
          {role === 'guru'
            ? `Your profile has been created, ${name}. Students in ${village} can now discover you and reach out for mentorship!`
            : `Your profile has been created, ${name}. Start exploring Gurus in ${village} and find your perfect mentor!`}
        </Text>

        <View style={styles.profilePreview}>
          <View style={styles.profilePreviewAvatar}>
            <Text style={styles.profilePreviewInitial}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.profilePreviewName}>{name}</Text>
          <Text style={styles.profilePreviewRole}>
            {role === 'guru' ? 'Community Mentor' : 'Student Learner'}
          </Text>
          {role === 'guru' && skills.length > 0 && (
            <View style={styles.profilePreviewSkills}>
              {skills.slice(0, 3).map((s) => (
                <View key={s} style={styles.profileSkillChip}>
                  <Text style={styles.profileSkillText}>{s}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => {
            setProfileCreated(false);
            setStep(1);
            setRole(null);
          }}
        >
          <Text style={styles.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Multi-step form
  const totalSteps = role === 'guru' ? 3 : 2;

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={() => (step === 1 ? setRole(null) : setStep((s) => s - 1))}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Step {step} of {totalSteps}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
      </View>

      <ScrollView style={styles.formScroll} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>
              {role === 'guru' ? 'Tell us about yourself' : 'Your details'}
            </Text>
            <Text style={styles.stepSubtitle}>Basic information to get you started</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputRow}>
                <User size={16} color={Colors.grey} strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Ramaiah Venkatesh"
                  placeholderTextColor={Colors.grey}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Age *</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { paddingLeft: 0 }]}
                  placeholder="e.g. 65"
                  placeholderTextColor={Colors.grey}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Village / Area *</Text>
              <View style={styles.inputRow}>
                <MapPin size={16} color={Colors.grey} strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Jayanagar, Basavanagudi"
                  placeholderTextColor={Colors.grey}
                  value={village}
                  onChangeText={setVillage}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Street / Locality</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { paddingLeft: 0 }]}
                  placeholder="e.g. South End Circle"
                  placeholderTextColor={Colors.grey}
                  value={street}
                  onChangeText={setStreet}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputRow}>
                <Phone size={16} color={Colors.grey} strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 9876543210"
                  placeholderTextColor={Colors.grey}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>
        )}

        {/* Step 2 (Guru): Skills & Experience */}
        {step === 2 && role === 'guru' && (
          <View>
            <Text style={styles.stepTitle}>Your Expertise</Text>
            <Text style={styles.stepSubtitle}>What subjects can you teach? (Select all that apply)</Text>

            <View style={styles.skillsGrid}>
              {SKILL_CATEGORIES.slice(1).map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[styles.skillOption, skills.includes(skill) && styles.skillOptionActive]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text style={[styles.skillOptionText, skills.includes(skill) && styles.skillOptionTextActive]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Background & Experience</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Share your professional background, years of experience, and what motivates you to teach..."
                placeholderTextColor={Colors.grey}
                value={experience}
                onChangeText={setExperience}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </View>
        )}

        {/* Step 2 (Student): Learning goals */}
        {step === 2 && role === 'student' && (
          <View>
            <Text style={styles.stepTitle}>What are you looking for?</Text>
            <Text style={styles.stepSubtitle}>Help us find the best Gurus for you</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Subjects of Interest</Text>
              <View style={styles.skillsGrid}>
                {SKILL_CATEGORIES.slice(1).map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.skillOption, skills.includes(skill) && styles.skillOptionActive]}
                    onPress={() => toggleSkill(skill)}
                  >
                    <Text style={[styles.skillOptionText, skills.includes(skill) && styles.skillOptionTextActive]}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Step 3 (Guru): Availability & Location */}
        {step === 3 && role === 'guru' && (
          <View>
            <Text style={styles.stepTitle}>Availability & Location</Text>
            <Text style={styles.stepSubtitle}>When and where can you teach?</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Available Days</Text>
              <View style={styles.daysGrid}>
                {DAYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayOption, days.includes(day) && styles.dayOptionActive]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[styles.dayOptionText, days.includes(day) && styles.dayOptionTextActive]}>
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Preferred Teaching Location</Text>
              <View style={styles.locationOptions}>
                {LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.locationOption, location === loc && styles.locationOptionActive]}
                    onPress={() => setLocation(loc)}
                  >
                    <MapPin size={14} color={location === loc ? Colors.white : Colors.mediumGrey} strokeWidth={2} />
                    <Text style={[styles.locationOptionText, location === loc && styles.locationOptionTextActive]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {error ? (
          <View style={styles.errorBox}>
            <Info size={14} color={Colors.error} strokeWidth={2} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>
            {step === totalSteps ? 'Create Profile' : 'Continue →'}
          </Text>
        </TouchableOpacity>

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
  centeredContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  welcomeHeader: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: Colors.darkGrey,
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.mediumGrey,
    marginBottom: Spacing.sm,
  },
  welcomeDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  choiceLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.darkGrey,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
    gap: Spacing.md,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconStudent: {
    backgroundColor: Colors.medium,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  roleDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.mediumGrey,
    lineHeight: 19,
  },
  nonCommercialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.md,
    padding: 12,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  nonCommercialText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.error,
    flex: 1,
  },
  missionBox: {
    backgroundColor: Colors.darkGrey,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  missionBoxTitle: {
    fontFamily: 'Playfair-Bold',
    fontSize: 18,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  missionBoxText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.grey,
    lineHeight: 21,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureItem: {
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.mediumGrey,
    textAlign: 'center',
    lineHeight: 17,
  },
  formHeader: {
    backgroundColor: Colors.darkGrey,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.lightGrey,
  },
  stepLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.grey,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.charcoal,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    padding: Spacing.md,
  },
  stepTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: Colors.darkGrey,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  stepSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: Spacing.lg,
    lineHeight: 21,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.darkGrey,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.darkGrey,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.darkGrey,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    minHeight: 120,
    lineHeight: 22,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  skillOption: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.white,
  },
  skillOptionActive: {
    backgroundColor: Colors.darkGrey,
    borderColor: Colors.darkGrey,
  },
  skillOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.darkGrey,
  },
  skillOptionTextActive: {
    color: Colors.white,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dayOption: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    minWidth: 56,
    alignItems: 'center',
  },
  dayOptionActive: {
    backgroundColor: Colors.darkGrey,
    borderColor: Colors.darkGrey,
  },
  dayOptionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.darkGrey,
  },
  dayOptionTextActive: {
    color: Colors.white,
  },
  locationOptions: {
    gap: Spacing.sm,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  locationOptionActive: {
    backgroundColor: Colors.darkGrey,
    borderColor: Colors.darkGrey,
  },
  locationOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  locationOptionTextActive: {
    color: Colors.white,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.error,
    flex: 1,
  },
  nextButton: {
    backgroundColor: Colors.darkGrey,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  nextButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.ultraLight,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
  },
  successEmoji: {
    fontSize: 72,
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.darkGrey,
    marginBottom: 4,
    textAlign: 'center',
  },
  successTitleKn: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.mediumGrey,
    marginBottom: Spacing.md,
  },
  successText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.mediumGrey,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  profilePreview: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.ultraLight,
  },
  profilePreviewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  profilePreviewInitial: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.white,
  },
  profilePreviewName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.darkGrey,
    marginBottom: 4,
  },
  profilePreviewRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.mediumGrey,
    marginBottom: Spacing.md,
  },
  profilePreviewSkills: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  profileSkillChip: {
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  profileSkillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  editProfileBtn: {
    borderWidth: 1.5,
    borderColor: Colors.darkGrey,
    borderRadius: Radius.full,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
  },
  editProfileBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.darkGrey,
  },
});
