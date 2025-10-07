import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { loginService } from "@/services/auth"
import { useAuthStore } from "@/stores/auth.store"

// ✅ Schema validation
const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })
  const login = useAuthStore(state => state.login)

  const onSubmit = async (data: {email: string, password: string} ) => {
    try {
      const res = await loginService(data.email, data.password);
      login(res)
    }catch(err) {
      console.error("Login error:", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-blue-600">
            Đăng nhập
          </CardTitle>
          <p className="text-gray-500 text-sm">
            Chào mừng bạn quay lại 👋
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email")}
                className="mt-1 border-gray-300 focus-visible:ring-blue-500"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="mt-1 border-gray-300 focus-visible:ring-blue-500"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2 inline-block" />
              ) : null}
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              <a
                href="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            <div className="text-center text-sm text-gray-500 mt-2">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng ký ngay
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
