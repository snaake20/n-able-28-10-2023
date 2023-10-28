import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: {},
  saveUser: (sentUser) => {
    set({ user: sentUser });
  },
  isLoggedIn: !!get()?.user?.email,
}));
