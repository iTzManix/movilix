import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MotiView } from 'moti';
import { Report } from '../../types';
import { Colors } from '../../constants/colors';

const SEVERITY_ICONS: Record<string, { color: string }> = {
  low: { color: Colors.low },
  medium: { color: Colors.medium },
  high: { color: Colors.high },
  critical: { color: Colors.critical },
};

interface ReportMarkerProps {
  report: Report;
  onPress: () => void;
}

export default function ReportMarker({ report, onPress }: ReportMarkerProps) {
  const { color } = SEVERITY_ICONS[report.severity];

  return (
    <Marker
      coordinate={{
        latitude: report.coordinate.lat,
        longitude: report.coordinate.lng,
      }}
      onPress={onPress}
    >
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10, delay: Math.random() * 400 }}
        style={styles.container}
      >
        {report.severity === 'critical' && (
          <MotiView
            from={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ type: 'timing', duration: 1500, loop: true }}
            style={[styles.pulse, { backgroundColor: color }]}
          />
        )}
        <View style={[styles.marker, { backgroundColor: color }]}>
          <Text style={styles.markerText}>!</Text>
        </View>
      </MotiView>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
