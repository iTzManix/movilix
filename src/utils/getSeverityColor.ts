import { SeverityLevel } from '../types';
import { Colors } from '../constants/colors';

export function getSeverityColor(severity: SeverityLevel): string {
  const map: Record<SeverityLevel, string> = {
    low: Colors.low,
    medium: Colors.medium,
    high: Colors.high,
    critical: Colors.critical,
  };
  return map[severity];
}
