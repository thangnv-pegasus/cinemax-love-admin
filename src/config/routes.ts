import DashboardPage from "../pages/dashboard";
import LoginPage from "../pages/login";

export const publicRoutes = [
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '',
    component: LoginPage
  }
]

export const privateRoutes = [
  {
    path: '/dashboard',
    component: DashboardPage
  }, 
  {
    path: ''
  }
]