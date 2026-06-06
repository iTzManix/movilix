import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import MapView, { UrlTile, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { Config } from '../constants/config';
import { useReportStore } from '../store/useReportStore';
import { useUIStore } from '../store/useUIStore';
import ReportMarker from '../components/map/ReportMarker';
import MapFilterBar from '../components/map/MapFilterBar';
import ReportBottomSheet from '../components/map/ReportBottomSheet';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReportStore();
  const { selectedFilter, setFilter } = useUIStore();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const filteredReports = useMemo(() => {
    if (selectedFilter === 'Todos') return reports;
    const filterMap: Record<string, string> = {
      Trameaje: 'trameaje',
      Accidente: 'accidente',
      Bloqueo: 'bloqueo',
      Congestión: 'congestion',
    };
    return reports.filter((r) => r.type === filterMap[selectedFilter]);
  }, [reports, selectedFilter]);

  const handleConfirm = () => {
    if (selectedReport) {
      useReportStore.getState().confirmReport(selectedReport.id);
      setSelectedReport(null);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={Config.initialRegion}
        mapType="none"
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          shouldReplaceMapContent
          tileSize={256}
        />

        {filteredReports.map((report) => (
          <ReportMarker
            key={report.id}
            report={report}
            onPress={() => setSelectedReport(report)}
          />
        ))}
      </MapView>

      {/* Header */}
      <LinearGradient
        colors={['rgba(11,14,26,0.9)', 'rgba(11,14,26,0)']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>MoviliX</Text>
            <Text style={styles.subtitle}>Reportes en tiempo real</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filteredReports.length}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <MapFilterBar selected={selectedFilter} onSelect={setFilter} />
      </View>

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('ReportModal');
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>

      {/* Bottom Sheet */}
      {selectedReport && (
        <View style={styles.bottomSheet}>
          <ReportBottomSheet
            report={selectedReport}
            onConfirm={handleConfirm}
            onClose={() => setSelectedReport(null)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: 50,
  },
  greeting: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
  },
  filterBar: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadow.card,
    zIndex: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});
