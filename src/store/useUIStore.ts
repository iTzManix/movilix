import { create } from 'zustand';

interface UIStore {
  isLoading: boolean;
  selectedFilter: string;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  selectedFilter: 'Todos',
  setLoading: (loading) => set({ isLoading: loading }),
  setFilter: (filter) => set({ selectedFilter: filter }),
}));
