import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Report } from '../../types';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { timeAgo } from '../../utils/formatDate';
import Badge from '../common/Badge';

interface ReportCardProps {
  report: Report;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendiente', bg: Colors.surfaceAlt, text: Colors.textSecondary },
  confirmed: { label: 'Confirmado', bg: '#1A3A2A', text: Colors.low },
  resolved: { label: 'Resuelto', bg: '#2A2A1A', text: Colors.medium },
};

export default function ReportCard({ report }: ReportCardProps) {
  const status = STATUS_CONFIG[report.status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>{report.type}</Text>
        <Badge label={status.label} bg={status.bg} textColor={status.text} />
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {report.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.route}>{report.route}</Text>
        <Text style={styles.time}>{timeAgo(report.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  type: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: Theme.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  route: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
  },
  time: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
  },
});
