import { create } from 'zustand';

export const useAuthStore = create((get, set) => ({
  user: {},
  saveUser: (user) => {
    set({ user });
  },
  isLoggedIn: !!get()?.user?.email,
}));
