import { create } from 'zustand';

export const useAuthStore = create((get, set) => ({
  user: {},
  saveUser: (sentUser) => {
    set({ user: sentUser });
  },
  isLoggedIn: !!get()?.user?.email,
}));
