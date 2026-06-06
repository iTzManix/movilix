export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'pending' | 'confirmed' | 'resolved';

export type ReportType =
  | 'trameaje'
  | 'desvio'
  | 'accidente'
  | 'congestion'
  | 'bloqueo'
  | 'otro';

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  type: ReportType;
  description: string;
  route: string;
  coordinate: Coordinate;
  severity: SeverityLevel;
  status: ReportStatus;
  createdAt: string;
  confirmedBy: number;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: 'principiante' | 'colaborador' | 'experto' | 'maestro';
  points: number;
  totalReports: number;
  confirmedReports: number;
  joinedAt: string;
}

export interface Route {
  id: string;
  name: string;
  line: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
