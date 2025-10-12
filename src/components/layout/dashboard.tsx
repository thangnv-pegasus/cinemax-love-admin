import { Link, Outlet, useLocation } from "react-router";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Clapperboard, History, Home, LogOut, MonitorPlay, Users } from "lucide-react"
import HeaderAdmin from "./header/header-admin";
import { useAuthStore } from "@/stores/auth.store";
import { logoutService } from "@/services/auth";
import { toast } from "sonner";
import { getMe } from "@/services/users";
import { useEffect } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Quản lý phim",
    url: "/films",
    icon: MonitorPlay,
  },
  {
    title: "Quản lý người dùng",
    url: "/users",
    icon: Users,
  },
  {
    title: "Lịch sử xem phim",
    url: "/histories",
    icon: History,
  }
]

export default function DashboardLayout() {
  
  return (
     <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <HeaderAdmin />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}

function AppSidebar() {
  const path = useLocation()
  const logoutStore = useAuthStore(state => state.logout)
  const logout = async () => {
    try {
      const res = await logoutService()
      if(res?.status === 201) {
        logoutStore()
      }else {
        toast.error("Đăng xuất thất bại!")
      }
    } catch(err) {
      toast.error("Đăng xuất thất bại!")
      console.log('>>> err >> ', err)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton>
          <Link to="/" className="flex items-center gap-2 text-blue-500">
            <Clapperboard className="w-4 h-4"/>
            <span className="font-semibold text-lg">CinemaxLove</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="text-black">
        <SidebarGroup className="h-full">
          <SidebarGroupContent >
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.url === path.pathname} className="data-[active=true]:!text-white data-[active=true]:bg-blue-500">
                    <Link to={item.url} className="">
                      <item.icon />
                      <span className="">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton className="flex items-center gap-x-2 bg-transparent !px-2 cursor-pointer text-red-500 font-medium" onClick={logout}>
          <LogOut /><span>Đăng xuất</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}