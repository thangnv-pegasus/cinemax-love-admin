import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store' // 👈 import zustand store của bạn

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_API_URL || 'http://localhost:2312/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token // get token from zustand store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default http
