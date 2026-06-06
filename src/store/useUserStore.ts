import { create } from 'zustand';
import { User } from '../types';
import { MOCK_USER } from '../data/mockUser';

interface UserStore {
  user: User;
  addPoints: (pts: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: MOCK_USER,
  addPoints: (pts) =>
    set((state) => ({
      user: {
        ...state.user,
        points: state.user.points + pts,
        totalReports: state.user.totalReports + 1,
      },
    })),
}));
