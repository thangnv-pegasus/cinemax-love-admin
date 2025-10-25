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

// http.interceptors.response.use(function onFulfilled(response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   }, function onRejected(error) {
//     const store = useAuthStore()
//     if(error?.status === 401) {
//       store.logout()
//       redirect('/login')
//     }
//     return Promise.reject(error);
// });

export default http
