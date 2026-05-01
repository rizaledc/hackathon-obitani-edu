import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      unreadChatCount: 0,
      
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setUnreadChatCount: (n) => set({ unreadChatCount: n }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
