import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { Config } from '../../constants/config';
import ReportMarker from './ReportMarker';
import type { Report } from '../../types';

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
];

interface MapViewComponentProps {
  reports: Report[];
  onReportPress: (report: Report) => void;
}

export default function MapViewComponent({ reports, onReportPress }: MapViewComponentProps) {
  return (
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

      {reports.map((report) => (
        <ReportMarker
          key={report.id}
          report={report}
          onPress={() => onReportPress(report)}
        />
      ))}
    </MapView>
  );
}
