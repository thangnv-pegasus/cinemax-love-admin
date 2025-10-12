import FilmsPage from "@/pages/films";
import DashboardPage from "../pages/dashboard";
import LoginPage from "../pages/login";
import UsersPage from "@/pages/users";
import HistoryPage from "@/pages/histories";

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
    path: '/films',
    component: FilmsPage
  },
  {
    path: '/users',
    component: UsersPage
  },
  {
    path: '/histories',
    component: HistoryPage
  }
  // {
  //   path: '/*',
  //   component: 'not found'
  // }
]