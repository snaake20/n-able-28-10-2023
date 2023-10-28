export const useAuthStore = create((get, set) => ({
  user: {},
  saveUser: (u) => set(() => ({user: {name: u?.name, email: u?.email, role: u?.role}})),
  isLoggedIn: !!get().user?.email
}))