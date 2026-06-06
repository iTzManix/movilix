import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Report } from '../../types';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { timeAgo } from '../../utils/formatDate';
import Badge from '../common/Badge';

interface ReportBottomSheetProps {
  report: Report;
  onConfirm: () => void;
  onClose: () => void;
}

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', bg: Colors.surfaceAlt, text: Colors.textSecondary },
  confirmed: { label: 'Confirmado', bg: '#1A3A2A', text: Colors.low },
  resolved: { label: 'Resuelto', bg: '#2A2A1A', text: Colors.medium },
};

export default function ReportBottomSheet({ report, onConfirm, onClose }: ReportBottomSheetProps) {
  const status = STATUS_CONFIG[report.status];

  return (
    <View style={styles.container}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.type}>{report.type.charAt(0).toUpperCase() + report.type.slice(1)}</Text>
          <Badge label={status.label} bg={status.bg} textColor={status.text} />
        </View>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={24} color={Colors.textMuted} />
        </Pressable>
      </View>

      <Text style={styles.description}>{report.description}</Text>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Ionicons name="bus" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{report.route}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{timeAgo(report.createdAt)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{report.confirmedBy} confirmaciones</Text>
        </View>
      </View>

      {report.status === 'pending' && (
        <Pressable style={styles.confirmButton} onPress={onConfirm}>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.confirmText}>Confirmar reporte</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
    alignSelf: 'center',
    marginBottom: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  type: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: Theme.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
  },
  info: {
    gap: 8,
    marginBottom: Theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: Theme.fontSize.base,
    fontWeight: '600',
  },
});
