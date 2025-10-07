import http from "@/config/axios";

export const loginService = async (email: string, password: string) => {
  const res = await http.post('/auth/login', { email, password });
  
  return res.data;
};

export const logoutService = async () => {
  const res = await http.post('/auth/logout')

  return res;
}