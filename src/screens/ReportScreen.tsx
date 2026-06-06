import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { useReportStore } from '../store/useReportStore';
import { useUserStore } from '../store/useUserStore';
import { MOCK_ROUTES } from '../data/mockRoutes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { ReportType, SeverityLevel } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ReportModal'>;

const { width } = Dimensions.get('window');

const REPORT_TYPES = [
  { key: 'trameaje', label: 'Trameaje', emoji: '🚌' },
  { key: 'accidente', label: 'Accidente', emoji: '💥' },
  { key: 'congestion', label: 'Congestión', emoji: '🚦' },
  { key: 'bloqueo', label: 'Bloqueo', emoji: '🚧' },
  { key: 'desvio', label: 'Desvío', emoji: '🔀' },
  { key: 'otro', label: 'Otro', emoji: '📍' },
];

const SEVERITY_OPTIONS = [
  { key: 'low', label: 'Leve', color: Colors.low },
  { key: 'medium', label: 'Medio', color: Colors.medium },
  { key: 'high', label: 'Alto', color: Colors.high },
  { key: 'critical', label: 'Crítico', color: Colors.critical },
];

export default function ReportScreen() {
  const navigation = useNavigation<Nav>();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | null>(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { addReport } = useReportStore();
  const { addPoints } = useUserStore();

  const handleSubmit = () => {
    if (!selectedType || !selectedSeverity || !selectedRoute) return;

    addReport({
      type: selectedType,
      description: description || `Reporte de ${selectedType}`,
      route: selectedRoute,
      coordinate: { lat: -16.4955, lng: -68.1336 },
      severity: selectedSeverity,
      userId: 'u1',
    });

    addPoints(10);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);

    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Animated.View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.low} />
        </Animated.View>
        <Text style={styles.successTitle}>¡Reporte enviado!</Text>
        <Text style={styles.successSubtitle}>+10 puntos ganados</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Nuevo Reporte</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[styles.stepDot, step >= s && styles.stepDotActive]}
          />
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>¿Qué está pasando?</Text>
            <Text style={styles.stepSubtitle}>Selecciona el tipo de incidencia</Text>
            <View style={styles.typeGrid}>
              {REPORT_TYPES.map((type) => (
                <TypeButton
                  key={type.key}
                  type={type}
                  isSelected={selectedType === type.key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedType(type.key as ReportType);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>¿Dónde y qué tan grave?</Text>
            <Text style={styles.stepSubtitle}>Selecciona la ruta y severidad</Text>

            <Text style={styles.sectionLabel}>Ruta</Text>
            <View style={styles.routeList}>
              {MOCK_ROUTES.map((route) => (
                <Pressable
                  key={route.id}
                  style={[styles.routeItem, selectedRoute === route.name && styles.routeItemActive]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedRoute(route.name);
                  }}
                >
                  <View style={[styles.routeColor, { backgroundColor: route.color }]} />
                  <View>
                    <Text style={styles.routeName}>{route.name}</Text>
                    <Text style={styles.routeLine}>{route.line}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Severidad</Text>
            <View style={styles.severityList}>
              {SEVERITY_OPTIONS.map((sev) => (
                <Pressable
                  key={sev.key}
                  style={[
                    styles.severityItem,
                    selectedSeverity === sev.key && { borderColor: sev.color, backgroundColor: sev.color + '20' },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedSeverity(sev.key as SeverityLevel);
                  }}
                >
                  <View style={[styles.severityDot, { backgroundColor: sev.color }]} />
                  <Text style={styles.severityLabel}>{sev.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Describe lo que pasó</Text>
            <Text style={styles.stepSubtitle}>Opcional pero muy útil</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: El minibus se detuvo en La Ceja sin razón..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              maxLength={200}
              value={description}
              onChangeText={setDescription}
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        {step > 1 && (
          <Pressable style={styles.backButton} onPress={() => setStep(step - 1)}>
            <Text style={styles.backButtonText}>Atrás</Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.nextButton,
            step === 3 && styles.submitButton,
            (!canProceed(step, selectedType, selectedRoute, selectedSeverity)) && styles.disabledButton,
          ]}
          disabled={!canProceed(step, selectedType, selectedRoute, selectedSeverity)}
          onPress={() => {
            if (step < 3) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setStep(step + 1);
            } else {
              handleSubmit();
            }
          }}
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'Enviar Reporte' : 'Siguiente'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function canProceed(
  step: number,
  type: ReportType | null,
  route: string,
  severity: SeverityLevel | null
): boolean {
  if (step === 1) return !!type;
  if (step === 2) return !!route && !!severity;
  return true;
}

function TypeButton({
  type,
  isSelected,
  onPress,
}: {
  type: (typeof REPORT_TYPES)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.typeButton, animStyle, isSelected && styles.typeButtonActive]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.typeButtonInner}
      >
        <Text style={styles.typeEmoji}>{type.emoji}</Text>
        <Text style={[styles.typeLabel, isSelected && styles.typeLabelActive]}>
          {type.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: 50,
    paddingBottom: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Theme.spacing.md,
  },
  stepDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceAlt,
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  stepTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    width: (width - Theme.spacing.md * 2 - 24) / 3,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  typeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  typeButtonInner: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  typeLabelActive: {
    color: Colors.primary,
  },
  sectionLabel: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeList: {
    gap: 8,
    marginBottom: Theme.spacing.md,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routeItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  routeColor: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  routeName: {
    fontSize: Theme.fontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  routeLine: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  severityList: {
    flexDirection: 'row',
    gap: 8,
  },
  severityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  severityLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Theme.spacing.md,
    color: Colors.textPrimary,
    fontSize: Theme.fontSize.base,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 40,
    paddingTop: Theme.spacing.md,
    gap: 12,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surfaceAlt,
  },
  backButtonText: {
    color: Colors.textSecondary,
    fontSize: Theme.fontSize.base,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: Colors.accent,
  },
  disabledButton: {
    opacity: 0.4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: Theme.fontSize.base,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: Theme.spacing.md,
  },
  successTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  successSubtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.low,
    marginTop: 8,
  },
});
