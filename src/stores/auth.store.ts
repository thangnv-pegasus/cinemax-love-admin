import { create } from "zustand";
import type { IUser } from "../types/user";
import { persist } from "zustand/middleware";

interface ILoginResponse {
  access_token: string;
  user: IUser;
}

interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  token?: string;
  login: ({
    access_token,
    user
  }: ILoginResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (data) => set({ token: data.access_token, user: data.user, isAuthenticated: true }),
      logout: () => set({ token: undefined, user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" } // Lưu localStorage
  )
);