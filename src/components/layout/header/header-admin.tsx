import { Bell, LogOut, Menu, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logoutService } from "@/services/auth"
import { useAuthStore } from "@/stores/auth.store"
import { toast } from "sonner"

export default function HeaderAdmin() {
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
    <header className="flex items-center justify-between px-4 py-2 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-xl font-semibold text-blue-500">Admin Panel</span>
        </div>
      </div>

      <div className="hidden md:flex items-center w-1/3">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full border-blue-100 focus-visible:ring-blue-500 hidden"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline font-medium text-gray-700">
                Admin
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-blue-500" /> Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-blue-500" /> Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4 text-red-500" /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
