import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      unreadChatCount: 0,
      
      login: async (username, password) => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'https://orbitani-edu-backend-bwbghbeegsf4fwev.indonesiacentral-01.azurewebsites.net'}/api/auth/login`,
          formData,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
        
        const { access_token, role } = response.data
        localStorage.setItem('token', access_token)
        set({ token: access_token, user: { username, role }, isAuthenticated: true })
      },
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setUnreadChatCount: (n) => set({ unreadChatCount: n }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
