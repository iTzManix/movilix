import { create } from 'zustand';
import { Report } from '../types';
import { MOCK_REPORTS } from '../data/mockReports';

interface ReportStore {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'confirmedBy' | 'status'>) => void;
  confirmReport: (id: string) => void;
  getReportById: (id: string) => Report | undefined;
}

export const useReportStore = create<ReportStore>((set, get) => ({
  reports: MOCK_REPORTS,

  addReport: (newReport) => {
    const report: Report = {
      ...newReport,
      id: `r_${Date.now()}`,
      createdAt: new Date().toISOString(),
      confirmedBy: 0,
      status: 'pending',
    };
    set((state) => ({ reports: [report, ...state.reports] }));
  },

  confirmReport: (id) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id
          ? { ...r, confirmedBy: r.confirmedBy + 1, status: 'confirmed' as const }
          : r
      ),
    }));
  },

  getReportById: (id) => get().reports.find((r) => r.id === id),
}));
