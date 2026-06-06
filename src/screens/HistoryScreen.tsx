import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { useReportStore } from '../store/useReportStore';
import { timeAgo } from '../utils/formatDate';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import type { Report } from '../types';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendiente', bg: Colors.surfaceAlt, text: Colors.textSecondary },
  confirmed: { label: 'Confirmado', bg: '#1A3A2A', text: Colors.low },
  resolved: { label: 'Resuelto', bg: '#2A2A1A', text: Colors.medium },
};

const SEVERITY_COLORS: Record<string, string> = {
  low: Colors.low,
  medium: Colors.medium,
  high: Colors.high,
  critical: Colors.critical,
};

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  trameaje: 'bus',
  accidente: 'warning',
  congestion: 'speedometer',
  bloqueo: 'lock-closed',
  desvio: 'git-branch',
  otro: 'location',
};

function ReportCard({ report, index }: { report: Report; index: number }) {
  const status = STATUS_CONFIG[report.status];

  return (
    <MotiView
      from={{ opacity: 0, translateX: 40 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 80, damping: 14 }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardType}>
          <Ionicons
            name={TYPE_ICONS[report.type] || 'location'}
            size={20}
            color={SEVERITY_COLORS[report.severity]}
          />
          <Text style={styles.cardTypeText}>
            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
          </Text>
        </View>
        <Badge label={status.label} bg={status.bg} textColor={status.text} />
      </View>

      <Text style={styles.cardDescription} numberOfLines={2}>
        {report.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.cardInfo}>
          <Ionicons name="bus" size={14} color={Colors.textMuted} />
          <Text style={styles.cardInfoText}>{report.route}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="time" size={14} color={Colors.textMuted} />
          <Text style={styles.cardInfoText}>{timeAgo(report.createdAt)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="people" size={14} color={Colors.textMuted} />
          <Text style={styles.cardInfoText}>{report.confirmedBy}</Text>
        </View>
      </View>

      <View style={[styles.severityBar, { backgroundColor: SEVERITY_COLORS[report.severity] }]} />
    </MotiView>
  );
}

export default function HistoryScreen() {
  const { reports } = useReportStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>{reports.length} reportes</Text>
      </View>

      {reports.length === 0 ? (
        <EmptyState
          icon="list"
          title="Sin reportes"
          subtitle="Los reportes que hagas aparecerán aquí"
        />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ReportCard report={item} index={index} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      )}
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
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTypeText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardDescription: {
    fontSize: Theme.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardInfoText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
  },
  severityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
});
