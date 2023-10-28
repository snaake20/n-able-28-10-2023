import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: {},
  saveUser: (sentUser) => {
    set({ user: sentUser });
  },
  logout: () => {
    set({ user: {} });
  },
}));
