import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const TIMEOUT = 30 * 60 * 1000; // 30 menit

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      unreadChatCount: 0,
      
      login: async (username, password) => {
        const params = new URLSearchParams()
        params.append('username', username)
        params.append('password', password)
        
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'https://orbitani-edu-backend-bwbghbeegsf4fwev.indonesiacentral-01.azurewebsites.net'}/api/auth/login`,
          params,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
        
        const { access_token, role } = response.data
        localStorage.setItem('token', access_token)
        localStorage.setItem('login_time', Date.now().toString())
        set({ token: access_token, role, user: { username, role }, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('login_time')
        set({ token: null, user: null, isAuthenticated: false, role: null })
      },
      setUser: (userData) => set({ user: userData }),
      setUnreadChatCount: (n) => set({ unreadChatCount: n }),
      checkSession: () => {
        const loginTime = localStorage.getItem('login_time')
        const token = localStorage.getItem('token')
        if (!token || !loginTime) return false
        
        const elapsed = Date.now() - parseInt(loginTime)
        if (elapsed > TIMEOUT) {
          localStorage.removeItem('token')
          localStorage.removeItem('login_time')
          set({ token: null, user: null, isAuthenticated: false })
          return false
        }
        return true
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
