import type { ReportType, SeverityLevel } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  ReportModal: { coordinate?: { lat: number; lng: number } } | undefined;
  ReportDetail: { reportId: string };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Dashboard: undefined;
  Assistant: undefined;
  Profile: undefined;
};

export type { ReportType, SeverityLevel };
