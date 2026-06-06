import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { useUserStore } from '../store/useUserStore';
import Avatar from '../components/common/Avatar';
import Card from '../components/common/Card';

const LEVEL_CONFIG: Record<string, { color: string; icon: string }> = {
  principiante: { color: Colors.textMuted, icon: 'seed' },
  colaborador: { color: Colors.primary, icon: 'star' },
  experto: { color: Colors.accent, icon: 'flame' },
  maestro: { color: '#FFD700', icon: 'trophy' },
};

const ACHIEVEMENTS = [
  { icon: '🚀', label: '1er reporte', earned: true },
  { icon: '🔟', label: '10 reportes', earned: true },
  { icon: '⭐', label: '5 confirmados', earned: true },
  { icon: '🏆', label: 'Experto', earned: false },
];

const STATS = [
  { label: 'Puntos', value: '340', icon: 'star' },
  { label: 'Reportes', value: '28', icon: 'megaphone' },
  { label: 'Confirmados', value: '21', icon: 'checkmark-circle' },
  { label: 'Nivel', value: 'Colaborador', icon: 'trending-up' },
];

export default function ProfileScreen() {
  const { user } = useUserStore();
  const levelConfig = LEVEL_CONFIG[user.level];
  const xpProgress = useSharedValue(0);

  const pointsForNextLevel = 500;
  const progress = Math.min((user.points / pointsForNextLevel) * 100, 100);

  useEffect(() => {
    xpProgress.value = withSpring(progress, { damping: 14, stiffness: 60 });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${xpProgress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar initials={user.avatar} size={64} color={levelConfig.color} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <View style={styles.levelBadge}>
                <Ionicons name={levelConfig.icon as any} size={14} color={levelConfig.color} />
                <Text style={[styles.levelText, { color: levelConfig.color }]}>
                  {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* XP Bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpLabel}>Progreso</Text>
              <Text style={styles.xpValue}>
                {user.points} / {pointsForNextLevel} pts
              </Text>
            </View>
            <View style={styles.xpTrack}>
              <Animated.View style={[styles.xpFill, barStyle]} />
            </View>
          </View>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logros</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement) => (
              <View
                key={achievement.label}
                style={[styles.achievementItem, !achievement.earned && styles.achievementLocked]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text
                  style={[styles.achievementLabel, !achievement.earned && styles.achievementLabelLocked]}
                >
                  {achievement.label}
                </Text>
                {achievement.earned && (
                  <Ionicons name="checkmark-circle" size={16} color={Colors.low} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis últimos reportes</Text>
          <Card style={styles.reportItem}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportType}>Bus</Text>
              <Text style={styles.reportTime}>hace 25 min</Text>
            </View>
            <Text style={styles.reportDesc}>Minibus 273 se quedó en La Ceja</Text>
          </Card>
          <Card style={styles.reportItem}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportType}>Accidente</Text>
              <Text style={styles.reportTime}>hace 2h</Text>
            </View>
            <Text style={styles.reportDesc}>Colisión en Av. Busch</Text>
          </Card>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          {['Notificaciones', 'Privacidad', 'Acerca de'].map((item) => (
            <Card key={item} style={styles.settingsItem}>
              <View style={styles.settingsRow}>
                <Text style={styles.settingsText}>{item}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: 50,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 100,
    gap: 16,
  },
  profileCard: {
    gap: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  levelText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
  },
  xpSection: {
    gap: 8,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
  },
  xpValue: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
  },
  xpTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceAlt,
    overflow: 'hidden',
  },
  xpFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Theme.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementLabel: {
    flex: 1,
    fontSize: Theme.fontSize.sm,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  achievementLabelLocked: {
    color: Colors.textMuted,
  },
  reportItem: {
    gap: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportType: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  reportTime: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
  },
  reportDesc: {
    fontSize: Theme.fontSize.base,
    color: Colors.textSecondary,
  },
  settingsItem: {
    padding: Theme.spacing.md,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: Theme.fontSize.base,
    color: Colors.textPrimary,
  },
});
